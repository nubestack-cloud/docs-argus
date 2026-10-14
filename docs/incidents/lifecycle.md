# The incident lifecycle

Every incident moves through four phases and ends in an outcome. The incident page draws
them as a spine across the top, with a line beneath it saying who has the next move.

![The lifecycle spine of a remediated incident: detected, diagnosed, fix applied, holding,
and the outcome fixed by ARGUS](../assets/images/24-incident-lifecycle.png)

*Each phase shows what happened and when, and the gap above the line between two phases
is how long that step took.*

## The four phases

| Phase | Question it answers | What you see |
|---|---|---|
| Detected | What broke | Occurrences, and when it was first seen |
| Diagnosed | Why it broke | Whether a cause was found, and the confidence the model gave it |
| Fix | What to do, and who does it | The route, then **Decide** and **Run** for a fix ARGUS runs |
| Holding | Did it stay fixed | The re-check window after a fix, or how the symptom stopped |

The **Outcome** at the end of the spine is **Open** until the incident closes, then names how
it closed: **Fixed by ARGUS**, **Resolved · Self-healed**, **Dismissed** or **Expired**.

A phase that cannot happen for this incident is drawn as skipped, never as an empty step.
Most faults have no fix ARGUS can run: the Fix phase then says **You do it**, holds the
steps the investigation produced, and the spine continues from there.

## Who has the next move

The line under the spine is the one sentence to read first. It names who is expected to act
and what they would do, and links to the part of the page that holds it.

| Says | Meaning |
|---|---|
| Your move | Nothing happens until a person acts: investigate, decide on a fix, or apply one |
| Waiting on an approver | A fix is proposed and you cannot approve it yourself |
| ARGUS is working | An investigation or an approved fix is running now |
| Your team's review | A pull request is open and waits for your normal review and merge |
| ARGUS is watching | A fix landed and ARGUS is watching for the symptom to come back |
| Closed | The incident is over, and how it ended |

## States

Underneath the phases, an incident is always in exactly one state. The badge shows it in
plain words: **Not investigated**, **Waiting on a decision**, **Fix is yours**,
**Pull request open**, **Watching**, **Resolved** and so on. The incident list's status tabs
group the states by who has the next move. [Incident states](../reference/incident-states.md)
lists every state, its badge and its tab.

## Incidents that clear on their own

A fault often stops before anyone acts: a node comes back, a rollout finishes, a pod is
replaced. ARGUS does not leave such an incident open. Once nothing new has been reported
for it for a quiet period — fifteen minutes, or three times the agent's resend cooldown if
that is longer — it checks whether the problem is really gone:

1. If a sweep rule raised it, the rule is evaluated again against the live object.
2. Otherwise the live object is read: a pod, node, workload, volume claim, service or
   disruption budget is checked for the condition that made it unhealthy.
3. If the object no longer exists, there is nothing left to be broken.

When the check passes, the incident closes as **Resolved · Self-healed** and its history
records why. When it fails, or cannot be made, the incident stays open. An incident waiting
on an approval is included: if its problem clears, the pending fix is withdrawn rather than
left for someone to approve against a healthy object.

![An incident that cleared on its own: diagnosed, nothing run, and the outcome
Resolved · self-healed](../assets/images/17-incident-diagnosed.png)

*The spine shows no fix was run; the line under it says the symptom stopped without an
ARGUS fix.*

The quiet period starts again whenever the agent reconnects, so a hub or agent restart
delays these closes rather than triggering them.

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
