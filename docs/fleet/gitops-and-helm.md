# GitOps and Helm

Two tabs on the cluster page show what your delivery tooling reports: **GitOps** for Argo CD
and Flux, and **Helm** for releases. Both are read-only views of what the controllers and
releases say about themselves.

## GitOps

![The GitOps tab: sync and health bars across applications, a problem grouped by cause with
what to do next, and the applications table](../assets/images/26-cluster-gitops.png)

*Problems are grouped by cause, each with what to check next, above the full list.*

The tab lists every Argo CD application and Flux object in the cluster, with two bars across
them: sync — synced, out of sync, unknown — and health — healthy, degraded, progressing. It
says which controllers are installed.

Problems are grouped by their reason, so six applications failing the same way are one
entry. Each states the cause in plain words, what to check next, and the controller's own
message, then lists the applications it affects.

The table gives each application's source, sync and health, its destination, and when it
last synced.

For an object an application manages, the object panel's GitOps tab shows two things side by
side: Argo CD's own verdict on that object (synced or out of sync, from the application's
status), and the fields that differ from its last-applied configuration. They can disagree —
Argo CD ignores fields it has been told to — so neither overrides the other. An object
applied server-side or by Helm has no last-applied configuration, so only the verdict shows.

On an incident about a GitOps-owned object, **Request Argo refresh** or
**Request Flux reconcile** asks the controller to look again. That is a request to the
controller, not a change to your workloads, and it needs the remediation agent and the
**Apply a remediation directly to a live cluster** capability.

## Helm

![The Helm tab: releases with their status, revision, last update, objects by health and open
incidents](../assets/images/27-cluster-helm.png)

*Each release with its status, and its objects' health drawn as a bar.*

| Column | Shows |
|---|---|
| Release | The release name and namespace |
| Status | Deployed, failed or pending, from the release's own record |
| Rev and updated | The revision and when it was last changed |
| Objects by health | The release's objects as a bar: healthy, degraded, idle, nothing to grade |
| Open incidents | Incidents on the release's objects, with the worst severity |

Expand a release for the objects behind a degraded bar. Filters pick out releases with an
open incident, releases not deployed, releases changed in the last seven days, and one
namespace.

ARGUS reads which objects belong to a release from their Helm labels, and the release status
from its record. It never reads release values, manifests or notes, because those can hold
credentials. A release stored somewhere it cannot read shows **Status not read**.

## See also

- [Pull requests](../remediation/pull-requests.md)
- [Resolution routes](../remediation/routes.md)
- [Git repositories](../administration/repositories.md)
