# Tolerations

A toleration stops an accepted condition on one object from opening a new incident every
time its detector re-fires. Use it when the fault is real, understood and being lived with.

![The tolerations page listing a silenced condition with its cluster, state, suppressed
count, creator and expiry](../assets/images/07-tolerations.png)

*Each row is one silenced condition on one object. The suppressed count shows what the rule
has actually stopped since it was created.*

## When to use one

Closing incidents repeatedly for the same known condition is a sign you want a toleration.
Typical cases: a volume that cannot attach because of a known storage limitation, a
deprecated workload nobody will fix before it is retired, a third-party component that logs
a warning condition by design.

Tolerations are for accepted faults. If a condition is merely noisy across the whole fleet
rather than accepted on one object, disable the rule instead — see
[Detector settings](../administration/detectors.md).

## Creating one

Tolerations are created from the incident they apply to, using its **Tolerate** action.
That is deliberate: a toleration is a decision about a specific object made with the
incident's evidence in front of you, and the incident it came from is recorded with it.

You can set an expiry, so a toleration for a fault being fixed next quarter stops silencing
it afterwards.

## What it does and does not cover

| Does | Does not |
|---|---|
| Stops that condition on that object opening new incidents | Affect an incident already open on a different object |
| Records what it has suppressed, and how much | Suppress a finding that names no object |
| Keeps the original incident's evidence for context | Stop the agent detecting or reporting the condition |

The agent keeps detecting and reporting. The findings remain in the cluster's history, so
the fault stays visible as data even while it stays out of the incident queue.

## Reviewing them

Open a row on the **Tolerations** page to see why it was tolerated, what ARGUS had
concluded about the original incident, and what the rule has silenced since.

Review the list periodically. A toleration with a large suppressed count is either doing
exactly its job or hiding something that has grown worse; the original analysis is there to
help you tell which.

Removing a rule resumes normal detection for that object immediately.

## See also

- [What ARGUS detects](detection.md)
- [Closing an incident](closing.md)
- [Detector settings](../administration/detectors.md)
