# Install the hub

Two supported paths: Docker Compose for an evaluation on one machine, and Helm for a real
deployment. Both use published container images; nothing is built locally.

## Images

| Image | Purpose |
|---|---|
| `nubestack/argus-hub` | The hub: web interface, API, tunnel listener, background jobs |
| `nubestack/argus-agent` | The cluster agent |
| `nubestack/argus-cli-runner` | Optional runner, only for agent-CLI analysis |

Pin an explicit image tag rather than tracking a moving one, so an unplanned restart cannot
change the version you are running.

## Docker Compose

Use Compose to evaluate ARGUS on a single machine. It starts the hub, PostgreSQL, and the
local embedding model.

Choose the configuration that matches how you want analysis to run — an external API
provider, or an agent CLI runner — and copy its environment template. Then set, at minimum:

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
