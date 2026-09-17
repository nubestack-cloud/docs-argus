---
hide:
  - navigation
  - toc
---

<div class="argus-hero" markdown>

<svg class="argus-hero-mark" viewBox="4 4 56 56" role="img" aria-label="ARGUS">
  <g fill="currentColor">
    <rect x="29.6" y="4" width="4.8" height="19" rx="2.4" transform="rotate(0 32 32)"/>
    <rect x="29.6" y="4" width="4.8" height="19" rx="2.4" transform="rotate(30 32 32)"/>
    <rect x="29.6" y="4" width="4.8" height="19" rx="2.4" transform="rotate(60 32 32)"/>
    <rect x="29.6" y="4" width="4.8" height="19" rx="2.4" transform="rotate(120 32 32)"/>
    <rect x="29.6" y="4" width="4.8" height="19" rx="2.4" transform="rotate(150 32 32)"/>
    <rect x="29.6" y="4" width="4.8" height="19" rx="2.4" transform="rotate(180 32 32)"/>
    <rect x="29.6" y="4" width="4.8" height="19" rx="2.4" transform="rotate(240 32 32)"/>
    <rect x="29.6" y="4" width="4.8" height="19" rx="2.4" transform="rotate(270 32 32)"/>
    <rect x="29.6" y="4" width="4.8" height="19" rx="2.4" transform="rotate(300 32 32)"/>
    <g class="argus-mark-sleep" opacity="0.26">
      <rect x="29.6" y="13.5" width="4.8" height="9.5" rx="2.4" transform="rotate(90 32 32)"/>
      <rect x="29.6" y="13.5" width="4.8" height="9.5" rx="2.4" transform="rotate(210 32 32)"/>
      <rect x="29.6" y="13.5" width="4.8" height="9.5" rx="2.4" transform="rotate(330 32 32)"/>
    </g>
    <circle cx="32" cy="32" r="6.6"/>
  </g>
</svg>

# ARGUS

**Built for the gap between "an alert fired" and "the cause is understood".**

[Get started](getting-started/index.md){ .md-button .md-button--primary }
[What ARGUS is](overview/what-is-argus.md){ .md-button }

</div>

![The ARGUS fleet overview, showing incident counts by lifecycle state, open incidents by
severity, cluster health and recent activity](assets/images/01-overview.png){ .argus-hero-shot }

ARGUS watches your Kubernetes clusters, works out why something is broken, and proposes a
fix you review before anything changes. It is self-hosted: the hub runs on your
infrastructure, and one agent runs in each cluster you want it to watch.

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

<div class="grid cards" markdown>

-   :material-compass-outline:{ .lg .middle } **What ARGUS is**

    ---

    The product in one page, and the problem it is built around.

    [Overview](overview/what-is-argus.md)

-   :material-download-outline:{ .lg .middle } **Getting started**

    ---

    Install the hub, connect a cluster, and see your first incident.

    [Getting started](getting-started/index.md)

-   :material-file-search-outline:{ .lg .middle } **Reading an incident**

    ---

    What is on screen, and how to read the evidence behind a conclusion.

    [Reading an incident](incidents/reading-an-incident.md)

-   :material-source-branch:{ .lg .middle } **Resolution routes**

    ---

    What ARGUS will and will not change, and where a fix lands.

    [Resolution routes](remediation/routes.md)

-   :material-shield-check-outline:{ .lg .middle } **Security model**

    ---

    Trust boundaries, what leaves your cluster, and what a compromise would reach.

    [Security model](overview/security-model.md)

</div>

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
