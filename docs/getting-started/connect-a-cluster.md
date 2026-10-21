# Connect a cluster

The cluster the hub runs in is already connected: it appears on **Clusters** as `local` a
minute after the hub is installed. This page connects your other clusters. The hub never needs
their kubeconfigs — each agent dials out to the hub.

Every cluster runs one agent, installed from the agent chart. Choose how to enrol it:

| You are connecting | Use |
|---|---|
| One cluster | A single-use token from **Enroll a cluster** |
| Many clusters, or clusters managed by GitOps | One **fleet token** shared by all of them |

## One cluster

### 1. Create an enrolment token

On **Clusters**, select **Enroll a cluster**. The token is single-use and short-lived: it
authorises exactly one agent install.

![The Enroll a cluster dialog: a token lifetime, "Standard — expires in 1 hour, one cluster",
and a Generate token button](../assets/images/49-enroll-dialog.png){ width="480" }

*Choose how long the token stays valid, then **Generate token**. Every lifetime produces the
same install command.*

### 2. Install the agent

The **Enroll a cluster** dialog shows the exact commands, with the hub's address, the release
and the token already filled in, ready to copy. Run them against the cluster you want watched:

![The generated commands: create the argus-system namespace, put the token in a Secret, and helm
install the agent chart at version 0.2.0 with the hub's address](../assets/images/50-enroll-command.png){ width="480" }

*The commands as the dialog shows them; the token is shortened here. **Copy** takes the whole
block.*

They have this shape:

```bash
kubectl create namespace argus-system --dry-run=client -o yaml | kubectl apply -f -
kubectl create secret generic argus-enrollment-token -n argus-system \
  --from-literal=token=<token> --dry-run=client -o yaml | kubectl apply -f -
helm install argus-agent oci://registry-1.docker.io/nubestack/argus-agent-chart \
  --version <version> \
  --namespace argus-system \
  --set namespace.create=false \
  --set hub.apiUrl=<hub-address> \
  --set enrollment.tokenSecretRef.name=argus-enrollment-token
```

Add `--set displayName=<name>` to choose how the cluster is labelled in ARGUS.

!!! warning "Moving a cluster to a new hub"
    If the cluster already runs an agent for another hub, remove it first:
    `helm -n argus-system uninstall argus-agent`, then
    `kubectl -n argus-system delete secret argus-agent-identity --ignore-not-found`. Otherwise the
    install stops with "cannot reuse a name that is still in use", and the old agent keeps an
    identity the new hub cannot verify.

The token goes into a Secret rather than onto the `helm` command line, so it is never stored
in the Helm release's values, where anyone who can read the release could see it. The agent
presents the token on first contact and receives its own client certificate in return; the
token is then spent.

The hub's address must be reachable from inside the cluster — not `localhost`. Check it from a
pod there:

```bash
kubectl run argus-probe --rm -i --restart=Never --image=busybox:1.36 -- \
  wget -qO- -T 5 <hub-address>/healthz
```

### 3. Accept the cluster

A newly enrolled cluster appears as pending. Accepting it is what allows its tunnel to
carry data. Until then the agent is connected but ignored, which gives you a deliberate
moment to confirm the cluster is the one you meant.

### 4. Confirm the heartbeat

The cluster becomes **Active** once its tunnel is up and it is reporting. The **Clusters**
page shows state, agent version, open incident count and last heartbeat.

![The clusters page listing clusters with state, agent version, compatibility, open
incidents and last heartbeat](../assets/images/02-clusters.png)

*Clusters list. Tabs pick out clusters needing attention, pending approval or not
reporting.*

Findings normally start arriving within a minute or two. A healthy cluster with nothing
wrong produces no incidents, which is the correct outcome rather than a sign of a problem.

## Many clusters: a fleet token

A fleet token is one token that many clusters can enrol with, so the same agent configuration
can be rolled out everywhere by your GitOps tool.

1. On **Clusters**, select **Fleet tokens**, then **Issue fleet token**. Choose how long it is
   valid (up to a year) and how many clusters may use it. Tick **Accept automatically** to skip
   accepting each cluster by hand; the clusters are then accepted on your behalf, and the audit
   log says so. This needs permission to accept clusters.
2. Put the token in every cluster as the Secret `argus-system/argus-enrollment-token`, key
   `token`, with your secret manager — External Secrets, Sealed Secrets, Vault. Never commit it
   in plain text.
3. Deploy the agent chart to every cluster with the same values as above, minus the token. The
   [ARGUS repository](https://github.com/nubestack-cloud/argus/tree/main/deploy/examples) has ready-made examples: an Argo CD ApplicationSet that
   installs the agent on every cluster Argo CD manages, named after the cluster, and a Flux
   `HelmRelease`.

The token is shown once. Its row under **Fleet tokens** shows how many clusters have used it;
revoking it stops further enrolments, and clusters already enrolled stay connected. The token
the hub created for its own cluster is listed there too, already used.

## Upgrading an agent

See [Upgrade and roll back](upgrade.md#upgrade-the-other-clusters). An upgrade keeps the
cluster's enrolment.

## Whether the agent may change anything

**Agents install read-only.** Detection and investigation need nothing more, and a cluster
connected today cannot be modified by ARGUS at all until you decide otherwise.

!!! warning "This is an install-time decision, not a setting in the product"
    There is no switch in **Settings** that grants or removes an agent's write access, and
    there is deliberately no way for the hub to grant itself one. Write access is Kubernetes
    RBAC in the target cluster, so it changes only by upgrading the agent there.

### Granting write access

Enabling remediation means choosing a scope. There are exactly two, and you must pick one.

**Named namespaces — preferred:**

```bash
helm --kube-context <cluster-context> upgrade argus-agent \
  oci://registry-1.docker.io/nubestack/argus-agent-chart --version <version> \
  --namespace argus-system --reset-then-reuse-values \
  --set remediate.enabled=true \
  --set 'remediate.namespaces={payments,checkout}'
```

**Node actions.** Cordon and drain need a second switch, `remediate.nodeOps.enabled=true`,
on top of either scope. It grants patching nodes and creating evictions cluster-wide, with an
admission policy that lets the remediation identity change only `spec.unschedulable` on a
Node. See [Remediation actions](../reference/remediation-actions.md#node-actions).

**The whole cluster:**

```bash
helm --kube-context <cluster-context> upgrade argus-agent \
  oci://registry-1.docker.io/nubestack/argus-agent-chart --version <version> \
  --namespace argus-system --reset-then-reuse-values \
  --set remediate.enabled=true \
  --set remediate.allNamespaces=true
```

| Setting | Effect |
|---|---|
| `remediate.enabled=false` (the default) | No write permission exists. The agent cannot change anything |
| `remediate.namespaces={a,b}` | Write permission in those namespaces only, granted one namespace at a time |
| `remediate.allNamespaces=true` | Write permission across every namespace, including `kube-system` |

!!! warning "The chart refuses to guess, and will stop the install"
    Setting `remediate.enabled=true` **without** either scope fails the install rather than
    granting nothing — an empty grant would surface later as a confusing permission error at
    execution time. Setting **both** scopes also fails: a namespace list beside a
    cluster-wide grant reads as a restriction while granting everything.

Prefer named namespaces. Cluster-wide scope includes `kube-system` and every other
namespace you did not think about, so treat it as a deliberate decision rather than the
convenient option.

**The hub's own cluster** has its agent installed by the hub chart, so set the same options on
the hub instead, with a `localAgent.` prefix:

```bash
helm upgrade argus-hub oci://registry-1.docker.io/nubestack/argus-hub-chart --version <version> \
  -n argus-system --reset-then-reuse-values \
  --set localAgent.remediate.enabled=true \
  --set 'localAgent.remediate.namespaces={payments,checkout}'
```

### What enabling it actually creates

Turning it on provisions a **second, separate identity** in the target cluster, distinct
from the one used for reading, together with admission policies that restrict even that
identity to the specific object fields ARGUS's actions are allowed to touch.

Two consequences worth knowing:

- While it is off, an attempt to write is refused by the Kubernetes API server, not by
  ARGUS. The restriction holds even if the hub is compromised.
- Naming namespaces and granting cluster-wide scope are mutually exclusive by construction,
  so a namespace list can never be decorative while something broader is also granted.

### Removing write access

```bash
helm --kube-context <cluster-context> upgrade argus-agent \
  oci://registry-1.docker.io/nubestack/argus-agent-chart --version <version> \
  --namespace argus-system --reset-then-reuse-values --set remediate.enabled=false
```

The identity and its permissions are removed. The agent keeps detecting and investigating.

!!! note "There is no in-product way to make one cluster read-only again"
    Freeze windows, blast-radius caps and the circuit breaker all bound what happens
    **without a human** — none of them stands between an operator and a fix they have
    decided to approve. Taking a cluster out of play entirely means the upgrade above. See
    [Guardrails](../automation/guardrails.md).

### Confirming what an agent may do

The cluster's own page reports the write access the agent has **discovered** by asking its
API server — not what was configured, which is what you want when checking whether an
approval can actually be carried out. See [Clusters](../administration/clusters.md).

## Connecting Prometheus

If the cluster runs Prometheus, the agent connects to it by itself when it is installed or
upgraded: Rancher monitoring, kube-prometheus-stack, a plain Prometheus server, a Thanos query
or a VictoriaMetrics single node. The install notes name the one it found. A Prometheus
started after the agent is picked up at the agent's next `helm upgrade`.

To choose a different one, or when there is more than one:

```bash
helm --kube-context <cluster-context> upgrade argus-agent \
  oci://registry-1.docker.io/nubestack/argus-agent-chart --version <version> \
  --namespace argus-system --reset-then-reuse-values \
  --set metrics.prometheusService.namespace=monitoring \
  --set metrics.prometheusService.name=prometheus-operated \
  --set metrics.prometheusService.port=9090
```

For the hub's own cluster (`local`), upgrade the hub instead, with a `localAgent.` prefix. The
cluster's **Traffic** and **Cost** tabs show the Prometheus they found and these values ready to
copy:

```bash
helm upgrade argus-hub oci://registry-1.docker.io/nubestack/argus-hub-chart --version <version> \
  --namespace argus-system --reset-then-reuse-values \
  --set localAgent.metrics.prometheusService.namespace=cattle-monitoring-system \
  --set localAgent.metrics.prometheusService.name=rancher-monitoring-prometheus
```

To turn metrics off, set `metrics.autoDetect=false`. The agent reaches Prometheus through the
Kubernetes API server, and is granted read access
to that one Service and nothing else. With it connected:

| Gains | Where |
|---|---|
| CPU, memory, restarts and throttling for a workload | The object panel's **Metrics** tab, and an incident's **Resource usage** tab |
| Who talks to whom, from Istio or Beyla metrics | The cluster's **Traffic** tab |
| Spend per namespace, from OpenCost metrics | The cluster's **Cost** tab |
| Metric queries during an investigation | Investigation, for that cluster |

The **Traffic** and **Cost** tabs say whether the agent may reach the Service.

## See also

- [Clusters](../administration/clusters.md)
- [Your first incident](first-incident.md)
- [Cluster states](../reference/cluster-states.md)
