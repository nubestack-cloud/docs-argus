# Network requirements

The agent dials the hub. Nothing needs to reach into a watched cluster.

## Connections

| From | To | Protocol | Purpose |
|---|---|---|---|
| Operator browser | Hub HTTP port | HTTPS | Web interface and API |
| Cluster agent | Hub HTTP port | HTTPS | Enrolment, before a tunnel exists |
| Cluster agent | Hub tunnel port | Mutual TLS | The persistent tunnel |
| Hub | AI provider | HTTPS | Investigation. Not required if the provider is local |
| Hub | Repository host | HTTPS | Branches and pull requests |
| Hub | PostgreSQL | TCP | Everything the hub stores |

## The tunnel

The tunnel is a long-lived mutual-TLS connection the agent opens and keeps open. Both
directions of the incident loop travel over it: findings and tool results from the cluster,
tool calls and approved actions from the hub.

!!! warning "Do not put the tunnel behind an HTTP proxy"
    Mutual TLS is the agent's only credential. An HTTP ingress, a TLS-terminating load
    balancer or anything that re-originates the connection breaks it. Expose the tunnel port
    as its own service — a load balancer passing TCP through, or a deliberate node port.

## The tunnel address

Agents pin the address they enrolled against, and the hub's tunnel certificate must cover
that address.

| If you change | Then |
|---|---|
| The hub's tunnel endpoint | Existing agents cannot verify the hub and reconnect in a loop |
| The names the tunnel certificate covers | The same, for any agent whose address is no longer covered |

Choose the address before enrolling your first cluster: a stable DNS name is better than an
IP address for exactly this reason.

## Firewall summary

Outbound from each watched cluster to the hub's HTTP and tunnel ports. Inbound to the hub
from operator browsers and from agents. Nothing inbound to any watched cluster.

## See also

- [Architecture](../overview/architecture.md)
- [Requirements](../getting-started/requirements.md)
- [Troubleshooting](../troubleshooting.md)
