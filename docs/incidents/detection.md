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
evidence underneath it.

Findings are fingerprinted from the condition and the object, and findings sharing a
fingerprint collapse into one incident with an occurrence count. A crash loop that
restarts two hundred times is one incident that has been seen two hundred times.

Not every finding opens an incident. A finding has to clear an evidence bar first — enough
signal, on a real object, with real impact. A symptom that does not clear it is still
recorded and visible in the cluster's finding history.

Related incidents are linked rather than merged: incidents on pods of the same workload,
and incidents whose objects reference each other — a service and the pods behind it, a pod
and the volume claim it mounts.

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
