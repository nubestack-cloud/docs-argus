# Glossary

Terms this documentation uses precisely. Where two terms are easy to confuse, the
distinction is stated.

| Term | Meaning |
|---|---|
| Agent | The component running in a watched cluster. One per cluster |
| Analysis | The output of an investigation: root cause, confidence, causal chain |
| Approval | A person's recorded decision permitting a plan to execute |
| Blast-radius cap | A ceiling on how many unattended changes may happen in a rolling window |
| Causal chain | The ordered record of tool calls an investigation made, and what each returned |
| Circuit breaker | A stop on unattended execution triggered by changes not working |
| Cluster group | A named set of clusters a grant can be scoped to |
| Confidence | The model's own signal about its root-cause statement. Not a measurement |
| Dry-run rehearsal | A server-side Kubernetes validation of a change, before it is applied |
| Finding | One raw symptom observed in a cluster. Evidence, not an incident |
| Fingerprint | The identity of a condition on an object, used to group findings |
| Grant | A role plus the scope it applies to |
| Hub | The component you run once: web interface, API, incident state machine, audit trail |
| Incident | One problem on one object, built from the findings reporting it |
| In-place route | A fix applied to the live object in the cluster |
| Investigation | An AI model working through the cluster with read-only tools |
| Plan | A proposed, typed action with a target, parameters and a risk level |
| Pull-request route | A fix applied to the repository the object's desired state comes from |
| Remediation | Executing an approved plan |
| Resolution route | Where ARGUS decided a fix belongs, chosen before the model proposes |
| Rule | One individually controllable check inside the sweep detector |
| Toleration | A rule stopping one accepted condition on one object from opening incidents |
| Unattended execution | Executing an auto-approved plan with no person in the loop |
| Validation | Checking a change held before resolving the incident |

## Distinctions worth keeping

| These are not the same | Difference |
|---|---|
| Finding and incident | A finding is one symptom. An incident is the problem those symptoms describe |
| Rejecting a plan and dismissing an incident | Rejecting refuses one fix and leaves the incident open. Dismissing closes it |
| Resolved and self-healed | Resolved is the state. Self-healed says no ARGUS action is linked to the close |
| Dismissed and expired | Dismissed is a person's decision. Expired is a bulk close, and it can reopen |
| Failed and outcome unknown | Failed means the change ran and did not work. Unknown means ARGUS cannot tell |
| Disabling a rule and adding a toleration | A rule is fleet-wide. A toleration is one condition on one object |
| Automatic investigation and unattended execution | The first analyses without a click. The second changes a cluster without approval |

## See also

- [The incident lifecycle](../incidents/lifecycle.md)
- [Resolution routes](../remediation/routes.md)
- [Incident states](incident-states.md)
