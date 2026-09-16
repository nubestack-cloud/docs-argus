# Git repositories

Registering a repository is what lets ARGUS propose a fix as a pull request. Without one,
a GitOps-managed object can be diagnosed but its durable fix cannot be offered.

Go to **Settings → Git repositories**.

![The Git repositories page listing registered repositories with their provider, host and
credential expiry](../assets/images/11-settings-repositories.png)

*Each entry shows the provider, whether it is the public API or a self-hosted instance, and
when its credential expires.*

## Why it matters

When a GitOps controller owns a broken object, changing the cluster directly is a stop-gap
the next sync reverts. The durable fix belongs in the repository the object came from — and
ARGUS already knows which one that is, from the controller's own record. Registering the
repository supplies the one thing it cannot derive: permission to write.

## Adding one

| Field | Notes |
|---|---|
| Repository URL | Public provider or self-hosted instance |
| Provider | Which hosting product it is |
| API base URL | For a self-hosted instance |
| Credential | A token with the permissions below |
| Base branch | The branch pull requests target, where it is not the default |

The credential needs to read files, create a branch, push a commit and open a pull request.
It does not need permission to merge — ARGUS does not merge.

Credentials are stored encrypted. Where a token carries an expiry, the page shows how long
is left, so a credential does not lapse unnoticed and turn into a failed proposal during an
incident.

## Checking a credential

**Check credential** verifies the token reaches the repository with the permissions it
needs. Run it after adding one, and after rotating one.

## Helm releases

An Argo CD Application or a Flux Kustomization names its own repository, so ARGUS resolves
it from the cluster. A Helm release does not, so it knows the release owns the object but
cannot tell which repository the chart came from.

When that happens, the incident offers a link between the release and a registered
repository, with the match proven by rendering the chart and comparing the result to what is
running. Confirm once and every object that release owns is covered.

The confirmation is deliberate rather than automatic: it decides which repository future
pull requests are opened against.

## Register early

Register repositories before you need them. The route for an incident is decided when it is
investigated, so a repository added afterwards does not retrospectively change a
recommendation that has already been made.

## See also

- [Pull requests](../remediation/pull-requests.md)
- [Resolution routes](../remediation/routes.md)
