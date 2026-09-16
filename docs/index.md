# NubeStack ARGUS

ARGUS watches your Kubernetes clusters, works out why something is broken, and proposes a
fix you review before anything changes. It is self-hosted: the hub runs on your
infrastructure, and one agent runs in each cluster you want it to watch.

![The ARGUS fleet overview, showing incident counts by lifecycle state, open incidents by
severity, cluster health and recent activity](assets/images/01-overview.png)

*The fleet overview. The top row counts open incidents by where they have reached in their
lifecycle, so a queue that needs a person is visible before any chart is read.*

## What it does

ARGUS closes a loop that most monitoring stops halfway through.

| Stage | What happens |
|---|---|
| Detect | Agents watch events, pod conditions and sustained cluster state, and report symptoms |
| Group | Related symptoms become one incident per affected object, not one alert per event |
| Investigate | An AI investigation gathers live evidence through read-only tools and states a cause |
| Recommend | ARGUS decides where the fix belongs — your repository, or the live cluster |
| Approve | A person reads the evidence and the proposed change, then approves or rejects it |
| Validate | After the change lands, ARGUS checks it actually held before closing the incident |

Detection and investigation are read-only. Nothing changes a cluster until someone
approves it, and a fresh installation cannot execute anything at all.

## Where to start

| If you want to | Read |
|---|---|
| Understand what ARGUS is before installing it | [What ARGUS is](overview/what-is-argus.md) |
| Get it running | [Getting started](getting-started/index.md) |
| Understand an incident on screen | [Reading an incident](incidents/reading-an-incident.md) |
| Know what it will and will not change | [Resolution routes](remediation/routes.md) |
| Review it for security sign-off | [Security model](overview/security-model.md) |

## What ARGUS does not do

It does not run arbitrary commands in your clusters. Every change it can make is one of a
small set of typed actions with a known shape, rehearsed against the Kubernetes API before
it is applied.

It does not read the contents of Secrets. Secret material is removed inside your cluster,
before any data crosses the network to the hub.

It does not merge pull requests. When the durable fix belongs in a repository, ARGUS opens
a pull request and your normal review process decides.

## See also

- [How it works](overview/how-it-works.md)
- [The incident lifecycle](incidents/lifecycle.md)
- [Requirements](getting-started/requirements.md)
