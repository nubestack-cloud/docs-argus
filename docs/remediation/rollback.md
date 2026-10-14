# Rolling back

Where a change ARGUS applied can be undone, the incident offers to undo it. The rollback
travels the same path as the original change.

## What can be undone

A change is reversible when ARGUS captured enough of the previous state to restore it: the
replica count before a scale, the image before a revert, the limits before a patch.

The plan says whether it is reversible before you approve it, so you know what you are
committing to.

Deletions and creations are treated as what they are. Deleting an object cannot be undone
by recreating one that merely looks the same, and ARGUS does not claim otherwise.

## Recent changes

**Recent changes**, under **History** in the sidebar, lists every change ARGUS has made to a
cluster: changes applied in place, and repository changes whose pull request merged. Pull
requests still waiting to merge are listed too, marked **Open — not merged**, because they
have not changed anything yet.

![The recent changes page: each change ARGUS made, how and with what outcome, who approved
it, and the undo it offers](../assets/images/39-recent-changes.png)

*Each change says what was done, where, by whose approval, and what undoing it would
restore.*

Each row names the object and the change, how it was made, its outcome, the cluster, who
approved it and when, and what **Undo…** would restore. A change that has already been rolled
back says so instead of offering undo again. Narrow by cluster and time window.

Undoing reverses what ARGUS did. It does not fix the problem that prompted the change.

## How it runs

A rollback is not a shortcut. It is signed, version-checked, rehearsed with a server-side
dry-run and checked by the admission policy exactly as the original change was — the same
five checks, in the same order.

That means a rollback can be refused, for the same reasons a change can: the object moved
on, the value is no longer valid, the policy forbids it.

## When it is the wrong tool

If the change worked and the fault came back for another reason, rolling back restores the
earlier fault. The incident's history shows what changed and when, which is usually the
better place to start.

If the change was reverted by a GitOps controller rather than by ARGUS, there is nothing to
roll back — the cluster is already back to what the repository says. The durable fix belongs
in the repository. See [Resolution routes](routes.md).

## See also

- [In-place changes](in-place-changes.md)
- [Validation](validation.md)
- [Audit log](../administration/audit-log.md)
