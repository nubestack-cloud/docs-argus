# Reading an incident

The incident page is six cards, one per lifecycle stage, each answering one question. This
page says what is in each and what to look at first.

## Read these three things first

The heading names the object — kind, namespace, name — and the line under it is the
condition text from the cluster itself. Between them they answer "what broke" without
scrolling.

The **route** badge says where a fix for this object belongs: a pull request, an in-place
change, both, or guidance.

The **rail** says how far the incident got. If it stopped at three, there is nothing to
approve and the remaining cards say so in one line.

## 1. Detection

The finding that opened the incident: the object, and the condition in the cluster's own
words. When a GitOps controller owns the object, a chip names it — that is a fact about the
object, true before any fix is considered.

Open **What happened** for the full history of this condition recurring, rather than only
its most recent occurrence.

## 2. Analysis

![The analysis card, showing a root-cause statement, a confidence figure and a collapsed
causal chain](../assets/images/21-stage-analysis.png)

*The root cause in prose, the confidence beside it, and the causal chain collapsed behind
its own step count and provenance.*

The root-cause statement, a confidence figure, and the causal chain. The chain is collapsed
by default; its header still shows how many steps it has and whether ARGUS observed the
tool calls directly or the model reported them afterwards.

Open a step to see the tool call and what came back. Nothing in this card is a substitute
for that evidence — a high confidence figure next to a chain you have not read is still an
unverified claim.

The footer records the model, how many iterations it used, tokens, cost and when it ran,
and marks an investigation that ran automatically rather than because someone clicked.

## 3. Recommendation

What to do, and where it belongs. This card holds:

- the route and, in one sentence, why that route
- the concrete manual steps, where the investigation produced them
- the proposed plan, if there is one, with its risk and reversibility
- the two channels — repository and live cluster — each with its own availability and its
  own rendered change
- **Why this route?**, collapsed, holding the repository, path and synced commit behind the
  decision

![The recommendation card, showing the pull-request and in-place channels with their
availability and the rendered change](../assets/images/19-stage-recommendation.png)

*Both channels are shown, with the reason one is unavailable rather than hiding the option.
The pull-request route leads, because a live patch to a GitOps-managed object is reverted by
the next sync. The repository, path and synced commit sit behind* Why this route? *at the
bottom.*

## 4. Approve

The decision. Shown only when there is something to decide: the action, the target, the
risk level, whether it can be reversed, and the rendered change.

Where a plan cannot execute unattended, this card says which gate stopped it. Where an
incident is held pending a fleet-wide staged rollout, it says that too.

## 5. Apply

What ARGUS did. For an in-place change: the result of the dry-run rehearsal, then the
execution outcome. For a repository change: the pull request, linked, with its merge state.

## 6. Validate

Whether the fix held. Validation is not a formality — see
[Validation](../remediation/validation.md) for the three signals it requires.

## When cards 4, 5 and 6 collapse

If an incident never reached execution, those three cards become one line: *no fix was
executed — nothing to approve, apply or validate*. This is the majority case. The rail
still shows all six stages, because how far the incident got is information.

![A diagnosed incident whose rail marks recommendation, approve, apply and validate as not
applicable](../assets/images/17-incident-diagnosed.png)

*A diagnosed incident. The cause is stated at 95% confidence, and the rail marks the
remaining stages* not applicable *rather than pending — the investigation finished, and
there is nothing for ARGUS to execute.*

## See also

- [The incident lifecycle](lifecycle.md)
- [Investigation](investigation.md)
- [Resolution routes](../remediation/routes.md)
