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
- Helm 3.14 or later and `kubectl`, configured for that cluster;
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
cert-manager or your own certificate. Leave both options out to use HTTP. On OKD or OpenShift
there is a third, simpler way: [the cluster's own certificate](#https-with-the-clusters-own-certificate).

| Option | Default | What to add or change |
|---|---|---|
| HTTPS with cert-manager | Off; `ingress.clusterIssuer` is empty | Add `--set ingress.clusterIssuer=letsencrypt`, using an existing ClusterIssuer name from `kubectl get clusterissuer`. cert-manager obtains the certificate and TLS is enabled automatically. The install stops if the issuer does not exist |
| HTTPS with your own certificate | `ingress.tls.enabled=false`; Secret name defaults to `argus-hub-tls` | Add both `--set ingress.tls.enabled=true` and `--set ingress.tls.secretName=argus-tls`. Before installing, create the TLS Secret `argus-tls` in `argus-system` with your certificate and private key. Leave `ingress.clusterIssuer` unset |
| `ingress.className` | Automatically selected | Choose a specific ingress class, for example `--set ingress.className=nginx` or `--set ingress.className=openshift-default`; check names with `kubectl get ingressclass` |
| `ingress.annotations` | `{}` | Add controller-specific settings through a values file with `-f values.yaml`. nginx timeouts are added automatically |
| `postgres.bundled.persistence.size` | `10Gi` | Choose the database volume size before installing, for example `--set postgres.bundled.persistence.size=50Gi`. Plan about 0.5–1 GiB per busy cluster; Helm cannot grow this volume later |
| `postgres.bundled.persistence.storageClass` | Automatically selected | Choose a specific storage class with `--set postgres.bundled.persistence.storageClass=<name>`; check names with `kubectl get storageclass` |
| `resources.requests.cpu`, `cliRunner.resources.requests.cpu` | `250m` each | Lower them on a small cluster where the hub or the runner stays `Pending` with *Insufficient cpu*, for example `--set resources.requests.cpu=100m`. Neither has a CPU limit, so this changes scheduling, not speed |
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

There is no ingress controller to install: the cluster's own router is one, and the chart
selects its `openshift-default` class automatically. Use a hostname under the cluster's apps
domain, which you can look up with:

```bash
kubectl -n openshift-ingress-operator get ingresscontroller default -o jsonpath='{.status.domain}{"\n"}'
```

OpenShift needs wildcard DNS for `*.<apps domain>` pointing at its router, so a name such as
`argus.apps.cluster.example.com` normally resolves already, with no DNS record to create. If your
machine cannot resolve it (a lab without that DNS), add a hosts-file entry pointing it at the
router's address: the ingress VIP on bare metal, OpenStack or vSphere, or the router's load
balancer on a cloud. For example (documentation addresses; use your own):

```text
198.51.100.20 argus.apps.cluster.example.com
```

Install with that hostname:

```bash
helm install argus-hub oci://registry-1.docker.io/nubestack/argus-hub-chart --version 0.2.0 \
  -n argus-system --create-namespace \
  --set ingress.host=argus.apps.cluster.example.com
```

The chart creates an ordinary Ingress. OpenShift
[turns it into a Route](https://docs.okd.io/latest/networking/ingress_load_balancing/routes/creating-basic-routes.html)
(`kubectl -n argus-system get route` shows it), and the router serves it. The router keeps
WebSockets open, so the agent connections need no extra settings. Open
`http://argus.apps.cluster.example.com` once the hub is ready.

#### HTTPS with the cluster's own certificate

The router already has a certificate for `*.<apps domain>`, so HTTPS needs neither cert-manager
nor a Secret. Add these two options to the install command:

```bash
  --set 'ingress.annotations.route\.openshift\.io/termination=edge' \
  --set publicApiUrl=https://argus.apps.cluster.example.com
```

The annotation makes the Route terminate TLS with the router's certificate and redirect HTTP to
HTTPS. `publicApiUrl` tells the hub and its agents that the address is now `https://`. Without it,
agents keep dialling `http://`, the router redirects them, and they cannot connect.

On a new cluster the router's certificate is signed by the cluster's own CA. Browsers then show a
warning, and agents in **other** clusters need that CA. Save it with:

```bash
kubectl -n openshift-config-managed get configmap default-ingress-cert \
  -o jsonpath='{.data.ca-bundle\.crt}' > ingress-ca.pem
```

Pass it when you install each of those agents, with `--set-file hub.caBundle=ingress-ca.pem`. To
avoid all of this, replace the router's default certificate with a trusted one
([Replacing the default ingress certificate](https://docs.okd.io/latest/security/certificates/replacing-default-ingress-certificate.html)).

In either example, a hosts-file entry applies only to that machine. Before connecting
other clusters, make sure their agents can resolve the hostname through DNS and reach
the router or ingress IP over the network.

### Check the installation

Wait for it to start. This takes about a minute, mostly downloading images:

```bash
kubectl -n argus-system rollout status deploy/argus-hub --timeout=5m
```

The agent connects by itself within a minute and appears on **Clusters** as `local`.
Agents use the same address as the web interface, so there is no second port to open. The
chart configures ingress-nginx to keep their connections open, and the OpenShift router keeps
them open by default. With another controller or a load balancer in front of it, allow idle
connections of at least 60 seconds; agents send a heartbeat every 30.

!!! note "Always pass `--version`"
    Each chart version always installs exactly the same software. A misspelt option stops the
    install and names the option, rather than being ignored.

## Step 2: Sign in

Open `http://<your-hostname>` (or `https://<your-hostname>` if you enabled TLS), then
[sign in and change the bootstrap password](first-sign-in.md).

## Step 3: Connect an AI model

ARGUS uses an AI model to investigate incidents. Pick one route:

| Route | What you need | Where you set it up |
|---|---|---|
| **A model behind an API** | Any OpenAI-compatible endpoint and its key, including a model you host yourself | Only in the web interface: go straight to [Configure analysis](configure-analysis.md). Nothing to install |
| **Claude Code or Codex** | A credential for one of them | On the cluster first (below), then in the web interface |

### Claude Code or Codex

The hub runs the CLI for you in a separate *runner* pod; it only needs the credential. Neither
CLI has to be installed on the machine you run `helm` from. There are five steps, in this
order.

#### 1. Get the credential

There are three kinds. **The first characters of the credential tell you which kind you have,
and the kind decides the Helm option you use in step 3**: putting a credential in the wrong
option is the most common reason the first investigation fails.

| Kind | Starts with | How to get it | Use it for |
|---|---|---|---|
| Anthropic API key | `sk-ant-api03-` | [console.anthropic.com](https://console.anthropic.com/) → **API keys** → **Create key** | A team, and automatic investigation. Billed per use |
| Claude subscription token (Pro or Max) | `sk-ant-oat01-` | On a machine with Claude Code (`npm install -g @anthropic-ai/claude-code`), run `claude setup-token`, sign in in the browser it opens, and copy the token it prints | Your own use only: Anthropic's [terms](https://code.claude.com/docs/en/legal-and-compliance) expect a plan to be used by the person who holds it, so don't share one across a team |
| OpenAI API key (Codex) | `sk-` (often `sk-proj-`) | [platform.openai.com/api-keys](https://platform.openai.com/api-keys) → **Create new secret key** | Codex |

!!! warning "A subscription token is not an API key"
    `claude setup-token` prints a token beginning `sk-ant-oat01-`. It goes in
    `claudeCodeOauthToken`, never in `anthropicApiKey`. The chart recognises the two by their
    prefix and stops the upgrade if they are swapped.

#### 2. Save it to a file

So that it never shows on screen or in your shell history. The command asks you to paste it,
and nothing appears as you paste:

```bash
mkdir -p ~/.argus && chmod 700 ~/.argus
printf 'Paste the credential, then press Enter: '; read -rs TOKEN; echo
printf '%s' "$TOKEN" > ~/.argus/model-credential && unset TOKEN && chmod 600 ~/.argus/model-credential
```

To check which kind you saved without printing it:
`cut -c1-13 ~/.argus/model-credential` shows only the prefix.

#### 3. Give it to the hub

Use the tab matching the prefix from step 1:

=== "Anthropic API key (sk-ant-api03-)"

    ```bash
    helm upgrade argus-hub oci://registry-1.docker.io/nubestack/argus-hub-chart --version 0.2.0 \
      -n argus-system --reset-then-reuse-values \
      --set-file cliRunner.modelCredential.anthropicApiKey=$HOME/.argus/model-credential
    ```

=== "Claude subscription (sk-ant-oat01-)"

    ```bash
    helm upgrade argus-hub oci://registry-1.docker.io/nubestack/argus-hub-chart --version 0.2.0 \
      -n argus-system --reset-then-reuse-values \
      --set-file cliRunner.modelCredential.claudeCodeOauthToken=$HOME/.argus/model-credential \
      --set cliRunner.authMode=subscription
    ```

    `authMode=subscription` makes the cost of an investigation show as *not measured*, rather
    than as a misleading $0.00.

=== "OpenAI API key (Codex)"

    ```bash
    helm upgrade argus-hub oci://registry-1.docker.io/nubestack/argus-hub-chart --version 0.2.0 \
      -n argus-system --reset-then-reuse-values \
      --set-file cliRunner.modelCredential.openaiApiKey=$HOME/.argus/model-credential
    ```

=== "A Secret you manage"

    Create a Secret in `argus-system` with one key named `ANTHROPIC_API_KEY`,
    `CLAUDE_CODE_OAUTH_TOKEN` or `OPENAI_API_KEY` (by the same prefix rule), then:

    ```bash
    helm upgrade argus-hub oci://registry-1.docker.io/nubestack/argus-hub-chart --version 0.2.0 \
      -n argus-system --reset-then-reuse-values \
      --set cliRunner.modelCredential.existingSecret=<secret-name>
    ```

This adds the runner pod. Wait for it, then delete the file:

```bash
kubectl -n argus-system rollout status deploy/argus-hub-cli-runner --timeout=5m
rm ~/.argus/model-credential
```

If the runner or the hub stays `Pending`, the cluster has no CPU to spare for it: see
[The hub does not start](../troubleshooting.md#the-hub-does-not-start-after-installing).

!!! warning "Never pass a credential with plain `--set`"
    It would be saved in your shell history. Use `--set-file`, or a Secret.

#### 4. Add the provider in the web interface

Go to **Settings → AI providers → Add a provider → Agent CLI**:

| Field | Value |
|---|---|
| Runner URL | `http://argus-hub-cli-runner:8090` exactly (with a release name other than `argus-hub`: `http://<release>-cli-runner:8090`) |
| Agent | `claude` for either Anthropic credential, `codex` for an OpenAI key |
| Runner token | Leave blank: the hub already has it |

The details, with screenshots, are in [Configure analysis](configure-analysis.md#agent-cli-runner).

#### 5. Test it, then run one investigation

**Test connection** proves the runner URL, the runner token and that the CLI is installed. It
does **not** use the model credential. To prove that, open any incident and select
**Investigate**: a completed analysis means everything works. If it fails with
*Invalid API key*, the credential is in the wrong option: see
[Analysis fails immediately](../troubleshooting.md#analysis-fails-immediately).

### Changing the credential later

Run step 3 again with the new credential's option, **and clear the option you used before**, or
`--reset-then-reuse-values` keeps it. For example, moving from an API key to a subscription
token:

```bash
helm upgrade argus-hub oci://registry-1.docker.io/nubestack/argus-hub-chart --version 0.2.0 \
  -n argus-system --reset-then-reuse-values \
  --set cliRunner.modelCredential.anthropicApiKey= \
  --set-file cliRunner.modelCredential.claudeCodeOauthToken=$HOME/.argus/model-credential \
  --set cliRunner.authMode=subscription
```

If you swap them by mistake (a subscription token in `anthropicApiKey`, or an API key in
`claudeCodeOauthToken`), the upgrade stops and names the option to use instead.

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
