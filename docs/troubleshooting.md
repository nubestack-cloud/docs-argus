# Troubleshooting

Symptoms, in the form you would search for them.

## I cannot sign in

Check the bootstrap password is the one from your installation — for a Helm deployment it is
generated and stored as a secret in the hub's namespace, not the value in any example.

If the account exists but is refused, check whether it is disabled on the **Users** page.

## A cluster stays pending

Pending means the agent connected and has not been accepted. Accept it on the **Clusters**
page. This is a deliberate step, not a fault.

## A cluster never appears at all

The agent has not reached the hub. In order of likelihood:

1. The hub API address given at install is not reachable from inside the cluster. A remote
   cluster cannot reach `localhost`.
2. The enrolment token was already used or has expired. Tokens are single-use and
   short-lived — issue a new one.
3. The agent pod is not running. Check its status in its own namespace.

## A cluster goes disconnected after working

If the hub's tunnel address or certificate names changed, agents that enrolled against the
old address can no longer verify the hub and will reconnect unsuccessfully. Restore the
address, or re-enrol.

If the agent pod restarted without persistence enabled, it has lost its certificate and
needs enrolling again. Enable persistence to prevent this.

## No incidents appear

A healthy cluster produces no incidents, and that is the correct outcome. Before assuming a
fault:

- Confirm the cluster is **Active** and heartbeating.
- Check the cluster detail page for the resource kinds the agent discovered and may read.
- Check whether detectors or rules are disabled under **Settings → Detectors**.
- Check whether storm protection has been reached for that cluster.
- Check the **Tolerations** page for a rule silencing what you expected to see.

## Analysis fails immediately

No AI provider is active, or the active one is not reachable. Go to
**Settings → AI providers** and use **Test connection** — it names the reason.

## Analysis reaches no conclusion

The investigation hit its bounds. Raise the iteration and time limits under
**Settings → Investigation**, or use a more capable model. A small model with weak
tool-calling will stop early on faults a larger one resolves.

Check the cluster detail page too: an investigation can only see resource kinds the agent
is permitted to read.

## Remediation is unavailable on an incident

The agent for that cluster is read-only, or the object is outside the namespaces the agent
may write in. Both are shown on the cluster's page. There is no setting in the product that
changes this — it is granted when the agent is installed or upgraded, to named namespaces or
to the whole cluster. See
[Whether the agent may change anything](getting-started/connect-a-cluster.md).

## A dry-run fails

The Kubernetes API server rejected the rehearsal, and its message is shown on the incident.
Nothing was applied. Common causes are an invalid value, an admission policy, or a quota.

## A pull request is not offered

One of:

- The repository is not registered under **Settings → Git repositories**.
- ARGUS cannot resolve which repository owns the object. For a Helm release, confirm the
  link the incident offers.
- The source file contains template expressions, which are not edited mechanically.
- The controller reports a branch rather than a resolved commit, so the running commit is
  not known.

## An incident sits in awaiting merge

ARGUS is waiting for the pull request to merge and for your GitOps controller to report it
has synced past the merge commit. If the pull request was closed without merging, close the
incident or re-analyse.

## Nothing runs unattended

Expected, unless you turned it on. Check, in order: unattended execution is enabled, the
plan is within the auto-approval ceiling, a blast-radius cap has not been reached, no freeze
window is open, and the circuit breaker has not tripped. Each of those records its reason on
the incident.

## Costs are showing as zero

No price table is configured. Set all three prices under **Settings → Model pricing**. A
subscription-billed provider records cost on a notional basis and will not produce real
figures.

## See also

- [Cluster states](reference/cluster-states.md)
- [Network requirements](reference/network-requirements.md)
- [Detector settings](administration/detectors.md)
