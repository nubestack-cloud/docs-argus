# Detectors and rules

Three detectors run in every connected cluster. Each can be disabled under
**Settings → Detectors**, as can each sweep rule individually.

| Detector | Watches |
|---|---|
| Warning Kubernetes events | Every Warning-type event, cluster-wide |
| Pod status conditions | `CrashLoopBackOff`, `ImagePullBackOff`, `ErrImagePull`, `OOMKilled`, pods stuck `Pending` |
| Sweep detector | Sustained conditions, evaluated periodically |

Warning events from a policy engine's audit of objects already in the cluster (Kyverno's
background scan, Gatekeeper's audit) are recorded as risks and never open an incident:
nothing has failed, and the same results appear on the object panel's **Policy** tab.
A policy that blocks a change at admission still surfaces through the workload's own
failure, such as `FailedCreate`.

The sweep detector also covers built-in checks that are not individually listed: replica
shortfalls, volume claims that never bind, failed jobs, nodes that are not ready or under
pressure, blocked autoscalers, and services with no ready endpoints.

## Sweep rules

Each rule below can be disabled on its own. Disabling the sweep detector disables all of
them.

A rule is either a **fault** — something is broken now — or a **risk** — a setting that will
cause trouble later. Only a fault with observed degradation or unavailability opens an
incident. A risk is recorded as a signal: visible under **Incidents → Signals** and on the
cluster's pages, but not in the incident queue.

### Workloads

| Rule | Fires when | Opens an incident |
|---|---|---|
| `deployment-rollout-stalled` | A rollout stops making progress | Yes |
| `deployment-paused` | A deployment is left paused | No — risk |
| `deployment-observedgeneration-behind` | The controller has not observed the current spec | Yes |
| `deployment-scaled-to-zero` | A deployment is at zero replicas | No — risk |
| `deployment-revision-history-limit-zero` | No revision history is kept, so rollback is impossible | No — risk |
| `daemonset-rollout-stalled` | A daemonset rollout stops progressing | Yes |
| `statefulset-rollout-stalled` | A statefulset rollout stops progressing | Yes |
| `statefulset-partition-blocks-rollout` | A partition setting prevents the rollout completing | No — risk |
| `hpa-pegged-at-max-replicas` | An autoscaler sits at its ceiling | No — risk |
| `deployment-all-replicas-single-node` | Every replica of a deployment is scheduled on one node | No — risk |
| `statefulset-missing-pvc-retention-policy` | A statefulset sets no volume-claim retention policy, so scaling down leaves claims behind | No — risk |
| `job-missing-active-deadline-seconds` | A job has no deadline, so a hung pod is never timed out | No — risk |

### Pods and nodes

| Rule | Fires when | Opens an incident |
|---|---|---|
| `pod-stuck-terminating` | A pod does not finish terminating | Yes |
| `pod-evicted-not-cleaned-up` | An evicted pod is left behind | No — risk |
| `node-cordoned-sustained` | A node stays cordoned beyond a threshold | No — risk |

### Storage

| Rule | Fires when | Opens an incident |
|---|---|---|
| `persistentvolume-failed` | A volume enters a failed phase | Yes |
| `persistentvolume-released-stuck` | A released volume is never reclaimed | No — risk |
| `persistentvolume-stuck-terminating` | A volume does not finish terminating | Yes |
| `persistentvolumeclaim-stuck-terminating` | A claim does not finish terminating | Yes |

### Policy and quota

| Rule | Fires when | Opens an incident |
|---|---|---|
| `pdb-selector-matches-no-pods` | A disruption budget protects nothing | No — risk |
| `pdb-blocks-all-disruptions` | A disruption budget prevents any eviction | No — risk |
| `networkpolicy-selects-no-pods` | A network policy applies to nothing | No — risk |
| `resourcequota-at-hard-limit` | A quota is at its hard limit | No — risk |
| `namespace-stuck-terminating` | A namespace does not finish terminating | Yes |
| `certificate-expiry-imminent` | A certificate approaches expiry | Yes |

### GitOps

| Rule | Fires when | Opens an incident |
|---|---|---|
| `argo-application-health-degraded` | An application reports degraded health | Yes |
| `argo-application-out-of-sync` | An application is out of sync | Yes |
| `flux-kustomization-reconciliation-stalled` | Reconciliation stops progressing | Yes |
| `flux-helmrelease-reconciliation-stalled` | A release stops reconciling | Yes |
| `flux-gitrepository-reconciliation-stalled` | A source stops reconciling | Yes |
| `flux-kustomization-suspended` | Reconciliation is suspended | No — risk |
| `flux-helmrelease-suspended` | A release is suspended | No — risk |
| `flux-gitrepository-suspended` | A source is suspended | No — risk |
| `argo-application-sync-unknown` | Argo CD cannot work out the desired state from Git at all | Yes |

### Backup

| Rule | Fires when | Opens an incident |
|---|---|---|
| `velero-backup-failed` | A backup fails | Yes |
| `velero-backup-partially-failed` | A backup partially fails | Yes |
| `velero-restore-failed` | A restore fails | Yes |
| `velero-restore-partially-failed` | A restore partially fails | Yes |

### Schedules

| Check | Fires when | Opens an incident |
|---|---|---|
| `ScheduleNotRunning` | A CronJob, Velero schedule or CloudNativePG scheduled backup has missed two runs of its own schedule, plus 15 minutes, since it last succeeded (or since it was created). Suspended and paused schedules are skipped | Yes |

### Batch and AI workloads

Read only on clusters that have the resource installed and grant the agent read access to
it. Each says which part failed, in the controller's own terms.

| Check | Fires when | Opens an incident |
|---|---|---|
| `JobSetFailed` | A JobSet failed, naming the replicated job and reason | Yes |
| `RayJobFailed` | A RayJob failed, with its job and deployment status | Yes |
| `RayServiceNotReady` | A RayService is not ready | Yes |
| `RayClusterFailed` | A RayCluster is in the failed state | Yes |
| `InferenceServiceNotReady` | A KServe InferenceService is not ready, naming the part (predictor, transformer, explainer or ingress) | Yes |
| `ScaledObjectNotReady` | A KEDA ScaledObject cannot scale | Yes |
| `ScaledObjectFallback` | A KEDA ScaledObject is running its fallback replica count because its scaler is failing | Yes |
| `KueueWorkloadEvicted` | A Kueue Workload was evicted because its pods did not become ready in time | Yes |

## Volume controls

| Control | Where |
|---|---|
| Disable a detector or rule | **Settings → Detectors** |
| Storm protection | **Settings → Detectors** |
| Preview a setting against real history | **Settings → Detectors** |
| Silence one condition on one object | An incident's **Tolerate** action |
| Resend cooldown, five minutes by default | Set on the agent at deployment |

## See also

- [What ARGUS detects](../incidents/detection.md)
- [Detector settings](../administration/detectors.md)
- [Tolerations](../incidents/tolerations.md)
