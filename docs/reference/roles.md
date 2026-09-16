# Roles and capabilities

Five built-in roles, plus custom roles you compose yourself. A grant pairs a role with the
scope it applies to.

## Built-in roles

| Role | Can do | Cannot do |
|---|---|---|
| Super-admin | Everything, plus read the audit log and change organisation settings | — |
| Tenant-admin | Full operational control of incidents, remediation, clusters and users | Read the audit log; change organisation settings |
| Resolver | Investigate, approve, apply fixes, resolve incidents | Manage users, clusters or settings |
| PR approver | Approve fixes that go through a repository | Apply a change to a live cluster |
| Viewer | Read incidents, analyses and clusters | Change anything |

Each role's exact capability list is shown under **Settings → Roles & access**, read live
from the hub's own authorisation catalogue rather than maintained separately.

## Capability areas

Capabilities are grouped by what they are about.

| Area | Covers |
|---|---|
| Incidents and analysis | Viewing incidents, triggering investigations, silencing, resolving and dismissing |
| Remediation | Approving, rejecting, applying in place, opening pull requests, rolling back |
| Policies | Viewing and changing remediation policy, and dry-running it against past incidents |
| Clusters | Viewing, onboarding, accepting and configuring clusters |
| Users | Viewing accounts and managing grants |
| Organisation | Reading the audit log, and changing organisation-wide settings |

## The separation worth knowing

**Approving a fix** and **applying a change to a live cluster** are distinct capabilities.
So are **applying in place** and **opening a pull request**.

That makes "may approve repository fixes, may never touch a live cluster" expressible —
which is what the PR approver role is. If you need a different split, compose a custom role.

## Scope

| Scope | The role applies to |
|---|---|
| A single cluster | That cluster |
| A cluster group | Every cluster in the group, following its membership |
| All clusters | The whole fleet |

An account can hold several grants at once, at different scopes.

## Custom roles

A custom role is your own bundle of capabilities from the same catalogue the built-in roles
draw on. Built-in bundles are fixed; custom ones are not.

## See also

- [Users and roles](../administration/users-and-roles.md)
- [Approving a fix](../remediation/approvals.md)
- [Audit log](../administration/audit-log.md)
