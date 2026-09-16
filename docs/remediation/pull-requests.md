# Pull requests

When a repository owns the desired state of a broken object, the durable fix belongs there.
ARGUS proposes the change, opens the pull request, and waits — it does not merge.

## Before it can propose one

Two things have to be true:

1. The repository is registered under **Settings → Git repositories**, with a credential
   that can read files, create a branch, push a commit and open a pull request.
2. ARGUS can resolve which repository and path own the object. For Argo CD and Flux it
   reads that from the controller's own object. For a Helm release, you confirm the link
   once.

## What it changes

ARGUS reads the files at the revision your controller reports as currently synced, not at
the head of the branch. The change is therefore proposed against what is actually running.

Before opening the branch, the edit is verified to be the change that was intended and
nothing else: one field, one line, with surrounding comments, anchors and formatting
unchanged. An edit that does not satisfy that is not proposed.

You review the full file diff before the pull request opens, and you can adjust the field
and value first.

## After it opens

The incident moves to **awaiting merge**. Your normal review process applies — ARGUS has no
part in it.

Once the pull request merges, ARGUS confirms your GitOps controller has synced past that
commit, then moves the incident into validation. From there it resolves on its own if the
fix held.

## Templated sources

A file containing template expressions is not edited. Setting a rendered value back into a
template is not a safe mechanical edit — the value may be computed, shared across
environments, or overridden elsewhere.

For those, ARGUS states where the source is and what needs changing, and leaves the edit to
a person who can see the template's intent.

## Rendering evidence

Where the source is a renderable Helm chart or Kustomize overlay, ARGUS can render before
and after and include the resulting difference with the proposal, so a reviewer sees the
effect of the change on the produced manifests rather than only the source edit.

## See also

- [Git repositories](../administration/repositories.md)
- [Resolution routes](routes.md)
- [Validation](validation.md)
