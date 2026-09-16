# Getting started

Install the hub, point it at an AI provider, connect a cluster, and read your first
incident. Allow about half an hour for a first evaluation install.

- [Requirements](requirements.md) — what the hub needs, what each cluster needs, and what
  has to be reachable from where.
- [Install the hub](install.md) — Docker Compose for evaluation, Helm for a real
  deployment.
- [First sign-in](first-sign-in.md) — the bootstrap account, and the first two things to
  change.
- [Configure analysis](configure-analysis.md) — connect an AI provider and test it before
  you enrol clusters.
- [Connect a cluster](connect-a-cluster.md) — enrolment, agent install, acceptance.
- [Your first incident](first-incident.md) — a guided walk through detection,
  investigation and a proposed fix.

!!! note "Order matters for one step"
    Configure an AI provider before enrolling clusters. Detection works without one, but
    every investigation will fail until a provider is active, and an incident queue you
    cannot investigate is not a useful first impression.
