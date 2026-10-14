# Install the hub

Three supported paths, all from published artifacts — nothing is built locally:

| You want | Use |
|---|---|
| A hub watching one cluster, in minutes | `argusctl install` |
| To evaluate on one machine | Docker Compose |
| A durable install | Helm |

## What is published

Every release publishes, under one version:

| Artifact | Where |
|---|---|
| Hub chart | `oci://registry-1.docker.io/nubestack/argus-hub-chart` |
| Agent chart | `oci://registry-1.docker.io/nubestack/argus-agent-chart` |
| `argusctl`, the install and enrolment command line | `nubestack/argusctl` |
| Images the charts run | `nubestack/argus-hub`, `nubestack/argus-agent`, `nubestack/argus-cli-runner` |

A chart version pins every image it runs by digest, so installing a given `--version` installs
the same software every time. Always pass `--version`. Images are published for `linux/amd64`
and `linux/arm64`.

## Five-minute install

One command takes an empty Kubernetes cluster to a running hub that already watches that
cluster. Run `argusctl` from its image:

```bash
ARGUS_VERSION=<version>    # a published release, such as 0.2.0-rc.2
alias argusctl='docker run --rm -it --network host -v "$HOME/.kube:$HOME/.kube:ro" -e KUBECONFIG="$HOME/.kube/config" nubestack/argusctl:'"$ARGUS_VERSION"
argusctl install --context <kube-context> --yes
```

You need a kubeconfig context with cluster-admin on the target cluster, and nodes that can
pull from Docker Hub. It:

1. Checks, changing nothing, that it can create what it needs, that a default storage class
   exists and a node is ready, and how agents will reach the tunnel. Each failure names the
   flag or command that fixes it.
2. Installs the hub with a bundled PostgreSQL, showing each pod's state until it is ready.
3. Enrols this cluster's agent, accepts it and waits for it to be **Active**.
4. Prints how to sign in, and the command that reads the administrator password.

The one choice with lasting consequences is how agents reach the tunnel, because the address
is written into the tunnel certificate. A cluster with a load-balancer gets one; otherwise a
node port is used. `--tunnel-exposure` and `--tunnel-endpoint` choose for you.

| Flag | Meaning |
|---|---|
| `--context`, `--kubeconfig` | Where to install |
| `--yes` | Answer yes to every question |
| `--storage-class` | Storage class for the bundled PostgreSQL. Default: the cluster's default |
| `--model-credential-file` | A Claude subscription token, Anthropic API key or OpenAI API key in a file, to deploy the agent-CLI runner with it |
| `--ingress-host`, `--ingress-class` | Serve the web interface on a plain-HTTP ingress at that host |
| `--display-name` | This cluster's name on the hub |

Running it again is safe: it leaves an existing hub alone. It does not set up TLS, an
external database or remediation; for those, use Helm. Further clusters are enrolled from
the hub or with `argusctl cluster add`.

## Docker Compose

Use Compose to evaluate ARGUS on a single machine. It starts the hub, PostgreSQL and the
local embedding model. Choose the configuration that matches how you want analysis to run —
an external API provider, or an agent CLI runner — and copy its environment template. Then set, at minimum:

| Setting | Value |
|---|---|
| Bootstrap password | The initial password for the built-in administrator |
| Tunnel public endpoint | The host and port your clusters will dial, not `localhost` |

Start the stack, then pull the embedding model once:

```bash
docker compose exec ollama ollama pull bge-m3
```

Open `http://localhost:8080` and sign in.

!!! warning "Compose is for evaluation"
    There are no database backups in a Compose deployment. Do not point it at clusters
    whose incident history you need to keep.

## Helm

Use Helm for a deployment you intend to keep.

Copy the values file for your chosen analysis configuration, replace every placeholder, and
install the hub chart into its own namespace. The settings that matter most:

| Setting | Why it matters |
|---|---|
| Tunnel public endpoint | The address agents dial. Agents pin it at enrolment; changing it later means re-enrolling |
| Tunnel service type | Use a load balancer or a deliberate node port. Agents in other clusters must reach it |
| PostgreSQL mode | Use an external, backed-up instance for anything you care about |
| Replica count | Keep it at one |

The chart generates a bootstrap password and stores it in a secret in the hub's namespace.
Read it once, sign in, and change it.

### Exposing the hub

The web interface and API are ordinary HTTP and belong behind your normal ingress with TLS.
The tunnel port is separate and must not pass through an HTTP proxy.

## After installing

1. [Sign in and secure the bootstrap account](first-sign-in.md).
2. [Configure an AI provider and test it](configure-analysis.md).
3. [Connect your first cluster](connect-a-cluster.md).

## See also

- [Requirements](requirements.md)
- [Configure analysis](configure-analysis.md)
- [Data retention](../administration/retention.md)
