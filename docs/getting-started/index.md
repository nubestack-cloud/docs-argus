# Getting started

Install the hub with one Helm command, point it at an AI provider, connect your clusters, and
read your first incident. Allow about half an hour for a first install.

- [Requirements](requirements.md) — what the hub needs, what each cluster needs, and what
  has to be reachable from where.
- [Install the hub](install.md) — one `helm install`, which also connects the cluster the hub
  runs in; storage, Claude Code or Codex, and other ways to install.
- [First sign-in](first-sign-in.md) — the bootstrap account, and the first two things to
  change.
- [Configure analysis](configure-analysis.md) — connect an AI provider and test it before
  you enrol clusters.
- [Connect a cluster](connect-a-cluster.md) — your other clusters: one at a time, or a whole
  fleet with one token and your GitOps tool.
- [Your first incident](first-incident.md) — a guided walk through detection,
  investigation and a proposed fix.
- [Upgrade and roll back](upgrade.md) — moving the hub and agents to a new release.

!!! note "Configure analysis early"
    The hub starts watching its own cluster as soon as it is installed. Detection works
    without an AI provider, but every investigation fails until one is active, so configure it
    straight after signing in, before you connect more clusters.
