# In-place changes

An in-place change edits a live object in a cluster. It is the right route when nothing
manages that object declaratively, and a stop-gap when something does.

## What can be changed

The set is fixed. There is no mechanism to run a command or apply arbitrary YAML.

| Action | What it does |
|---|---|
| Scale deployment | Sets the replica count |
| Restart pod | Deletes a pod so its controller recreates it |
| Patch resource limits | Sets CPU or memory requests and limits on a container |
| Revert container image | Sets a container image back to a previous value |
| Annotate resource | Sets an annotation |
| Label resource | Sets a label |
| Delete resource | Deletes a named object |
| Create resource | Creates a limited, named object |

Each carries a risk level and a note on whether it can be reversed. See
[Remediation actions](../reference/remediation-actions.md).

## The checks between approval and the change

Five things happen after you approve and before anything is written. Any one of them
failing stops the change.

1. **The plan is signed** by the hub, per cluster, and expires shortly after it is issued.
   An agent will not execute an unsigned or stale plan.
2. **The object version is checked.** The plan carries the version of the object it was
   built from. If the object changed in the meantime, the change is refused rather than
   applied to a different state than was reviewed.
3. **The change is rehearsed** against the Kubernetes API with a server-side dry-run. The
   rehearsal and the real change submit identical content.
4. **The rehearsal must be confirmed.** If the API server does not confirm it performed a
   dry-run, the change is refused. It does not proceed on the assumption that silence means
   success.
5. **An admission policy checks the change independently**, restricting which fields may be
   modified regardless of what was requested.

If the API server rejects the rehearsal — an invalid value, a policy violation, a quota —
nothing is applied and the rejection message is shown on the incident.

## Namespace scope

An agent can only write in the namespaces named when it was installed. Outside them it has
no write permission at all, so a plan targeting an object there cannot execute even if
approved.

## On GitOps-managed objects

A live change to an object owned by Argo CD, Flux or a Helm release is reverted at the next
sync. ARGUS says so on the incident and refuses the change unless you confirm you mean to
override the controller.

That is occasionally the right call — restoring service now, with the durable fix going
through review separately. The incident shows both channels so it is a decision rather than
an accident.

## See also

- [Approving a fix](approvals.md)
- [Remediation actions](../reference/remediation-actions.md)
- [Rolling back](rollback.md)
