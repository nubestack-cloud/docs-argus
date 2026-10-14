# Your fleet

Besides incidents, ARGUS gives you a working view of every cluster it watches: what is
running, how it connects, what expires or breaks next, and what changed. Everything here is
read through the agent's read-only identity.

- [The overview](overview.md) — the fleet on one page: what is open, what waits on a person,
  what comes due, and how each cluster stands.
- [The cluster page](cluster-page.md) — one cluster's health, timeline, incidents and agent.
- [Map, network policy and traffic](map-and-network.md) — how workloads connect, and what
  may talk to what.
- [GitOps and Helm](gitops-and-helm.md) — what your controllers and releases report.
- [Certificates, upgrades and posture](checks.md) — what expires, what blocks the next
  Kubernetes version, and which settings carry risk.
- [The object panel](object-panel.md) — any object's summary, events, logs, metrics,
  relationships and history, from wherever it is named.
- [Search and compare](search-and-compare.md) — find an object across clusters, and compare
  two objects field by field.

Viewing a cluster needs **View clusters and their status**. Tabs that read live from the
cluster also need **Inspect live objects, events and logs on demand**; without it they stay
visible and disabled, with the missing capability named.

## See also

- [Incidents](../incidents/index.md)
- [Clusters](../administration/clusters.md)
- [Roles and capabilities](../reference/roles.md)
