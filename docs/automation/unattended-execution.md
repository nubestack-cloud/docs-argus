# Unattended execution

Unattended execution is the one setting that lets ARGUS change a cluster with no person in
the loop. It is off by default and it should stay off until you have watched ARGUS propose
fixes for a while and agreed with them.

Configure it under **Settings → Investigation**.

## What it does, precisely

It affects only plans the auto-approval policy already marks auto-approvable. Everything
else still queues for a person.

An unattended execution goes through the same signed plan, the same version check, the same
server-side dry-run rehearsal, the same admission policy and the same audit trail as an
approved one. The only thing removed is the person.

## What it cannot do

One rule is not configurable anywhere in the product:

!!! danger "A high-risk action with no known undo path always requires a human"
    Regardless of confidence, regardless of the auto-approval policy, regardless of this
    setting.

Beyond that, an unattended execution is still bounded by every other control:

| Bound | Effect |
|---|---|
| Auto-approval policy | Only plans within the risk, confidence and reversibility ceiling qualify |
| Agent namespace scope | The agent can only write where it was installed to write |
| Blast-radius caps | At most a set number of changes per cluster and per fleet in a rolling window |
| Maintenance and freeze windows | Automation may be confined to hours, or blocked outright |
| Circuit breaker | Automation stops when changes are not working |

With the shipped defaults — maximum risk low, minimum confidence 0.9, reversible required —
the set of plans that qualify is deliberately small.

## When a bound is hit

A plan stopped by a bound is not discarded. It waits in the approval queue with the reason
recorded on the incident, so you can see what would have run and why it did not.

## A sensible rollout

1. Run with unattended execution off until you have reviewed a representative set of
   plans and agreed with them.
2. Enable it on one non-production cluster.
3. Keep the default policy ceiling. Raise it only for a specific action class you have
   watched succeed repeatedly.
4. Review the audit log after each class of fault you start trusting.

## See also

- [Guardrails](guardrails.md)
- [Maintenance and freeze windows](windows.md)
- [Audit log](../administration/audit-log.md)
