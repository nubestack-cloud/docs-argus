# Audit log

The audit log is the record of every consequential action, hash-chained so that a removed or
altered entry is detectable.

Reading it requires super-admin. It is one of the two things only that role can do.

![The audit log, listing actions with actor, capability, outcome, cluster and
timestamp](../assets/images/08-audit-log.png)

*Each entry records who did what, to which object, with which capability, and whether it
succeeded.*

## What is recorded

| Area | Examples |
|---|---|
| Access | Sign-ins, failures, token issuance |
| Incidents | Investigations started, incidents resolved, dismissed or tolerated |
| Remediation | Approvals and rejections with their reasons, executions and outcomes, rollbacks |
| Clusters | Enrolment, acceptance, rejection, archiving, remediation scope changes |
| Configuration | Settings changes, provider changes, repository registration |
| People | Account creation, role grants and removals |

Each entry records the actor, how they authenticated, the source address, the capability
used and the outcome — including failures. A refused action is as much a record as a
permitted one.

## The hash chain

Entries are chained: each carries a hash covering its own content and the entry before it.
Deleting or editing one breaks the chain from that point on, which is detectable.

The chain can be verified independently of the hub, directly against the database, so a
verification does not depend on the software whose records are being checked.

## Filtering

Filter by actor, capability, cluster, outcome and time range. The common questions — who
approved this, what changed on this cluster last week, what has this account done — are each
one filter.

## Unattended executions

An unattended execution is recorded exactly as an approved one is, with the gate's verdict
and rationale in place of a person's decision. A change with no human in the loop is not a
change with no record.

## Retention

Audit retention is set independently of incidents and findings, under **Settings → General**.
It defaults to keeping everything. Consider your own obligations before setting a window —
see [Data retention](retention.md).

## See also

- [Users and roles](users-and-roles.md)
- [Data retention](retention.md)
- [Security model](../overview/security-model.md)
