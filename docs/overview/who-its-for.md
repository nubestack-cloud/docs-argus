# Who it is for

ARGUS suits teams who operate Kubernetes clusters they did not necessarily build, and who
carry the consequences when something in them breaks.

## The primary reader

The person ARGUS is designed around is on platform or cluster on-call. They are responsible
for a fleet, they are triaging a workload written by another team, and they need to know
what broke, whether it matters, who owns it and what changing it would affect — before they
need any application-level detail.

The interface follows that order. Object identity, ownership and blast radius come first;
the reasoning behind a conclusion is one click away rather than filling the screen.

## Teams it fits

**Platform and infrastructure teams** running clusters for other people, where the person
holding the pager is not the person who wrote the workload.

**Small teams with broad remit**, where the same few engineers cover clusters, pipelines
and applications, and depth of Kubernetes experience varies across the team. ARGUS states
causes in plain terms and shows its evidence, which makes a fault reviewable by someone who
is not a Kubernetes specialist.

**Regulated and self-hosted estates.** ARGUS runs entirely on your infrastructure. You
choose the AI provider, including a self-hosted model, and no component calls out to a
NubeStack service.

**GitOps estates.** Where Argo CD, Flux or Helm own the desired state, ARGUS treats the
repository as the place a fix belongs and opens a pull request against it.

## Situations it does not suit

ARGUS needs to reach your clusters through an agent you install. It is not an agentless
scanner and it does not work from a kubeconfig held centrally.

It investigates Kubernetes faults using Kubernetes evidence. It is not an application
performance monitor, a log aggregator or a metrics store, and it does not replace one.

It is not a hands-off autopilot. Unattended execution exists, is bounded, and is off by
default; the product is built on the assumption that a person approves changes.

## See also

- [What ARGUS is](what-is-argus.md)
- [Requirements](../getting-started/requirements.md)
- [Unattended execution](../automation/unattended-execution.md)
