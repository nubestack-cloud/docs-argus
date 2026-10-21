# Architecture

ARGUS has two components: a hub you run once, and an agent you install in each cluster it
watches. Everything else is a choice about where the AI model runs.

```text
        your browser
             │  HTTPS
        ┌────▼─────────────────────────────┐
        │             HUB                  │
        │  web interface, API, incident    │        ┌──────────────────┐
        │  state machine, investigation    │───────▶│   AI provider    │
        │  orchestration, audit trail      │        │  API or runner   │
        └────┬───────────────────┬─────────┘        └──────────────────┘
             │                   │
      ┌──────▼──────┐     mutual TLS tunnel
      │  PostgreSQL │       (agent dials out)
      └─────────────┘            │
                     ┌───────────┴───────────┐
                     │                       │
              ┌──────▼──────┐         ┌──────▼──────┐
              │   AGENT     │         │   AGENT     │
              │ cluster A   │         │ cluster B   │
              └─────────────┘         └─────────────┘
```

## The hub

The hub is a single service that serves the web interface and the API, holds the incident
state machine, orchestrates investigations, and writes the audit trail. It stores everything
in PostgreSQL.

The hub never holds a kubeconfig and never connects to a cluster. It answers connections
from agents; it does not make them.

Run one hub. Its agent connections are held in memory, so it does not run as multiple
replicas.

## The cluster agent

One agent runs in each watched cluster, in its own namespace. It:

- discovers which resource kinds exist and which it may read, then watches them
- runs the detectors and reports findings
- answers read-only tool calls during an investigation
- executes approved typed actions, if remediation was enabled for that cluster

The agent dials the hub over a mutual-TLS tunnel and keeps that connection open. The tunnel
travels as a WebSocket through the hub's own ingress, at the same address as the web
interface, so the hub needs no second port. Nothing inbound to the cluster is required — no
ingress, no port forward, no firewall exception for traffic entering the cluster.

Enrolment is outbound too. You create a single-use token in the hub, install the agent with
it, and the agent presents it on first contact and receives its own client certificate. The
certificate is kept in a Secret in the agent's namespace, so it survives restarts. The cluster
the hub runs in needs no token: the hub chart installs its agent and enrols it automatically.

## Where the AI runs

You choose, and you can configure several providers and switch between them without a
restart. Exactly one is active at a time.

| Option | What it means |
|---|---|
| API endpoint | Any OpenAI-compatible endpoint, including one you host yourself |
| Agent CLI runner | An isolated runner container beside the hub, driving an agent CLI |

A self-hosted model is added the same way, as an API endpoint: ARGUS does not install or run
models itself.

## What is stored

| Data | Where |
|---|---|
| Incidents, findings, analyses, approvals, executions, audit events | The hub's PostgreSQL database |
| Repository credentials and provider keys | The same database, encrypted |
| The agent's client certificate and cluster identity | A Secret in the agent's namespace, in the watched cluster |
| Secret contents | Nowhere — they are never read |

The bundled database has no backups of its own: copy it off the cluster before each upgrade
([Upgrade and roll back](../getting-started/upgrade.md#back-up-first)). For anything you care
about, use an external PostgreSQL instance with its own backups.

## See also

- [Security model](security-model.md)
- [Network requirements](../reference/network-requirements.md)
- [Install the hub](../getting-started/install.md)
