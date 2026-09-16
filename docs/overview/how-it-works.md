# How it works

ARGUS runs one loop, in six stages, for every problem it finds. The incident screen shows
those same six stages in order, so what you read on screen is the loop itself.

```text
   ┌──────────┐   ┌──────────┐   ┌────────────────┐
   │ Detection │──▶│ Analysis │──▶│ Recommendation │
   └──────────┘   └──────────┘   └────────────────┘
    what broke     why it broke    how to fix it
                                          │
   ┌──────────┐   ┌──────────┐   ┌─────────▼──────┐
   │ Validate │◀──│  Apply   │◀──│    Approve     │
   └──────────┘   └──────────┘   └────────────────┘
    did it hold    make it so     a person decides
```

## 1. Detection

Each cluster agent watches three things: Kubernetes Warning events, pod status conditions,
and sustained state that outlasts any single event — replica shortfalls, wedged volume
claims, failed jobs, pressured nodes, services with no ready endpoints.

The agent discovers which resource kinds exist in its own cluster and which of them it is
allowed to read, then watches that set. A cluster running Gateway API, cert-manager or your
own custom resources is covered by the same checks without a new release.

Symptoms are reported as findings. Findings are grouped by a fingerprint of the condition
and the object, so a fault that re-fires a hundred times is one incident with a hundred
occurrences rather than a hundred alerts.

## 2. Analysis

An incident with symptoms is not yet a diagnosis. The analysis stage runs an AI
investigation: the model is given the incident and a set of read-only tools, and works
through the cluster asking the questions a person would ask.

The loop is bounded — a maximum number of model round-trips and a wall-clock limit, both
configurable. It ends with a root cause, a confidence figure, and a causal chain recording
every tool call it made and what came back.

## 3. Recommendation

Before the model is asked to propose anything, ARGUS decides where a fix belongs. That
decision is made in ordinary code from the cluster's own facts — who owns the object,
whether anything applies the repository, whether the source is editable — and it constrains
what the model may propose.

The result is one of four routes: a pull request, an in-place change, both, or guidance
where no automatic action is appropriate. Most faults land on guidance, and the card says
so rather than inventing a fix.

## 4. Approve

A proposed fix waits for a person. The approval view shows the target object, the action,
its risk level, whether it can be reversed, the rendered change, and the evidence the plan
depends on.

Approval is a capability that can be granted separately from the ability to execute in a
cluster, and every decision is recorded with its reason.

## 5. Apply

An approved in-place change is signed, checked against the object version it was built
from, and rehearsed against the Kubernetes API with a server-side dry-run. If the API
server rejects the rehearsal, nothing is applied and the rejection is shown.

An approved repository change opens a pull request. ARGUS does not merge it.

## 6. Validate

ARGUS does not treat applying a change as success. After a change lands, the incident moves
to validation: the symptom must stay quiet for a grace period, the field that was changed
must still hold the value that was set, and no sibling incident on the same workload may be
open. Only then does the incident resolve.

For a pull request, validation begins when the merge is confirmed and your GitOps controller
reports it has synced past that commit.

## See also

- [The incident lifecycle](../incidents/lifecycle.md)
- [Architecture](architecture.md)
- [Validation](../remediation/validation.md)
