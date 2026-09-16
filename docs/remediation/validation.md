# Validation

ARGUS does not treat applying a change as fixing a problem. After a change lands, the
incident moves to validation and has to earn its resolution.

## The three signals

| Signal | What it checks |
|---|---|
| Quiet period | The symptom has not re-fired for a grace period, at least fifteen minutes and always longer than the agent's resend interval |
| The change still holds | The field that was set still has the value it was set to |
| No sibling incident | No related incident is open on the same workload |

All three must hold. Only then does the incident resolve.

The quiet period is deliberately longer than the interval at which an agent re-sends a
condition it still sees, so "no news" cannot be mistaken for "fixed" when it only means
"not reported yet".

## For a pull request

Validation begins once the merge is confirmed and your GitOps controller reports it has
synced past the merge commit. The same quiet period then applies.

## When the outcome is not known

Two states exist for the cases where ARGUS genuinely cannot tell, because a guess would be
worse:

**Execution outcome unknown.** The change ran and ARGUS lost track of whether it applied.
Check the cluster before deciding what to do next.

**Fix applied, not confirmed.** The change was applied and could not be confirmed — neither
by re-reading the changed value nor by re-checking the original fault. This is neither a
failure nor a success, and it needs a person.

Neither is worded as a failure, because neither is one.

## What validation does not do

Validation confirms the change was made and the symptom stopped. It does not re-run the
original detector check as a synthetic health probe.

For the faults ARGUS remediates the two coincide closely — the symptom is the check — but
they are not the same thing, and the distinction is worth knowing when you read a
resolution.

## See also

- [The incident lifecycle](../incidents/lifecycle.md)
- [Closing an incident](../incidents/closing.md)
- [Rolling back](rollback.md)
