# Security model

This page is for the reviewer who has to sign ARGUS off. It covers the trust boundaries,
what leaves a watched cluster, what each component can reach, and what an attacker would
get from compromising each one.

## Trust boundaries

| Boundary | Crossed by | Control |
|---|---|---|
| Browser to hub | Operator sessions | Password or single sign-on, short-lived access tokens, capability checks per request |
| Agent to hub | Findings, tool results, execution outcomes | Mutual TLS; the agent holds a per-cluster client certificate issued at enrolment |
| Hub to AI provider | Incident context, tool results | Your provider, your credentials; redaction applied before data reaches the hub |
| Hub to repository | Branch and pull-request writes | A token you supply, scoped to the repositories you register |
| Agent to Kubernetes API | Reads always, writes only if enabled | The agent's own role, plus an admission policy restricting which fields may change |

## What leaves your cluster

Redaction happens **inside the agent, at the point data is captured**, before it crosses
the tunnel. This matters more than what the rules are: a filter applied later would mean
the data had already left the cluster.

Two layers run, in this order:

**Whole field classes are dropped structurally**, regardless of what the values look like
or how deeply they are nested:

- every literal environment variable value in a container specification
- every value under `data` and `stringData` on any object
- the `kubectl.kubernetes.io/last-applied-configuration` annotation

**A bounded pattern layer** then runs over freeform text — log lines, event and condition
messages, container arguments — where there is no structure to drop. It matches formats
that are credentials essentially by construction: private key blocks, bearer tokens,
and `key=value` pairs whose key ends in a credential-like word.

Every removal is replaced with `[REDACTED]`. The key is kept rather than deleted, because
"this container sets a password literally rather than through a secret reference" is
diagnostic evidence in itself.

!!! note "Secrets are not readable at all"
    Separately from redaction, `Secret` objects are outside the set of kinds the agent's
    tools can fetch, and the agent's cluster role does not grant access to them. An
    investigation cannot read a Secret's contents even indirectly.

The accepted cost is stated plainly: ARGUS is worse at diagnosing faults whose cause is a
wrong value in an environment variable. There is no setting that turns redaction off.

## What the agent can do in a cluster

Agents install read-only. Detection and investigation need nothing more.

Remediation is enabled per cluster, at install time, and scoped to an explicit list of
namespaces. Beyond that scope the agent cannot write at all. Within it:

- only a fixed set of typed actions can be requested, each with a known shape
- each action is signed by the hub and bound to the object version it was built from
- each action is rehearsed with a Kubernetes server-side dry-run before it is applied, and
  refused if the API server rejects the rehearsal
- an admission policy restricts which fields may be changed, independently of the agent

There is no mechanism for the agent to run a shell command, apply arbitrary YAML, or act on
an object outside its namespace scope.

## If a component is compromised

**The hub.** An attacker reaches the incident history, the encrypted credential store, and
the ability to request actions from agents. They do not gain cluster credentials, because
the hub holds none, and they cannot exceed each agent's namespace scope or the admission
policy. Requested actions are still rehearsed and still recorded in the audit trail.

**An agent.** An attacker reaches read access to that one cluster, plus write access within
its configured namespaces. They do not reach other clusters: each agent has its own
certificate and its own identity, and the hub scopes every request to the cluster it came
from.

**The AI provider.** The model sees incident context and tool results with redaction already
applied. It never receives cluster credentials, and it cannot invoke an action directly —
it proposes, and a typed, signed, rehearsed path executes.

## Audit trail

Every consequential action is recorded: sign-ins, approvals and rejections with their
reasons, executions and their outcomes, settings changes, cluster enrolment and acceptance,
and user and role changes. The records are hash-chained, so a deleted or altered entry is
detectable, and the chain can be verified independently of the running hub.

Reading the audit log and changing organisation-wide settings are the two things only a
super-admin can do.

## See also

- [Architecture](architecture.md)
- [Guardrails](../automation/guardrails.md)
- [Users and roles](../administration/users-and-roles.md)
