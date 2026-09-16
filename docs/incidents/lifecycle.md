# The incident lifecycle

Every incident moves through the same six stages, and the incident page is laid out as
those stages in order. The rail across the top shows how far this incident got.

![The six-stage lifecycle rail across an incident page: detection, analysis,
recommendation, approve, apply, validate](../assets/images/04-incident-detail.png)

*The rail is a progress indicator. Stages an incident never reached are shown unreached
rather than hidden, so "stopped at three of six" is legible at a glance.*

## The six stages

| Stage | Question it answers |
|---|---|
| 1. Detection | What broke |
| 2. Analysis | Why it broke |
| 3. Recommendation | How to fix it |
| 4. Approve | Does a person agree |
| 5. Apply | What ARGUS did |
| 6. Validate | Did it hold |

Most incidents stop at stage three. A fault with a clear cause and no automatically
executable fix is a complete, correct outcome — the last three cards collapse to a single
line saying nothing was executed, rather than presenting three empty boxes.

## States

An incident is always in exactly one state. The state is what the badge shows and what the
overview counts.

### Before a fix exists

| State | Meaning |
|---|---|
| Detected | Recorded, not yet investigated |
| Investigating | An investigation is running now, gathering live evidence |
| Diagnosed | Investigation complete with a real cause, but nothing ARGUS can execute |
| Needs human investigation | No conclusion reached, or a conclusion with no supported action |

### Waiting on a person

| State | Meaning |
|---|---|
| Awaiting approval | A plan is proposed and waiting for a decision |
| Plan rejected | Someone refused the proposed fix. Nothing was executed and the fault is unchanged |

### Acting

| State | Meaning |
|---|---|
| Executing | An approved in-place change is being applied |
| Awaiting merge | A pull request is open. ARGUS is waiting for it to merge and sync |
| Validating | The change landed; ARGUS is checking whether it held |

### Ended

| State | Meaning |
|---|---|
| Resolved | Closed. The badge also says whether ARGUS's own fix is linked to the close |
| Dismissed | Closed by a person's decision, without validating an outcome |
| Expired | Closed in bulk because the findings behind it no longer meet the bar for an incident |
| Reopened | A closed incident whose fault came back |

### Outcome not known

Two states exist because "we do not know" is more useful than a guess.

| State | Meaning |
|---|---|
| Execution outcome unknown | ARGUS ran the change and lost track of whether it applied. Check the cluster |
| Fix applied, not confirmed | The change was applied and could not be confirmed. Neither a failure nor a success |

| State | Meaning |
|---|---|
| Failed | The change ran and failed. The reason is on the apply card |

## What closing means

Closing is final. If the same problem happens again, its detector opens a **new** incident
rather than reopening the old one — with one exception: an incident closed as **Expired**
reopens on its own if the underlying finding comes back, because nobody made an individual
decision about it.

A resolved incident also records *how* it was resolved:

| Resolution | What is known |
|---|---|
| Remediated | A succeeded execution or a merged pull request is linked to this close |
| Self-healed | Nothing of ARGUS's is linked. The symptom stopped, or a person closed it |

"Self-healed" is deliberately not worded as "fixed".

## See also

- [Reading an incident](reading-an-incident.md)
- [Incident states](../reference/incident-states.md)
- [Closing an incident](closing.md)
