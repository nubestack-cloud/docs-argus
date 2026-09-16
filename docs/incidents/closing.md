# Closing an incident

An incident ends in one of four ways. Which one it was is recorded, because "the fix
worked" and "the symptom stopped" are different facts.

## Resolved

The incident is closed and the outcome was checked. A resolution also records what is
known about the cause of the close:

| Resolution | What is known |
|---|---|
| Remediated | A succeeded execution or a merged pull request is linked to this close |
| Self-healed | Nothing of ARGUS's is linked. The symptom stopped, or someone closed it by hand |

**Self-healed** is not a claim the fault is fixed. It says only that ARGUS did not act.

![The validate card on a self-healed incident, stating that no ARGUS fix is linked to the
close](../assets/images/20-stage-validate.png)

*The validate card on a self-healed close. It states what is known — no fix of ARGUS's is
linked — rather than implying the fault was resolved by something it did.*

## Dismissed

Closed by a person's decision, without validating an outcome. Use it for a fault that is
understood and accepted, or one being handled elsewhere.

Dismissing is not the same as rejecting a plan. Rejecting refuses one proposed fix and
leaves the incident open; dismissing closes the incident.

## Expired

Closed in bulk rather than by an individual decision, because the findings behind the
incident no longer meet the bar for raising one at all.

Expiry is the one close that is not final: if the underlying problem happens again, the
incident reopens on its own. Nobody made a judgement about it, so nobody's judgement is
being overridden.

## Reopened

A closed incident whose fault came back. It re-enters the queue carrying its history, so
you can see that this is a recurrence rather than a new problem.

## Closing is otherwise final

Apart from expiry, closing an incident is final. If the same problem recurs, its detector
opens a new incident. The incident page says so where you can see it, next to the close
controls.

That is deliberate: an incident is a record of one episode, and a reopened record makes the
history of that episode ambiguous.

## Silencing rather than closing

If a condition is real, understood, accepted, and will keep re-firing, closing each new
incident is the wrong tool. Use a toleration: it stops that condition on that object from
opening new incidents at all. See [Tolerations](tolerations.md).

## See also

- [The incident lifecycle](lifecycle.md)
- [Validation](../remediation/validation.md)
- [Tolerations](tolerations.md)
