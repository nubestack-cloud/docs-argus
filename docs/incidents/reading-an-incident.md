# Reading an incident

The incident page answers four questions in order: what broke, why, what to do about it,
and whether it held. This page says where each answer is and what to look at first.

![An incident waiting on a decision: the header, the lifecycle spine, the next-move line,
and the What broke card beside the facts](../assets/images/04-incident-detail.png)

*Header, spine and next-move line first; then one card per question, with the facts and
history beside them.*

## Read these three things first

The **header** names the object — its name, kind and namespace — with its severity and
state, and under it the condition in the cluster's own words. The line below gives the
cluster, the pod it was observed on when the incident is about a workload, when it was
first and last seen, and how many events stand behind it.

The **spine** shows how far the incident got: Detected, Diagnosed, Fix, Holding, and the
outcome. See [The incident lifecycle](lifecycle.md).

The **next-move line** under the spine says who is expected to act and what they would do,
and links to the card that holds it.

## What broke

The finding that opened the incident, and every reason reported against it since. Each
reason is drawn as a bar with its count, so a pod that was **Unhealthy** two hundred times
and hit **FailedMount** twice reads at a glance.

Chips say where the evidence came from and what owns the object:

| Chip | Meaning |
|---|---|
| Kubernetes event | Forwarded from the cluster's own Warning events |
| ARGUS check | Read by ARGUS from the object's status, whether or not the cluster emitted an event |
| Managed by Helm, Argo CD or Flux | The object is owned by a release or a GitOps controller — a fact true before any fix is considered |

## Why

![The Why card: the root cause marked as AI, its confidence, the collapsed causal chain,
what was ruled out, and the affected-objects graph](../assets/images/20-incident-why.png)

*The cause first, then the evidence behind it: the causal chain, what was ruled out, and
the objects involved.*

The root cause is marked **AI** and stated in one sentence, with **Full explanation**
behind it and the model's confidence beside it. Confidence is the model's own signal, not a
measurement.

Under it:

- **Causal chain** — every tool call the investigation made, in order. The header says
  whether ARGUS observed the calls as they ran or the model reported them afterwards
  (**Self-reported**). Open a step to see the call and what came back.
- **Ruled out** — hypotheses the investigation considered and rejected, each with the
  evidence that rejected it.
- **Evidence gathered** — how many reads stand behind the conclusion, by kind.
- **What it could read** — one bar splitting the investigation's reads into answered, found
  nothing, refused and failed, with the tools it did not have (no Prometheus, no dry-run
  grant, no readable repository) named under it. When most reads were refused or failed, the
  confidence is capped, and the bar shows why.
- **Recent changes** — what changed on this object and its neighbours shortly before.
- The model, iterations, tokens, cost and when it ran.

Below these, evidence tabs let you check the conclusion against the cluster:

| Tab | Shows |
|---|---|
| Affected objects | A graph of what the object owns, uses and is reached by. Select a node to inspect it; **Export as PNG** saves the picture |
| Changes before | Recorded changes to this object, its owners and its neighbours before the incident opened |
| Resource usage | CPU, memory, restarts and throttling around the incident, when the cluster's agent has Prometheus configured |
| Scheduling | Why a pending pod will not schedule, node by node |
| Git vs cluster | What the repository says against what the cluster runs, for a GitOps-owned object |

A tab that does not apply to this incident is not offered. **Check it yourself** gives the
`kubectl` command that shows the same object, so you can verify a claim directly.

## Fix

![The Fix card for an in-place route: the proposed change, the approval decision with its
gate reasoning, and the steps for a person to run](../assets/images/21-incident-fix.png)

*The route and its reason, then what ARGUS would run and the decision it needs, then what a
person would do instead.*

The **route** says where a fix for this object belongs — a pull request, an in-place change,
both, or guidance — and in one sentence why. **Built from the causal chain** links back to
the evidence the fix rests on.

When ARGUS can run the fix, **ARGUS runs it** shows:

- **The change** — the action, its risk, whether it can be undone, whether it refuses to run
  if the object has changed since the plan was made, and **Preview change** for the exact
  change.
- **Decision** — whether it needs your approval and why: which safety rule keeps it from
  running on its own. **Approve** and **Reject** are here. If it cannot run yet — for
  example because the cluster has no remediation agent connected — the reason is stated
  under the buttons.

**You do it** holds the steps the investigation produced for a person, marked **AI**, with a
warning when a change made by hand would be reverted by the object's owner.

**Pull request** says whether a repository change is available and, if not, why. **Why this
route?** at the bottom holds the facts behind the decision: the owner, the repository, the
path and the synced commit.

![The Fix card for a guidance route, where the steps are a person's and no channel is
available](../assets/images/22-incident-guidance.png)

*A guidance route. The cause is known and the steps are a person's; nothing has been run,
and the card says so.*

## Holding

After a fix lands, ARGUS watches for the symptom to come back before it closes the incident.
This phase says what it is waiting for. See [Validation](../remediation/validation.md).

## Facts and history

The side column holds the facts — cluster, owner, workload, first seen, when it was
investigated and whether automatically — and **Prior occurrences**, earlier incidents on the
same object. **History** lists every step the incident took, with the time between steps;
**What happened** under it holds every finding behind the incident.

## Actions

| Control | What it does |
|---|---|
| **Analyze** or **Re-analyze** | Starts an investigation, or a fresh one |
| **Close out** | **Mark resolved…**, **Dismiss…** or **Tolerate…**, each asking for a note |
| More actions | **Download report**, a Markdown record of the incident; **Copy summary**, a short version for a ticket or a chat |

A control you lack the capability for stays visible and disabled, with the missing
capability named.

![A remediated incident: the spine ends in Fixed by ARGUS and the next-move line says the
re-check window passed with no new findings](../assets/images/23-incident-remediated.png)

*A closed incident keeps the whole record: what broke, why, what ran, and how long each
step took.*

## See also

- [The incident lifecycle](lifecycle.md)
- [Investigation](investigation.md)
- [Resolution routes](../remediation/routes.md)
- [Approving a fix](../remediation/approvals.md)
