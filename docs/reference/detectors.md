# Detectors and rules

Three detectors run in every connected cluster. Each can be disabled under
**Settings → Detectors**, as can each sweep rule individually.

| Detector | Watches |
|---|---|
| Warning Kubernetes events | Every Warning-type event, cluster-wide |
| Pod status conditions | `CrashLoopBackOff`, `ImagePullBackOff`, `ErrImagePull`, `OOMKilled`, pods stuck `Pending` |
| Sweep detector | Sustained conditions, evaluated periodically |

The sweep detector also covers built-in checks that are not individually listed: replica
shortfalls, volume claims that never bind, failed jobs, nodes that are not ready or under
pressure, blocked autoscalers, and services with no ready endpoints.

## Sweep rules

Each rule below can be disabled on its own. Disabling the sweep detector disables all of
them.

### Workloads

| Rule | Fires when |
|---|---|
| `deployment-rollout-stalled` | A rollout stops making progress |
| `deployment-paused` | A deployment is left paused |
| `deployment-observedgeneration-behind` | The controller has not observed the current spec |
| `deployment-scaled-to-zero` | A deployment is at zero replicas |
| `deployment-revision-history-limit-zero` | No revision history is kept, so rollback is impossible |
| `daemonset-rollout-stalled` | A daemonset rollout stops progressing |
| `statefulset-rollout-stalled` | A statefulset rollout stops progressing |
| `statefulset-partition-blocks-rollout` | A partition setting prevents the rollout completing |
| `hpa-pegged-at-max-replicas` | An autoscaler sits at its ceiling |

### Pods and nodes

| Rule | Fires when |
|---|---|
| `pod-stuck-terminating` | A pod does not finish terminating |
| `pod-evicted-not-cleaned-up` | An evicted pod is left behind |
| `node-cordoned-sustained` | A node stays cordoned beyond a threshold |

### Storage

| Rule | Fires when |
|---|---|
| `persistentvolume-failed` | A volume enters a failed phase |
| `persistentvolume-released-stuck` | A released volume is never reclaimed |
| `persistentvolume-stuck-terminating` | A volume does not finish terminating |
| `persistentvolumeclaim-stuck-terminating` | A claim does not finish terminating |

### Policy and quota

| Rule | Fires when |
|---|---|
| `pdb-selector-matches-no-pods` | A disruption budget protects nothing |
| `pdb-blocks-all-disruptions` | A disruption budget prevents any eviction |
| `networkpolicy-selects-no-pods` | A network policy applies to nothing |
| `resourcequota-at-hard-limit` | A quota is at its hard limit |
| `namespace-stuck-terminating` | A namespace does not finish terminating |
| `certificate-expiry-imminent` | A certificate approaches expiry |

### GitOps

| Rule | Fires when |
|---|---|
| `argo-application-health-degraded` | An application reports degraded health |
| `argo-application-out-of-sync` | An application is out of sync |
| `flux-kustomization-reconciliation-stalled` | Reconciliation stops progressing |
| `flux-helmrelease-reconciliation-stalled` | A release stops reconciling |
| `flux-gitrepository-reconciliation-stalled` | A source stops reconciling |
| `flux-kustomization-suspended` | Reconciliation is suspended |
| `flux-helmrelease-suspended` | A release is suspended |
| `flux-gitrepository-suspended` | A source is suspended |

### Backup

| Rule | Fires when |
|---|---|
| `velero-backup-failed` | A backup fails |
| `velero-backup-partially-failed` | A backup partially fails |
| `velero-restore-failed` | A restore fails |
| `velero-restore-partially-failed` | A restore partially fails |

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
