# Incident states

An incident is in exactly one state. The badge shows it in plain words; the status tabs on
the incident list group the states by who has the next move.

| Badge | State | Status tab | Waiting for |
|---|---|---|---|
| Not investigated | Detected | Needs action | An investigation, manual or automatic |
| Investigating | Investigating | In progress | The investigation to finish |
| Fix is yours | Diagnosed | Needs action | A person to act on the guidance |
| Needs a person | Needs human investigation | Needs action | A person: no cause was found, or no supported action expresses the fix |
| Waiting on a decision | Awaiting approval | Needs action | An approval decision |
| Fix rejected | Plan rejected | Needs action | A different fix, or a close |
| Running the fix | Executing | In progress | The cluster |
| Pull request open | Awaiting merge | In progress | Your review and merge, then a controller sync |
| Watching | Validating | In progress | The re-check window to pass |
| Fix failed | Failed | Needs action | A person to review the cause |
| Run not confirmed | Execution outcome unknown | Needs action | Someone to check the cluster |
| Fix applied, not confirmed | Validation outcome unknown | Needs action | Someone to look |
| Reopened | Reopened | Needs action | An investigation or a decision |
| Resolved | Resolved | Closed | Nothing |
| Dismissed | Dismissed | Closed | Nothing |
| Expired | Expired | Closed | Nothing, unless the fault recurs |

**Open** on the incident list is **Needs action** and **In progress** together: every
incident whose lifecycle is not over.

## Resolution kinds

A resolved incident also records what is known about the close.

| Kind | What is known |
|---|---|
| Remediated | A succeeded execution or a merged pull request is linked to this close |
| Self-healed | Nothing of ARGUS's is linked. The symptom stopped, or a person closed it |

## Closing

Closing is final: a recurrence opens a new incident. The exception is **Expired**, which
reopens on its own if the underlying finding returns, because no individual decision was
made about it.

## See also

- [The incident lifecycle](../incidents/lifecycle.md)
- [Closing an incident](../incidents/closing.md)
