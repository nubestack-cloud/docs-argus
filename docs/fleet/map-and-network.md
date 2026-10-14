# Map, network policy and traffic

Three tabs on the cluster page describe how workloads connect: the **Map** draws the paths
traffic takes, **Network policy** says what is allowed to talk to what, and **Traffic** shows
what actually does.

## Map

![The map tab for one namespace: each workload drawn as a chain from its ingress, through its
service and deployment, to its pods, with health on every link](../assets/images/25-cluster-map.png)

*Each chain is the path traffic takes: ingress, service, workload, pods. Every link carries its
own health, and the **NP** and **PDB** marks say a network policy and a disruption budget cover
the workload.*

Choose a namespace from the rail on the left; each namespace shows how many pods it holds and
how many open incidents. For the chosen namespace, each workload is drawn as a chain:

```text
entry (Ingress or route) ──▶ Service ──▶ workload ──▶ pods
```

Each node carries its health, and a broken link — a service with no ready endpoints, an
ingress with no backend — shows where the chain fails. Workloads that need attention come
first, with their open incident linked; healthy ones collapse to a single line.

The chips above the map count ingresses and routes, services, pods, policies and budgets,
autoscalers, and configuration and storage, and filter the map to them. **Find** narrows to
one workload or object, **Expand all** opens every chain, and **Export as PNG** saves the
picture. Select any object to open it in the [object panel](object-panel.md).

## Network policy

![The network policy tab: isolation across the namespace's workloads, recommendations with
fixes, and for each workload who can reach it and what it can reach](../assets/images/31-cluster-netpol.png)

*Isolation first, then what to change, then each workload's allowed sources and
destinations.*

The tab reads the cluster's NetworkPolicy objects and predicts what each workload may
receive from and send to. It is a prediction from the policies: the network plugin enforces
them, and Cilium and Calico policies of their own kinds are not read.

For the chosen namespace:

| Section | Shows |
|---|---|
| Isolation | How many workloads are restricted both ways, open outbound, accept from anyone, or run on the host network |
| Recommendations | Each problem, how many workloads it affects, and the fix |
| Workloads | For each workload, who can reach it and what it can reach, and which policy decides |

The namespace rail counts workloads and warnings per namespace, so the least protected
namespaces stand out.

## Traffic

Traffic draws which workloads talk to which, with request rates, from metrics your cluster
already exports to Prometheus: Istio's request and connection metrics, or Grafana Beyla's
network flow metrics. It needs the agent's Prometheus connection; see
[Connect a cluster](../getting-started/connect-a-cluster.md). Without a traffic source the
tab states which metrics it looked for and found none.

## See also

- [The object panel](object-panel.md)
- [The cluster page](cluster-page.md)
- [Security model](../overview/security-model.md)
