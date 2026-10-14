# What ARGUS detects

Three detectors run in every connected cluster. Between them they cover symptoms that
appear as events, symptoms that appear as pod status, and conditions that outlast any
single event.

## The three detectors

| Detector | Watches |
|---|---|
| Warning Kubernetes events | Every Warning-type event, cluster-wide |
| Pod status conditions | `CrashLoopBackOff`, `ImagePullBackOff`, `ErrImagePull`, `OOMKilled`, and pods stuck `Pending` |
| Sweep detector | Sustained conditions, checked periodically rather than on an event |

The sweep detector is the one that finds problems nothing announced. Replica shortfalls,
volume claims that never bind, failed jobs, nodes under pressure or cordoned for too long,
autoscalers pegged at their ceiling, services with no ready endpoints, certificates
approaching expiry, objects stuck terminating, GitOps reconciliation stalled or suspended,
and backups that failed. It evaluates a catalogue of individually controllable rules — see
[Detectors and rules](../reference/detectors.md).

## Kind-agnostic coverage

The agent does not carry a fixed list of resource kinds. On start it asks its own cluster
which kinds exist and which of them it is permitted to read, then watches that set.

A cluster running Gateway API, cert-manager, Argo CD, Flux, Velero or your own custom
resources is covered by the same condition checks as anything else, without waiting for a
release that knows about them. A resource that reports a failing status condition is
visible on that basis alone.

## From symptom to incident

A raw symptom is a **finding**. Findings do not appear in the incident list; they are the
evidence underneath it, and every one is kept under **Incidents → Signals**.

Only a finding that shows a real fault opens an incident: it must be classed as a fault
rather than a risk, rest on better than unverified evidence, and show the object degraded
or unavailable. A risky setting that has not caused harm yet, such as a deployment with
every replica on one node, stays a signal.

## Grouping

ARGUS groups findings so that one fault is one incident:

| Case | Result |
|---|---|
| The same condition re-fires on the same object | One incident, with an occurrence count |
| Pods of one workload report the same fault | One incident on the workload, naming the pod it was observed on |
| A pod is pending because a volume claim, ConfigMap or Secret it needs is broken | The pod's finding joins the incident on that object |
| A node is not ready | Every affected pod on that node joins one incident |
| A rollout stalls past its progress deadline | The stall joins the workload's incident |

Probe failures from new pods during a rollout that is still within its deadline are
recorded but do not open an incident: a normal rollout briefly reports pods that are not
ready yet. If the rollout never completes, the stall itself raises the incident.

Incidents that are related but not the same fault — a service and the workload behind it —
stay separate and are linked on each incident page.

## Incidents that clear

When a fault stops, its incident closes on its own once it has been quiet for a while and a
live check confirms the problem is gone. See
[The incident lifecycle](lifecycle.md#incidents-that-clear-on-their-own).

## Controlling volume

| Control | Effect | Where |
|---|---|---|
| Disable a detector | Its findings stop becoming incidents | **Settings → Detectors** |
| Disable a rule | That one sweep check stops becoming incidents | **Settings → Detectors** |
| Storm protection | Caps how many brand-new incidents a cluster may open in a rolling window | **Settings → Detectors** |
| Toleration | Silences one accepted condition on one object | An incident's **Tolerate** action |

Disabling a detector or rule is a hub-side filter. The agent keeps running the check and
keeps sending findings; the hub stops acting on them. Both take effect immediately, with no
restart on either side.

Storm protection bounds a flood of genuinely different new problems. It is separate from
fingerprint grouping, which already collapses repeats of the same problem. Once a cluster
hits the ceiling, further findings are still recorded but stop opening new incidents until
the window passes; incidents that already exist keep updating throughout.

!!! tip "Try a setting before committing to it"
    **Preview against history** on the detectors page replays your unsaved detector and
    storm-protection settings against real recorded history, and reports what they would
    have done.

## How often a symptom is re-sent

An agent will not re-send the same detected problem more often than its resend cooldown,
five minutes by default. That interval is set on the agent when it is deployed.

## See also

- [Detectors and rules](../reference/detectors.md)
- [Tolerations](tolerations.md)
- [Detector settings](../administration/detectors.md)
