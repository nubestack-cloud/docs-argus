# Remediation actions

The complete set of changes ARGUS can execute. Each has a fixed shape; there is no action
that runs a command or applies arbitrary content.

Risk is a floor, not a fixed value: it is computed from the action plus its context, and
context can raise it but never lower it below the floor.

| Action | What it does | Risk floor | Reversible | Auto-approval |
|---|---|---|---|---|
| Scale deployment | Sets the replica count | Low | Yes | Eligible |
| Restart pod | Deletes a pod so its controller recreates it | Medium | Not applicable | Eligible above the default ceiling |
| Patch resource limits | Sets CPU or memory requests and limits | Medium | Yes | Never |
| Revert container image | Sets a container image to a previous value | Medium | Yes | Never |
| Annotate resource | Sets an annotation | Low | Yes | Never |
| Label resource | Sets a label | Low | Yes | Never |
| Create resource | Creates a limited, named object | Medium | No | Never |
| Delete resource | Deletes a named object | High | No | Never |
| Open pull request | Opens a pull request against the owning repository | Low | Not applicable | Eligible |
| Cordon node | Marks a node unschedulable, or schedulable again | Medium | Yes | Never |
| Drain node | Evicts a node's pods through the eviction API | High | No | Never |

Separately from plans, an incident about a GitOps-owned object offers **Request Argo
refresh** or **Request Flux reconcile**. These ask the controller to look again; they change
no workload, and they need the remediation agent and the capability to apply in place.

## Which actions each route permits

The route is decided before the model proposes anything, and it constrains what may be
proposed.

| Route | Permitted |
|---|---|
| Pull request | Open pull request, delete resource |
| In place | Scale, restart, patch limits, revert image, annotate, label, create, delete; cordon and drain on a Node incident |
| Pull request and in place | Both sets |
| Guidance | None |

## Node actions

Cordon and drain are offered only for an incident about a Node, and only on a cluster
whose agent chart sets `remediate.nodeOps.enabled` as well as `remediate.enabled`. They
need their own opt-in because neither permission can be narrowed by name: patching nodes
reaches every node, and creating evictions reaches every pod.

- **Cordon** changes `spec.unschedulable` and nothing else. An admission policy installed
  with the chart refuses any other change to a Node from the remediation identity, including
  labels, annotations and taints. Undo uncordons.
- **Drain** goes through the eviction API, so disruption budgets hold. DaemonSet, mirror
  and finished pods stay. Before evicting anything it refuses the whole drain if a pod has
  no controller (nothing would recreate it) or holds `emptyDir` data, unless the plan
  allows deleting that data. A pod whose eviction a disruption budget refuses stays where
  it is and is reported as blocked; it is not retried. The object panel's **Drain impact**
  tab shows the same picture before anyone proposes a drain.

## Reversibility

A plan declares whether ARGUS captured enough state to undo it. Two actions are never
allowed to claim they are reversible:

**Delete resource.** Recreating an object does not restore its identity, and it does not
recover a volume claim's data. Anything referring to the deleted object would still be
broken.

**Create resource.** There is no reviewed delete path covering the kinds a create can
target, so no compensating action exists. An operator can remove the object by hand.

## Auto-approval

Only three actions are ever eligible for auto-approval. Everything else is approval-only by
construction, whatever the policy says and however confident the analysis is.

With the default policy — maximum risk low, minimum confidence 0.9, reversible required —
only **scale deployment** and **open pull request** qualify, because restart floors at
medium.

One rule overrides everything: a high-risk action with no known undo path always requires a
person.

## See also

- [In-place changes](../remediation/in-place-changes.md)
- [Guardrails](../automation/guardrails.md)
- [Resolution routes](../remediation/routes.md)
