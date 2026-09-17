# Connect a cluster

Connecting a cluster takes four steps: create a token, install the agent, accept the
cluster, confirm the heartbeat. The hub never needs your kubeconfig — the agent dials out.

## 1. Create an enrolment token

On **Clusters**, select **Enroll a cluster**. The token is single-use and short-lived: it
authorises exactly one agent install.

## 2. Install the agent

Install the agent chart into the cluster you want watched, in its own namespace, passing
the hub's API address and the token. The guided card on the overview shows the exact
command with the token already filled in, ready to copy.

Two values have to be right:

| Value | Requirement |
|---|---|
| Hub API address | Reachable from inside the cluster. Not `localhost` for a remote cluster |
| Persistence | Leave enabled, so the agent keeps its certificate across pod restarts |

The agent presents the token on first contact and receives its own client certificate in
return. The token is then spent.

!!! tip "One command instead of several"
    `argusctl cluster add --context <kube-context>` drives the whole sequence — issue a
    token, install the chart, wait for check-in, accept the cluster — from the command
    line.

## 3. Accept the cluster

A newly enrolled cluster appears as pending. Accepting it is what allows its tunnel to
carry data. Until then the agent is connected but ignored, which gives you a deliberate
moment to confirm the cluster is the one you meant.

## 4. Confirm the heartbeat

The cluster becomes **Active** once its tunnel is up and it is reporting. The **Clusters**
page shows state, agent version, open incident count and last heartbeat.

![The clusters page listing three clusters with state, agent version, open incident count
and last heartbeat](../assets/images/02-clusters.png)

*Clusters list. Filters cover state and agent version; the counters above the table pick
out clusters needing attention.*

Findings normally start arriving within a minute or two. A healthy cluster with nothing
wrong produces no incidents, which is the correct outcome rather than a sign of a problem.

## Whether the agent may change anything

**Agents install read-only.** Detection and investigation need nothing more, and a cluster
connected today cannot be modified by ARGUS at all until you decide otherwise.

!!! warning "This is an install-time decision, not a setting in the product"
    There is no switch in **Settings** that grants or removes an agent's write access, and
    there is deliberately no way for the hub to grant itself one. Write access is Kubernetes
    RBAC in the target cluster, so it changes only by upgrading the agent there.

### Granting write access

Enabling remediation means choosing a scope. There are exactly two, and you must pick one.

**Named namespaces — preferred:**

```bash
helm --kube-context <cluster-context> upgrade --install argus-agent <chart> \
  --namespace argus-system --reuse-values \
  --set remediate.enabled=true \
  --set 'remediate.namespaces={payments,checkout}'
```

**The whole cluster:**

```bash
helm --kube-context <cluster-context> upgrade --install argus-agent <chart> \
  --namespace argus-system --reuse-values \
  --set remediate.enabled=true \
  --set remediate.allNamespaces=true
```

| Setting | Effect |
|---|---|
| `remediate.enabled=false` (the default) | No write permission exists. The agent cannot change anything |
| `remediate.namespaces={a,b}` | Write permission in those namespaces only, granted one namespace at a time |
| `remediate.allNamespaces=true` | Write permission across every namespace, including `kube-system` |

!!! warning "The chart refuses to guess, and will stop the install"
    Setting `remediate.enabled=true` **without** either scope fails the install rather than
    granting nothing — an empty grant would surface later as a confusing permission error at
    execution time. Setting **both** scopes also fails: a namespace list beside a
    cluster-wide grant reads as a restriction while granting everything.

Prefer named namespaces. Cluster-wide scope includes `kube-system` and every other
namespace you did not think about, so treat it as a deliberate decision rather than the
convenient option.

### What enabling it actually creates

Turning it on provisions a **second, separate identity** in the target cluster, distinct
from the one used for reading, together with admission policies that restrict even that
identity to the specific object fields ARGUS's actions are allowed to touch.

Two consequences worth knowing:

- While it is off, an attempt to write is refused by the Kubernetes API server, not by
  ARGUS. The restriction holds even if the hub is compromised.
- Naming namespaces and granting cluster-wide scope are mutually exclusive by construction,
  so a namespace list can never be decorative while something broader is also granted.

### Removing write access

```bash
helm --kube-context <cluster-context> upgrade argus-agent <chart> \
  --namespace argus-system --reuse-values --set remediate.enabled=false
```

The identity and its permissions are removed. The agent keeps detecting and investigating.

!!! note "There is no in-product way to make one cluster read-only again"
    Freeze windows, blast-radius caps and the circuit breaker all bound what happens
    **without a human** — none of them stands between an operator and a fix they have
    decided to approve. Taking a cluster out of play entirely means the upgrade above. See
    [Guardrails](../automation/guardrails.md).

### Confirming what an agent may do

The cluster's own page reports the write access the agent has **discovered** by asking its
API server — not what was configured, which is what you want when checking whether an
approval can actually be carried out. See [Clusters](../administration/clusters.md).

## See also

- [Clusters](../administration/clusters.md)
- [Your first incident](first-incident.md)
- [Cluster states](../reference/cluster-states.md)
