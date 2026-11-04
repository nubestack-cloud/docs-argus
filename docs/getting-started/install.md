# Install the hub

ARGUS has two parts, each a Helm chart:

- the **hub** — the web interface, the API and the database. You install it once.
- the **agent** — runs in each cluster you want to watch. The hub installs one for its own
  cluster automatically.

So one `helm install` gives you a hub that is already watching the cluster it runs in.

## Before you start

You need:

- a Kubernetes cluster for the hub, version 1.29 or later (1.30 or later if ARGUS may change
  anything). RKE2, vanilla Kubernetes, OKD and OpenShift are supported;
- Helm 3.8 or later and `kubectl`, configured for that cluster;
- an ingress controller in that cluster, or a Gateway API Gateway (see
  [Gateway API](#gateway-api-instead-of-ingress));
- a hostname for the hub that resolves to your ingress controller's reachable IP address.
  Your browser and any clusters you connect must be able to reach it. See the examples below.

The hub uses the cluster's default ingress class and storage class, or chooses one if none is
marked as the default. It detects OKD/OpenShift and adapts to its security policy automatically.
The database gets a 10 GiB volume by default. With no storage class, it uses temporary storage
and loses its data when the pod restarts; use this only for a trial.

See [Requirements](requirements.md) for the full list.

## Step 1: Install the hub

Replace `argus.example.com` with your hostname. This is the only value you need to set:

```bash
helm install argus-hub oci://registry-1.docker.io/nubestack/argus-hub-chart --version 0.2.0 \
  -n argus-system --create-namespace \
  --set ingress.host=argus.example.com
```

This installs the hub, its database and an agent for this cluster. The command uses HTTP at
`http://argus.example.com`; cert-manager is not required. For HTTPS, add one of the certificate
options below when you install.

### Optional install settings

The defaults work for a first install. For HTTPS, choose one of the first two options:
cert-manager or your own certificate. Leave both options out to use HTTP.

| Option | Default | What to add or change |
|---|---|---|
| HTTPS with cert-manager | Off; `ingress.clusterIssuer` is empty | Add `--set ingress.clusterIssuer=letsencrypt`, using an existing ClusterIssuer name from `kubectl get clusterissuer`. cert-manager obtains the certificate and TLS is enabled automatically. The install stops if the issuer does not exist |
| HTTPS with your own certificate | `ingress.tls.enabled=false`; Secret name defaults to `argus-hub-tls` | Add both `--set ingress.tls.enabled=true` and `--set ingress.tls.secretName=argus-tls`. Before installing, create the TLS Secret `argus-tls` in `argus-system` with your certificate and private key. Leave `ingress.clusterIssuer` unset |
| `ingress.className` | Automatically selected | Choose a specific ingress class, for example `--set ingress.className=nginx` or `--set ingress.className=openshift-default`; check names with `kubectl get ingressclass` |
| `ingress.annotations` | `{}` | Add controller-specific settings through a values file with `-f values.yaml`. nginx timeouts are added automatically |
| `postgres.bundled.persistence.size` | `10Gi` | Choose the database volume size before installing, for example `--set postgres.bundled.persistence.size=50Gi`. Plan about 0.5–1 GiB per busy cluster; Helm cannot grow this volume later |
| `postgres.bundled.persistence.storageClass` | Automatically selected | Choose a specific storage class with `--set postgres.bundled.persistence.storageClass=<name>`; check names with `kubectl get storageclass` |
| `global.openshift` | Automatically detected | Force OpenShift security settings for the hub and its agent with `--set global.openshift=true` only if automatic detection is unavailable |

For a database with its own backups, see [An external database](#an-external-database).

### Example: RKE2 or vanilla Kubernetes

Suppose your ingress controller is reachable at `192.0.2.10`. Replace that example IP with
your controller's IP and create a DNS A record:

```text
argus.example.com.  A  192.0.2.10
```

For a local trial, you can add this to your client machine's hosts file instead
(`/etc/hosts` on Linux or macOS):

```text
192.0.2.10 argus.example.com
```

Run the Step 1 command with `--set ingress.host=argus.example.com`, then open
`http://argus.example.com` once the hub is ready. If you have no DNS name to spare,
`--set ingress.host=argus.192.0.2.10.nip.io` uses that IP without a DNS change.

### Example: OKD or OpenShift

Use a hostname under your cluster's apps domain and point it at the apps/ingress floating
IP reachable from your clients. For example, if the apps domain is `apps.cluster.example.com`
and the apps/ingress IP is `198.51.100.20`, create this DNS A record. These are documentation
examples; replace them with your own domain and IP:

```text
argus.apps.cluster.example.com.  A  198.51.100.20
```

If your cluster already has wildcard DNS for `*.apps.cluster.example.com` pointing
there, the hostname resolves already. Otherwise, create that A record or add this to your
client machine's hosts file for a local trial:

```text
198.51.100.20 argus.apps.cluster.example.com
```

Install with that hostname, replacing the example domain and IP with your own:

```bash
helm install argus-hub oci://registry-1.docker.io/nubestack/argus-hub-chart --version 0.2.0 \
  -n argus-system --create-namespace \
  --set ingress.host=argus.apps.cluster.example.com
```

OKD/OpenShift [creates a Route from the chart's Ingress automatically](https://docs.okd.io/4.21/networking/ingress_load_balancing/routes/creating-basic-routes.html).
Once ready, open
`http://argus.apps.cluster.example.com`. HTTPS uses the optional certificate settings
above; an apps hostname alone does not enable it.

In either example, a hosts-file entry applies only to that machine. Before connecting
other clusters, make sure their agents can resolve the hostname through DNS and reach
the ingress IP over the network.

### Check the installation

Wait for it to start. This takes about a minute, mostly downloading images:

```bash
kubectl -n argus-system rollout status deploy/argus-hub --timeout=5m
```

The agent connects by itself within a minute and appears on **Clusters** as `local`.
Agents use the same address as the web interface, so there is no second port to open. The
chart configures ingress-nginx to keep their connections open. With another controller or
a load balancer in front of it, allow idle connections of at least 60 seconds; agents send
a heartbeat every 30.

!!! note "Always pass `--version`"
    Each chart version always installs exactly the same software. A misspelt option stops the
    install and names the option, rather than being ignored.

## Step 2: Sign in

Open `http://<your-hostname>` (or `https://<your-hostname>` if you enabled TLS), then
[sign in and change the bootstrap password](first-sign-in.md).

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

    - **Anthropic API key:** [console.anthropic.com](https://console.anthropic.com/) →
      **API keys** → **Create key**. It starts `sk-ant-api03-`. Use this for a team, and for
      automatic investigation.
    - **Your own Claude subscription (Pro or Max), for your own use:** on a machine with
      Claude Code (`npm install -g @anthropic-ai/claude-code`), run `claude setup-token`, sign
      in in the browser it opens, and copy the token it prints. It starts `sk-ant-oat01-`.
      Anthropic's [terms](https://code.claude.com/docs/en/legal-and-compliance) expect a plan to be used by the person who
      holds it, so don't share one across a team.
    - **Codex:** an OpenAI API key, from
      [platform.openai.com/api-keys](https://platform.openai.com/api-keys) →
      **Create new secret key**. It starts `sk-`.

Then upgrade the hub with it. For an Anthropic API key:

```bash
helm upgrade argus-hub oci://registry-1.docker.io/nubestack/argus-hub-chart --version 0.2.0 \
  -n argus-system --reset-then-reuse-values \
  --set-file cliRunner.modelCredential.anthropicApiKey=$HOME/.argus/model-credential
```

For the others, swap the `--set-file` option:

| You have | Option |
|---|---|
| An Anthropic API key | `cliRunner.modelCredential.anthropicApiKey` |
| Your own Claude subscription | `cliRunner.modelCredential.claudeCodeOauthToken`, plus `--set cliRunner.authMode=subscription` |
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
