# Upgrade and roll back

An upgrade moves the hub and every agent to a new release. Upgrade the hub first, then the
agents of your other clusters: a hub works with agents of the previous release, so the fleet
keeps running while you move them one at a time.

Read the release notes for every release between yours and the new one first. Anything that
needs your attention is listed there.

## Upgrade the hub

```bash
helm upgrade argus-hub oci://registry-1.docker.io/nubestack/argus-hub-chart --version <new> \
  -n argus-system --reset-then-reuse-values
kubectl -n argus-system rollout status deploy/argus-hub --timeout=10m
```

What happens:

1. The database is **dumped first**, onto its own volume, and the upgrade waits for it. This is
   your way back if the upgrade goes wrong.
2. The hub restarts once, for about 20 seconds. Before the new hub serves anything, its database
   is migrated to the new release.
3. Agents reconnect by themselves. The hub's own cluster's agent is upgraded with the hub.

!!! warning "`--reset-then-reuse-values`, never `--reuse-values`"
    `--reuse-values` also keeps the old chart's image versions, so the upgrade changes nothing.
    If you keep your settings in a values file, pass it with `-f` instead.

## Upgrade the other clusters

For each cluster, in any order:

```bash
helm --kube-context <cluster-context> upgrade argus-agent \
  oci://registry-1.docker.io/nubestack/argus-agent-chart --version <new> \
  -n argus-system --reset-then-reuse-values
```

Or select **Upgrade agent** on the cluster's **Agent** tab, if its agent was installed with
`selfUpgrade.enabled=true`.

An upgrade keeps the cluster's enrolment: the agent's identity is kept in its own cluster, in a
Secret the upgrade does not touch.

!!! danger "Never `helm upgrade --force` an agent"
    It replaces objects instead of updating them, which deletes the agent's identity, and the
    cluster has to enrol again.

## Check the result

- Every cluster is **Active** on **Clusters**, with a fresh heartbeat.
- Each cluster's **Agent** tab shows the new version, with no detector reporting a problem.
- **Settings → AI providers → Test connection** still succeeds.

## Rolling back

**An agent:** `helm --kube-context <cluster-context> rollback argus-agent -n argus-system`. Its
enrolment survives.

**The hub** goes back only together with its database: migrations only move forward, and the
previous hub refuses a database the new one has migrated. Restore the dump the upgrade took, then
roll the release back:

```bash
P="kubectl -n argus-system exec argus-hub-postgres-0 --"
$P ls -l /var/lib/postgresql/data/backups          # the newest argus-*.dump is the upgrade's
DUMP=/var/lib/postgresql/data/backups/argus-YYYYMMDDTHHMMSSZ.dump

kubectl -n argus-system scale deploy/argus-hub --replicas=0
$P psql -U postgres -d postgres -c "ALTER DATABASE argus RENAME TO argus_before_rollback"
$P createdb -U postgres argus
$P pg_restore -U postgres -d argus --exit-on-error "$DUMP"
helm -n argus-system rollback argus-hub
```

Anything recorded after the upgrade — incidents, approvals, audit entries — is lost with it. Once
the hub is back and working, drop the database you set aside:
`$P dropdb -U postgres argus_before_rollback`.

Check the restored hub found its keys: `kubectl -n argus-system logs deploy/argus-hub -c hub | grep -c "loaded the persisted"`
prints `5`. If its log says `generated and persisted a new` instead, the keys did not come back:
stop, and restore again before agents try to reconnect.

The two most recent pre-upgrade dumps are kept. With an [external
database](install.md#an-external-database), restore from your database's own backup instead.

## Changing settings without upgrading

Run the same `helm upgrade` without a new `--version`, with the options you want to change.
Two kinds of change behave differently from the rest:

- **Write access for an agent** is Kubernetes RBAC in that cluster. It changes when that
  cluster's agent is upgraded, not from the hub. See
  [Connect a cluster](connect-a-cluster.md#whether-the-agent-may-change-anything).
- **A dedicated tunnel address** (`tunnel.publicEndpoint`) is written into the tunnel
  certificate. See [Network requirements](../reference/network-requirements.md).

## See also

- [Install the hub](install.md)
- [Connect a cluster](connect-a-cluster.md)
- [Cluster states](../reference/cluster-states.md)
