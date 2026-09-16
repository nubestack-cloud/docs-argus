# Guardrails

Three controls bound unattended execution in different dimensions: what may run, how much
may run, and whether what ran is working. They are independent, and all three apply.

## The auto-approval policy

A ceiling on which plans may be approved without a person.

| Setting | Default |
|---|---|
| Maximum risk level eligible | Low |
| Minimum confidence | 0.9 |
| Require the plan to be reversible | Required |

While unattended execution is off, this policy changes only the verdict and rationale the
gate records — a plan it marks auto-approvable still waits for a person. Turning on
unattended execution is what makes the policy consequential.

The policy is a ceiling, never an override. A high-risk action with no known undo path
always requires a human, whatever is set here.

## Blast-radius caps

A bound on how much automation may change in a rolling window.

| Cap | Default |
|---|---|
| Per cluster | 3 changes |
| Across the whole fleet | 10 changes |
| Window | 60 minutes |

A blank field means the default, never unlimited. Zero is refused rather than read as
"never", because it would resolve to the default and do the opposite of what was meant.

When a cap is reached, the plan waits in the approval queue with the reason recorded.

## The circuit breaker

Blast-radius caps bound how much automation runs and windows bound when. The breaker bounds
it on whether it is *working*, which neither of the others can see.

It counts bad outcomes — a remediation that failed, or one that succeeded and was then
reverted — and trips after two on one cluster, or four across the fleet, within an hour.

**Resetting is manual by design.** A breaker that re-closed on a timer would be another rate
limiter rather than a stop.

A tripped breaker stops unattended execution. A person can still approve a remediation
while it is open.

## What none of them restrict

None of these gate a human. A person with the right capability can approve a fix at any
time, in any window, with any breaker open. These controls exist to bound what happens
without a person, not to stand between an operator and a decision they have made.

## See also

- [Unattended execution](unattended-execution.md)
- [Maintenance and freeze windows](windows.md)
- [Approving a fix](../remediation/approvals.md)
