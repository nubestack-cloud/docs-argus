# Resolution routes

Before ARGUS proposes anything, it decides *where* a fix for that object belongs. The
decision is made in ordinary code from the cluster's own facts, and it constrains what the
AI model is allowed to propose.

## The four routes

| Route | Meaning |
|---|---|
| Pull request | The object's desired state lives in a repository. The fix belongs there |
| In place | Nothing manages the object declaratively. A live change is durable |
| Pull request and in place | Both are needed: recover now, and make it stick |
| Guidance | No automatic action is appropriate. ARGUS explains instead |

The route appears as a badge at the top of every incident, with one sentence saying why it
was chosen.

## Why code decides, not the model

If a GitOps controller owns an object, patching the cluster directly is reverted at the
next sync. An operator who does not know that will conclude the fix failed.

So the route is computed from facts, not inferred: who owns the object, whether anything
applies the repository, and whether the source is editable. Having decided, ARGUS offers
the model only the action shapes that route permits — the model chooses *what* to change,
never *where*.

| Route | Actions the model may propose |
|---|---|
| Pull request | Open a pull request, or delete an object |
| In place | Scale, restart, patch limits, revert an image, delete, annotate, label, create |
| Pull request and in place | Both sets |
| Guidance | None |

## Guidance is a result

Most faults route to guidance, and that is the honest answer rather than a shortfall. A
certificate that needs reissuing outside Kubernetes, a container image that must be
rebuilt, a storage class that does not exist in this cluster — none is fixable by changing
an object, and proposing a change would be wrong.

On a guidance route the recommendation card carries the concrete manual steps from the
investigation: a real command with the real namespace and object name, or a named field and
the value it should hold.

![The recommendation card for an incident with no executable fix, showing manual steps and
the route reason](../assets/images/23-stage-recommendation-guidance.png)

*A guidance route. The card states there is nothing to execute and gives the steps a person
would take, rather than presenting an empty plan.*

## Seeing both channels

Where a fix is proposed, the recommendation card shows both channels — repository and live
cluster — each with its own availability.

An unavailable channel says why rather than disappearing: no GitOps controller reports
owning the object, the controller reports no synced commit, or the controller reports a
branch rather than a resolved commit so the running commit is not known.

The pull-request channel leads, and the live-cluster channel carries its consequence: on a
managed object, a live change is reverted at the next reconcile. Both are shown because
recovering now and fixing the source are different decisions.

## Helm releases

A Helm release has no in-cluster object naming the repository it came from, the way an Argo
CD Application or a Flux Kustomization does. So ARGUS knows a Helm release owns the object
but cannot resolve a repository for it from the cluster alone.

When that happens, the incident offers to link the release to a registered repository, with
the match ARGUS has proven by rendering the chart. Confirming it once covers every object
that release owns.

## See also

- [Pull requests](pull-requests.md)
- [In-place changes](in-place-changes.md)
- [Git repositories](../administration/repositories.md)
