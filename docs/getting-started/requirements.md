# Requirements

What you need before installing. The hub is modest; the watched clusters need almost
nothing.

## Hub

| Resource | Evaluation | Production |
|---|---|---|
| CPU | 2 cores | 4 cores |
| Memory | 4 GB | 8 GB |
| Disk | 20 GB | Sized for incident retention, plus database backups |
| PostgreSQL | Bundled is fine | External, with backups |

Run a single hub instance. Agent connections are held in memory, so the hub does not scale
horizontally.

If you use the local embedding model for related-analysis retrieval, allow roughly 1.5 GB
of disk for the model itself.

## Watched clusters

| Requirement | Detail |
|---|---|
| Kubernetes | 1.25 or later |
| Namespace | One namespace for the agent, created at install |
| Resources | Approximately 100m CPU and 128 MiB memory per agent |
| Persistence | A small volume, so the agent keeps its certificate across restarts |
| Permissions | Cluster-wide read at install; write only in namespaces you name |

## Network

The agent dials the hub. Nothing needs to connect inbound to a watched cluster.

| From | To | Purpose |
|---|---|---|
| Operator browser | Hub HTTP port | Web interface and API |
| Cluster agent | Hub tunnel port | Mutual-TLS tunnel, held open |
| Cluster agent | Hub HTTP port | Enrolment, before the tunnel exists |
| Hub | AI provider | Investigation, unless the provider is local |
| Hub | Repository host | Pull requests, if you register repositories |

The hub's tunnel address must be reachable from every watched cluster, and must be the
address you configure as the tunnel's public endpoint — agents pin the address they
enrolled against.

!!! warning "The tunnel is not an HTTP ingress"
    Expose the tunnel port as its own service. Putting it behind an HTTP ingress or a
    TLS-terminating proxy breaks mutual TLS, which is the agent's only credential.

## AI provider

One of:

- an OpenAI-compatible API endpoint and a key for it, hosted by anyone including you
- an agent CLI runner deployed beside the hub, with credentials for the CLI it drives

A model with a large context window and strong tool-calling behaviour produces markedly
better investigations than a small one.

## See also

- [Install the hub](install.md)
- [Network requirements](../reference/network-requirements.md)
- [AI providers](../administration/ai-providers.md)
