# Network requirements

The agent dials the hub. Nothing needs to reach into a watched cluster.

## Connections

| From | To | Protocol | Purpose |
|---|---|---|---|
| Operator browser | The hub's hostname | HTTPS | Web interface and API |
| Cluster agent | The hub's hostname | HTTPS | Enrolment, before a tunnel exists |
| Cluster agent | The hub's hostname | WebSocket, with mutual TLS inside | The persistent tunnel |
| Hub | AI provider | HTTPS | Investigation. Not required if the provider is local |
| Hub | Repository host | HTTPS | Branches and pull requests |
| Hub | PostgreSQL | TCP | Everything the hub stores |
| Hub | Notification webhooks | HTTPS | Notifications. Only if configured |
| Your AI tools | The hub's hostname | HTTPS | The read-only MCP endpoint, with a personal access token |
| Cluster agent | Its own cluster's Prometheus, through the Kubernetes API | HTTPS | Workload metrics, traffic and cost. Only if configured |

The hub refuses private and internal addresses for AI providers and repositories unless you
name them under **Settings → Outbound access**. See
[Outbound access](../administration/outbound-access.md).

## The tunnel

The tunnel is a long-lived connection the agent opens and keeps open. Both directions of the
incident loop travel over it: findings and tool results from the cluster, tool calls and
approved actions from the hub.

It is a WebSocket at `/api/v1/agent/tunnel` on the hub's own hostname, so it passes through the
same ingress as the web interface. Inside it runs a mutual-TLS session between the agent and the
hub. Your ingress terminates the outer HTTPS as usual, but it cannot read the session inside:
the agent's traffic and its credential stay end-to-end between the agent and the hub.

| Requirement | Why |
|---|---|
| Your ingress controller supports WebSockets | ingress-nginx, Traefik, HAProxy and most others do; the chart sets the long timeouts ingress-nginx needs |
| A load balancer in front of the ingress allows connections idle for at least 60 seconds | Agents send a heartbeat every 30 seconds. A shorter idle timeout drops the tunnel every minute |

The hub's own cluster's agent connects to the hub inside the cluster, without going through the
ingress at all.

### A separate tunnel address

For networks that cannot carry a WebSocket through the ingress, the hub also serves the tunnel on
its own TLS port. Expose it as a load balancer or a node port and tell the hub the address agents
dial:

```bash
--set tunnel.service.type=LoadBalancer \
--set tunnel.publicEndpoint=argus-tunnel.example.com:8443
```

That address is written into the hub's tunnel certificate and handed to each agent when it
enrols, so choose a stable DNS name. To move it later, keep the old name in `tunnel.extraSANs`
until every agent has moved. An enrolled agent switches between the WebSocket and a separate
address with `--set hub.tunnelEndpoint=<address>`, without enrolling again.

!!! warning "A separate tunnel port must not pass through an HTTP proxy"
    On that port the mutual TLS runs directly, so an HTTP ingress or a TLS-terminating load
    balancer in front of it breaks the agent's credential. Pass TCP straight through.

## Firewall summary

Outbound from each watched cluster to the hub's hostname on 443 (or 80 without TLS). Inbound to
the hub's ingress from operator browsers and from agents. Nothing inbound to any watched
cluster.

## See also

- [Architecture](../overview/architecture.md)
- [Requirements](../getting-started/requirements.md)
- [Troubleshooting](../troubleshooting.md)
