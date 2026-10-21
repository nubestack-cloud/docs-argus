# Install the hub

ARGUS has two parts, each a Helm chart:

- the **hub** — the web interface, the API and the database. You install it once.
- the **agent** — runs in each cluster you want to watch. The hub installs one for its own
  cluster automatically.

So one `helm install` gives you a hub that is already watching the cluster it runs in.

## Before you start

You need:

- a Kubernetes cluster for the hub, version 1.29 or later (1.30 or later if ARGUS may change
  anything). Any distribution works, OpenShift included: the hub finds your storage and ingress
  controller, and adapts to OpenShift's security policy, by itself;
- Helm 3.8 or later on your machine;
- an ingress controller in that cluster, or a Gateway API Gateway (see
  [Gateway API](#gateway-api-instead-of-ingress));
- a hostname for the hub, such as `argus.example.com`, that your browser and your other
  clusters can reach;
- optionally, cert-manager, to get HTTPS without handling certificates yourself.

The database needs a volume. The hub uses your cluster's default storage class, or one of its
storage classes if none is the default. On a cluster with no storage at all it still installs, but
the database is temporary and loses its data when its pod restarts: fine for a trial only.

!!! tip "No DNS name to spare?"
    `argus.<ingress-ip>.nip.io` points at your ingress controller's IP address with no DNS
    change, which is enough for a trial.

Decide two things now, because they are hard to change later:

1. **How big the database should be.** The default is 10 GB, enough for a handful of clusters.
   Plan about 0.5–1 GB for each busy cluster you will watch. Helm cannot grow the volume after
   installing, so pick the size up front.
2. **Where the data lives.** By default the hub runs its own database in the cluster. That is the
   simplest choice, but it has no scheduled backups. If incident history and the audit log must
   survive losing the cluster, use a managed database instead: see
   [An external database](#an-external-database).

See [Requirements](requirements.md) for the full list.

## Step 1: Install the hub

```bash
helm install argus-hub oci://registry-1.docker.io/nubestack/argus-hub-chart --version 0.2.0 \
  -n argus-system --create-namespace \
  --set ingress.host=argus.example.com \
  --set ingress.clusterIssuer=letsencrypt
```

| Option | What to put |
|---|---|
| `ingress.host` | **Required.** The hub's hostname |
| `ingress.clusterIssuer` | The name of a cert-manager ClusterIssuer in your cluster (`kubectl get clusterissuer`), for HTTPS. The install stops if there is none by that name. No cert-manager? Leave it out and add `--set ingress.tls.enabled=true --set ingress.tls.secretName=<your TLS Secret>` instead. **Plain HTTP, for a trial:** leave out both; the hub is then at `http://<host>`, and agents still encrypt their own connection inside it |
| `ingress.className` | Only to choose a specific ingress controller. Without it, the hub uses the default one, or one of your cluster's ingress controllers if none is the default |
| `postgres.bundled.persistence.size` | Only if you need more than 10Gi, for example `50Gi` |
| `postgres.bundled.persistence.storageClass` | Only to choose a specific storage class. Without it, the hub uses the cluster's default, or one of its storage classes if there is no default |

The chart creates one Ingress for the web interface, the API and the agents' connection. Your
ingress controller handles HTTPS with the certificate cert-manager issues (or your Secret), and it
must keep the agents' connections open: the chart configures ingress-nginx for this. With another
controller, or a load balancer in front of it, allow idle connections of at least 60 seconds —
agents send a heartbeat every 30.

Wait for it to start. This takes about a minute, mostly downloading images:

```bash
kubectl -n argus-system rollout status deploy/argus-hub --timeout=5m
```

You now have the hub, its database, and an agent for this cluster. The agent connects by itself
within a minute and appears on **Clusters** as `local`: there is no token to issue and nothing to
accept. Agents connect through the same address as the web interface, so there is no second port
to open.

!!! note "Always pass `--version`"
    Each chart version always installs exactly the same software. A misspelt option stops the
    install and names the option, rather than being ignored.

## Step 2: Sign in

[Sign in and change the bootstrap password](first-sign-in.md).

## Step 3: Connect an AI model

ARGUS uses an AI model to investigate incidents. Pick one:

- **A model behind an API** — any OpenAI-compatible endpoint, including a model you host
  yourself. Add it in the web interface: see [Configure analysis](configure-analysis.md).
  Nothing to install.
- **Claude Code or Codex** — the hub runs these for you once you give it a credential, as below.

### Claude Code or Codex

The hub runs these for you; it needs only their credential. Neither has to be installed on the
machine you run `helm` from.

Put the credential in a file there, without it showing on screen or in your shell history. The
command asks you to paste it, and nothing appears as you paste:

```bash
mkdir -p ~/.argus && chmod 700 ~/.argus
printf 'Paste the credential, then press Enter: '; read -rs TOKEN; echo
printf '%s' "$TOKEN" > ~/.argus/model-credential && unset TOKEN && chmod 600 ~/.argus/model-credential
```

!!! info "How to get the credential"
    On any machine with a browser:

    - **Claude subscription (Pro or Max):** on a machine with Claude Code
      (`npm install -g @anthropic-ai/claude-code`), run `claude setup-token`, sign in in the
      browser it opens, and copy the token it prints. It starts `sk-ant-oat01-`.
    - **Anthropic API key:** [console.anthropic.com](https://console.anthropic.com/) →
      **API keys** → **Create key**. It starts `sk-ant-api03-`.
    - **Codex:** an OpenAI API key, from
      [platform.openai.com/api-keys](https://platform.openai.com/api-keys) →
      **Create new secret key**. It starts `sk-`.

Then upgrade the hub with it. For a Claude subscription:

```bash
helm upgrade argus-hub oci://registry-1.docker.io/nubestack/argus-hub-chart --version 0.2.0 \
  -n argus-system --reset-then-reuse-values \
  --set-file cliRunner.modelCredential.claudeCodeOauthToken=$HOME/.argus/model-credential \
  --set cliRunner.authMode=subscription
```

For the others, swap the `--set-file` option:

| You have | Option |
|---|---|
| A Claude subscription | `cliRunner.modelCredential.claudeCodeOauthToken`, plus `--set cliRunner.authMode=subscription` |
| An Anthropic API key | `cliRunner.modelCredential.anthropicApiKey` |
| An OpenAI API key (Codex) | `cliRunner.modelCredential.openaiApiKey` |
| The credential in a Secret already | `cliRunner.modelCredential.existingSecret`, with key `CLAUDE_CODE_OAUTH_TOKEN`, `ANTHROPIC_API_KEY` or `OPENAI_API_KEY` |

Once the upgrade is done, delete the file: `rm ~/.argus/model-credential`.

!!! warning "Never pass a credential with plain `--set`"
    It would be saved in your shell history. Use `--set-file`, or a Secret.

Then add a provider of kind **CLI**, with runner URL `http://argus-hub-cli-runner:8090`: see
[Configure analysis](configure-analysis.md).

## Step 4: Add your other clusters

[Connect a cluster](connect-a-cluster.md): one at a time from the web interface, or a whole
fleet with one token and your GitOps tool.

## Other ways to install

Helm is the way to install ARGUS. Two situations change the command.

### No ingress, just trying it

Install without any `--set` options, then open the hub through a port-forward:

```bash
kubectl -n argus-system port-forward svc/argus-hub 8080:8080
```

Open `http://localhost:8080`. The hub watches its own cluster; other clusters cannot reach it.

### Gateway API instead of Ingress

Attach the hub to a Gateway you run, instead of setting `ingress.host`:

```bash
helm install argus-hub oci://registry-1.docker.io/nubestack/argus-hub-chart --version 0.2.0 \
  -n argus-system --create-namespace \
  --set httpRoute.host=argus.example.com \
  --set 'httpRoute.parentRefs[0].name=<gateway>' \
  --set 'httpRoute.parentRefs[0].namespace=<gateway-namespace>'
```

The chart creates an HTTPRoute for the web interface, the API and the agents' connection. The
Gateway holds the certificate for the hostname (add `--set httpRoute.https=false` for plain
HTTP), and it must let connections stay open: agents send a heartbeat every 30 seconds.

## An external database

For production, point the hub at a managed PostgreSQL or a CloudNativePG cluster, so the
database has its own replication, backups and point-in-time recovery. It needs PostgreSQL 16
with the `pgvector` extension, and two roles: one that owns the schema and runs migrations, and
`argus_app`, which the hub runs as and which must not bypass row-level security. Give the hub
both connection strings in one Secret and install with:

```bash
--set postgres.mode=external \
--set postgres.external.existingSecret=argus-db \
--set postgres.external.appPasswordKey=appPassword
```

The [install guide in the ARGUS repository](https://github.com/nubestack-cloud/argus/blob/main/docs/INSTALL.md#external-postgres) has the SQL to
prepare the database, the Secret's format, and a CloudNativePG example.

!!! warning "The built-in database has no backups"
    Copy it off the cluster before every upgrade (one command, in [Upgrade and roll
    back](upgrade.md#back-up-first)); that copy is also how an upgrade is rolled back. Nothing is
    backed up for you: findings are detected
    again by the agents, but incident history, the audit log, settings and the hub's own keys
    (without which every cluster must be added again) are only as safe as the volume they are on.

## Uninstalling

`helm -n argus-system uninstall argus-hub` removes the hub and this cluster's agent but keeps the
database and its generated passwords, so a reinstall finds its data again. Before reinstalling,
decommission the old `local` cluster on **Clusters**, so the new agent can connect afresh.
Deleting the database volume (`data-argus-hub-postgres-0`) removes the data for good.

## See also

- [Requirements](requirements.md)
- [Upgrade and roll back](upgrade.md)
- [Network requirements](../reference/network-requirements.md)
- [Data retention](../administration/retention.md)
