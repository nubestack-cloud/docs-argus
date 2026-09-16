# Fixing things

What ARGUS can change, where it decides a change belongs, who approves it, and how it
confirms the change worked.

- [Resolution routes](routes.md) — how ARGUS decides between your repository and the live
  cluster, and why the decision is not left to the model.
- [Approving a fix](approvals.md) — the decision, what to read before making it, and what
  approval sets in motion.
- [Pull requests](pull-requests.md) — the repository route, from proposal to merge to
  resolution.
- [In-place changes](in-place-changes.md) — the live-cluster route, and the checks between
  approval and the change landing.
- [Validation](validation.md) — why an applied change does not close an incident.
- [Rolling back](rollback.md) — undoing a change ARGUS applied.

!!! note "Nothing here happens on a fresh install"
    Agents install read-only. Until you enable remediation for a cluster and name the
    namespaces it may write in, ARGUS can propose fixes and open pull requests but cannot
    change a cluster.
