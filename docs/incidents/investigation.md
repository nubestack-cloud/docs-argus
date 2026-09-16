# Investigation

An investigation is an AI model working through your live cluster with read-only tools,
recording what it asked and what came back. This page covers what it is given, what it
produces, and how to judge the result.

## Starting one

Select **Analyze** on an incident. Investigations run on the hub, not in your browser, so
you can navigate away or close the tab — the incident updates when it finishes.

Investigations can also start on their own for severities you nominate. See
[Automatic investigation](../automation/automatic-investigation.md).

## What the model can do

The model has a fixed set of read-only tools and no others. It can describe objects, read
logs, list events, walk owner chains, look up a resource's schema, and ask whether an
object is managed by a GitOps controller or a Helm release.

It has no shell, no write access, and no way to reach outside the cluster the incident
belongs to. It cannot read Secrets: they are outside the set of kinds the tools can fetch,
and the agent's permissions do not grant them.

Everything it receives has been redacted inside the cluster before it crossed the network.
See [Security model](../overview/security-model.md).

## Bounds

Every investigation is bounded by a maximum number of model round-trips and a wall-clock
limit — eight iterations and 180 seconds by default, both configurable under
**Settings → Investigation**.

An investigation that reaches a bound stops and reports what it found, marked partial,
rather than continuing or inventing a conclusion.

## What it produces

| Output | What it is |
|---|---|
| Root cause | A statement of what is actually wrong, in prose |
| Confidence | The model's own signal about that statement. Not a measurement |
| Causal chain | Every tool call it made, in order, with the finding at each step |
| Ruled out | Hypotheses it considered and rejected, with the reason |
| Suggested next steps | Concrete manual steps, where a person would need to act |
| Plan | A typed, executable action, where one expresses the fix |

## Judging the result

**Read the chain, not the confidence.** The chain is the evidence; the confidence is a
claim about it. A high figure over a thin chain is a weaker result than a moderate figure
over a thorough one.

**Check the provenance label.** The chain header says whether ARGUS observed the tool calls
directly as they ran, or the model reported them afterwards. A self-reported chain is
cross-checked against the hub's own record of what it served, but directly observed is
stronger.

**Treat "no plan" as a result.** Most faults have no automatically executable fix. An
investigation that reaches a clear cause and proposes nothing has done its job; the manual
steps on the recommendation card are the deliverable.

## Cost

Each analysis records the model, iterations, tokens and cost. Where a provider bills a flat
subscription rather than per request, cost is shown as not measured rather than as zero.

Set a daily ceiling under **Settings → Model pricing**. See
[Model pricing and spend](../administration/spend.md).

## See also

- [Reading an incident](reading-an-incident.md)
- [Resolution routes](../remediation/routes.md)
- [AI providers](../administration/ai-providers.md)
