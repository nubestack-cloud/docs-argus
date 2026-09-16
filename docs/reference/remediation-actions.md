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

## Which actions each route permits

The route is decided before the model proposes anything, and it constrains what may be
proposed.

| Route | Permitted |
|---|---|
| Pull request | Open pull request, delete resource |
| In place | Scale, restart, patch limits, revert image, annotate, label, create, delete |
| Pull request and in place | Both sets |
| Guidance | None |

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
