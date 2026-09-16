# Cluster states

A cluster's state describes its agent connection, not the health of the workloads in it.

| State | Meaning | What to do |
|---|---|---|
| Provisioning | Enrolled, waiting for the tunnel to come up | Wait. This is usually seconds |
| Pending approval | The agent connected and is not yet accepted | Accept it, if it is the cluster you meant |
| Active | Connected and reporting | Nothing |
| Degraded | Connected, but heartbeats are late or incomplete | Check agent logs and network stability |
| Disconnected | Not heartbeating | Check the agent pod, the network, and the tunnel address |
| Incompatible version | The agent is too old or too new for this hub | Upgrade the agent, or the hub |
| Rejected | Refused at acceptance | Nothing, unless you meant to accept it |
| Archived | Removed from the active fleet, history kept | Nothing. Its agent is refused if it connects |

Agents heartbeat every 30 seconds, so **Last heartbeat** on the clusters page is the
freshest signal about a connection.

## Common causes of disconnection

| Cause | Tell |
|---|---|
| Agent pod not running | No recent heartbeat, no reconnection attempts |
| Tunnel address unreachable | The agent retries and never establishes a tunnel |
| Hub tunnel certificate no longer covers the enrolled address | The agent rejects the hub's certificate and reconnects in a loop |
| Agent lost its stored identity | The agent has no certificate and cannot enrol without a new token |

An agent that keeps its volume across restarts reconnects with the same identity and needs
no intervention.

## See also

- [Clusters](../administration/clusters.md)
- [Troubleshooting](../troubleshooting.md)
