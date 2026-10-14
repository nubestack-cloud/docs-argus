# Clusters

The **Clusters** page is the inventory of everything ARGUS watches, with the health of each
agent connection.

![The clusters page listing clusters with state, agent version, compatibility, open
incidents, last heartbeat and next upgrade](../assets/images/02-clusters.png)

*Tabs above the table pick out clusters needing attention, pending approval, not reporting
or retired.*

## What the list tells you

| Column | Meaning |
|---|---|
| Cluster | The display name given at install, and the cluster's identifier |
| State | Where the connection stands. See [Cluster states](../reference/cluster-states.md) |
| Agent version | The agent build running there, so a straggler is visible |
| Compatibility | Whether that agent version is supported by this hub |
| Open incidents | How many incidents are currently open for that cluster |
| Last heartbeat | When the agent last reported. Agents heartbeat every 30 seconds |
| Next upgrade | The next Kubernetes version, and whether the upgrade check found blockers |

**Enroll a cluster** at the top right starts the enrolment described in
[Connect a cluster](../getting-started/connect-a-cluster.md).

## Accepting a cluster

A newly enrolled cluster arrives pending. Accepting it is what allows its tunnel to carry
data, and it exists as a separate step on purpose: it is the moment to confirm the cluster
that just connected is the one you meant to connect.

Rejecting a cluster refuses it without deleting the record.

## The cluster page

Open a cluster for everything ARGUS knows about it: health, timeline, incidents, the map,
GitOps and Helm, certificates, upgrade readiness, posture, network policy, traffic, cost and
the agent. See [The cluster page](../fleet/cluster-page.md).

## Remediation authority

The **Remediation authority** card on the cluster's **Agent** tab answers one question: **may this agent change
anything here, and where.** Check it before relying on an approval being carried out.

What it shows is what the agent **discovered** by asking its own API server, not what
somebody configured. That distinction matters when an approval fails: configuration can say
one thing and the cluster another.

It distinguishes three states rather than two, and collapsing any two would mislead:

| State | Meaning |
|---|---|
| Not reported | The agent predates the check. Unknown |
| Not answered | The agent asked and got no answer. Also unknown — **not** a denial |
| Answered | A real, per-action answer |

"Nobody could ask" is deliberately not rendered as "remediation unavailable". Telling an
approver a cluster cannot act when the question merely went unanswered is the failure that
distinction exists to prevent.

The card is **read-only, and cannot be otherwise**: write access is Kubernetes RBAC in the
target cluster, and the hub cannot grant an agent permissions. Changing it means upgrading
the agent — see
[Whether the agent may change anything](../getting-started/connect-a-cluster.md).

## Renaming

A cluster's display name can be changed at any time. It is a label for people and does not
affect the agent's identity or its certificate.

## Disconnected clusters

A cluster stops heartbeating when the agent pod is gone, the network is broken, or the
tunnel address it enrolled against is no longer reachable. The cluster becomes
disconnected; its incidents stay.

An agent that keeps its volume across restarts reconnects on its own with the same
identity. An agent that loses its volume has lost its certificate and needs enrolling
again.

!!! warning "Changing the hub's tunnel address"
    Agents pin the address they enrolled against. Changing the hub's tunnel endpoint or its
    certificate names means existing agents can no longer verify it, and they will
    reconnect unsuccessfully until the address is restored or they are re-enrolled.

## Archiving

Archiving removes a cluster from the active fleet while keeping its history. An archived
cluster's agent, if it is still running, is refused when it connects.

## See also

- [Connect a cluster](../getting-started/connect-a-cluster.md)
- [Cluster states](../reference/cluster-states.md)
- [Network requirements](../reference/network-requirements.md)
