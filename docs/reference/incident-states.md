# Incident states

An incident is in exactly one state. The state is what the badge shows, what the overview
counts, and what the incident list filters on.

| State | Meaning | Waiting for |
|---|---|---|
| Detected | Recorded, not yet investigated | An investigation, manual or automatic |
| Investigating | An investigation is running, gathering live evidence | The investigation to finish |
| Recommendation ready | Investigation complete, with a plan ARGUS can act on | A person to review the plan |
| Diagnosed | Complete, with a real cause, but nothing ARGUS can execute | A person to act on the guidance |
| Needs human investigation | No conclusion, or a conclusion with no supported action | A person |
| Awaiting approval | A plan is proposed | An approval decision |
| Plan rejected | Someone refused the plan. Nothing executed, fault unchanged | A different fix, or a close |
| Executing | An approved in-place change is being applied | The cluster |
| Awaiting merge | A pull request is open | The merge, then a controller sync |
| Validating | The change landed; ARGUS is checking it held | The quiet period to elapse |
| Resolved | Closed, outcome checked | Nothing |
| Dismissed | Closed by a person's decision, without validating an outcome | Nothing |
| Expired | Closed in bulk; its findings no longer meet the bar for an incident | Nothing, unless the fault recurs |
| Reopened | A closed incident whose fault came back | An investigation or a decision |
| Failed | The change ran and failed | A person to review the cause |
| Execution outcome unknown | ARGUS ran the change and lost track of whether it applied | Someone to check the cluster |
| Fix applied, not confirmed | Applied, and neither confirmed nor disproved | Someone to look |

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
