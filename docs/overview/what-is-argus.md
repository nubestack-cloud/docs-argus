# What ARGUS is

ARGUS is a self-hosted platform that detects Kubernetes faults, investigates them with an
AI model, and proposes a reviewed fix. It is built for the gap between "an alert fired"
and "the cause is understood".

## The problem it addresses

Kubernetes tells you a great deal about symptoms and almost nothing about causes. A pod is
in `CrashLoopBackOff`; the cause is a missing ConfigMap key, a memory limit set too low, a
volume that cannot attach to two nodes at once, or an image tag that does not exist. The
symptom is on screen in seconds. The cause takes a person with cluster access, time, and
familiarity with that particular workload.

ARGUS does the middle part. It gathers the evidence a person would gather, states what it
concludes and how confident it is, shows the evidence behind the conclusion, and — where a
fix is expressible — proposes one.

## What makes it different from monitoring

Monitoring tells you that something is wrong. ARGUS is built around the three steps after
that.

**It groups symptoms into problems.** A failing deployment produces dozens of events across
several pods. ARGUS collapses those into one incident per affected object, and links
incidents that share an owner or reference each other's resources.

**It investigates with evidence, not guesses.** The investigation runs against your live
cluster through a bounded set of read-only tools — describing objects, reading logs, listing
events, resolving owner chains, asking whether an object is managed by a GitOps controller.
Every step it took is recorded as a causal chain you can open.

**It knows where a fix belongs.** If a broken object is managed by Argo CD, Flux or a Helm
release, changing the cluster directly is a stop-gap that the next sync reverts. ARGUS works
that out from the cluster's own ownership facts before it proposes anything, and routes the
fix to your repository instead.

## The approval boundary

Every change ARGUS can make to a cluster is an approval away. The set of changes it can
make at all is a fixed list of typed actions — scale a workload, restart pods, patch
resource limits, revert a container image, delete a named object, create a limited object,
open a pull request. It has no shell, and no way to run a command you did not anticipate.

A new installation executes nothing. Agents install read-only, and remediation is enabled
per cluster and per namespace by whoever installs the agent.

## The honest position on confidence

An investigation reports a confidence figure. It is a signal from the model, not a
measurement, and ARGUS treats it that way: the confidence is displayed next to the
evidence, never instead of it. Where the investigation reaches a bound without concluding,
it says so and reports what it found rather than inventing a conclusion. Where a cause is
clear but no supported action expresses the fix, it says that too — that outcome is
common, and it is a result rather than a failure.

## See also

- [How it works](how-it-works.md)
- [Who it is for](who-its-for.md)
- [Resolution routes](../remediation/routes.md)
