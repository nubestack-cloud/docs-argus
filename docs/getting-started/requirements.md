# Requirements

What you need before installing. The hub is modest; the watched clusters need almost
nothing.

## The hub's cluster

| Requirement | Detail |
|---|---|
| Kubernetes | 1.29 or later (1.30 or later to allow remediation), any conformant distribution, OpenShift included |
| Helm | 3.8 or later, on the machine you install from |
| Ingress | An ingress controller (or a Gateway API Gateway), and a hostname for the hub that your browser and your other clusters can reach. cert-manager is optional, for HTTPS |
| Storage | Any storage class, for a 10 GB database volume: the hub uses the default one, or one of your cluster's if none is the default. Without any, the database is temporary (fine for a trial). Plan about 0.5–1 GB per busy watched cluster |
| CPU and memory | The hub and its database request about 0.5 core and 1 GiB together, and may use up to 4 GiB; the Claude Code or Codex runner adds about half as much again |

Run a single hub instance. Agent connections are held in memory, so the hub does not scale
horizontally; the chart enforces one replica.

!!! note "The bundled database has no backups"
    Copy it off the cluster before each upgrade (one command, in
    [Upgrade and roll back](upgrade.md#back-up-first)). For history you must keep, use an
    external PostgreSQL with its own backups. See [Install the hub](install.md#before-you-start).

## Watched clusters

| Requirement | Detail |
|---|---|
| Kubernetes | 1.29 or later (1.30 or later to allow remediation) |
| Namespace | `argus-system`, for the agent |
| Resources | About 100m CPU and 256 MiB memory per agent; its limit (1 GiB) covers about 5,000 pods |
| Storage | None. The agent keeps its identity in a Secret in its own namespace |
| Permissions | Cluster-wide read at install; write only in namespaces you name, if you allow it |
| Network | Outbound to the hub's hostname. Nothing connects into the cluster |

## Network

The agent dials the hub, at the same hostname as the web interface. Nothing needs to connect
inbound to a watched cluster.

| From | To | Purpose |
|---|---|---|
| Operator browser | The hub's hostname | Web interface and API |
| Cluster agent | The hub's hostname | Enrolment, then the agent tunnel, held open |
| Hub | AI provider | Investigation, unless the provider is local |
| Hub | Repository host | Pull requests, if you register repositories |

See [Network requirements](../reference/network-requirements.md) for how the tunnel passes
through your ingress, and for networks that need a separate tunnel address.

## AI provider

One of:

- an OpenAI-compatible API endpoint and a key for it, hosted by anyone including you. A model
  you host yourself is yours to run: ARGUS does not install models
- Claude Code or Codex, which the hub chart runs beside the hub when you give it a credential

A model with a large context window and strong tool-calling behaviour produces markedly
better investigations than a small one.

## See also

- [Install the hub](install.md)
- [Network requirements](../reference/network-requirements.md)
- [AI providers](../administration/ai-providers.md)
