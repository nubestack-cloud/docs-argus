# How it works

ARGUS runs one loop for every problem it finds: detect it, work out why, fix it, and check
the fix held. The incident page draws the same loop as four phases and an outcome, so what
you read on screen is the loop itself.

```text
   Detected ──▶ Diagnosed ──▶     Fix      ──▶ Holding ──▶ Outcome
   what broke   why it broke   decide, run    did it hold   how it ended
                               or you do it
```

## Detection

Each cluster agent watches three things: Kubernetes Warning events, pod status conditions,
and sustained state that outlasts any single event — replica shortfalls, wedged volume
claims, failed jobs, pressured nodes, services with no ready endpoints, stalled GitOps
reconciliation.

The agent discovers which resource kinds exist in its own cluster and which of them it is
allowed to read, then watches that set. A cluster running Gateway API, cert-manager or your
own custom resources is covered by the same checks without a new release.

Symptoms are reported as findings. Only a finding that shows a real fault — degraded or
unavailable, on better than unverified evidence — opens an incident. Everything else, such
as a risky setting that has not caused harm yet, is kept as a signal you can browse.

## Grouping

One fault produces many findings, and ARGUS turns them into one incident:

- Repeats of the same condition on the same object are one incident with an occurrence
  count.
- Pods of one workload with the same fault are one incident on the workload, with the pod
  it was observed on named.
- A pod waiting on a volume claim, ConfigMap or Secret that has its own incident joins that
  incident, and so does every pod on a node that is not ready.
- Probe failures from pods starting during a rollout in progress are recorded, not raised;
  a rollout that stalls past its deadline raises an incident on its own.

## Diagnosis

An investigation gives an AI model the incident and a fixed set of read-only tools, and the
model works through the live cluster asking the questions a person would ask. The loop is
bounded by a maximum number of model round-trips and a time limit. It ends with a root
cause, a confidence figure, and a causal chain recording every tool call and what came back.

Investigations run when someone selects **Analyze**, or automatically for the severities you
choose.

## Fix

Before the model is asked to propose anything, ARGUS decides where a fix belongs. That
decision is made in ordinary code from the cluster's own facts — who owns the object,
whether anything applies the repository, whether the source is editable — and it limits
what the model may propose.

The result is one of four routes: a pull request, an in-place change, both, or guidance.
Most faults land on guidance: the cause is known, and the steps are a person's.

When ARGUS can run the fix, a person approves it first. An approved in-place change is
signed, checked against the object version it was built from, and rehearsed against the
Kubernetes API before it is applied. An approved repository change opens a pull request,
which ARGUS never merges.

## Holding

Applying a change is not treated as success. The symptom must stay quiet for a re-check
window, the changed field must still hold the value that was set, and no sibling incident on
the same workload may be open. Only then does the incident close as **Fixed by ARGUS**.

For a pull request, holding begins when the merge is confirmed and your GitOps controller
reports it has synced past that commit.

## When the problem stops by itself

Many faults clear without anyone acting. Once an incident has been quiet for its re-check
window, ARGUS checks the live object, or re-runs the rule that raised it. If the problem is
gone, the incident closes as **Resolved · Self-healed**, and a fix still waiting for approval
is withdrawn. See [The incident lifecycle](../incidents/lifecycle.md).

## See also

- [The incident lifecycle](../incidents/lifecycle.md)
- [Architecture](architecture.md)
- [Validation](../remediation/validation.md)
