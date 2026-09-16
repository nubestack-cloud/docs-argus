# Detector settings

**Settings → Detectors** controls what becomes an incident. It is the main lever on volume.

![The detectors page, showing the three detectors, the rule catalogue and storm
protection](../assets/images/10-settings-detectors.png)

*Each detector can be disabled, and each sweep rule individually. Storm protection and the
history preview are below.*

## Disabling a detector or a rule

Disabling a detector stops its findings from becoming incidents. Disabling a rule does the
same for one sweep check.

This is a hub-side filter. The agent keeps running the check and keeps sending findings
exactly as before; the hub stops acting on them. Findings stay visible in the cluster's
history, so the condition remains observable as data.

Both take effect immediately, on both sides, with no restart.

Use this for a condition that is noisy across the fleet. For a condition accepted on one
specific object, use a [toleration](../incidents/tolerations.md) instead.

## Storm protection

Caps how many brand-new incidents a single cluster may open in a rolling window.

| Field | Meaning |
|---|---|
| Max new incidents per cluster | The ceiling |
| Rolling window | The period the ceiling applies over |

This bounds a flood of genuinely distinct new problems. It is separate from fingerprint
grouping, which already collapses repeats of the same problem into one incident.

Once a cluster hits the ceiling, further findings that would have opened a new incident are
still recorded and still visible in the finding history, but stop creating incidents until
the window passes. Incidents that already exist keep updating throughout.

Both fields blank disables storm protection, which is the default.

## Preview against history

**Preview against history** replays the detector and storm-protection settings as currently
entered — saved or not — against real recorded history, and reports what they would have
done.

Use it before committing to a change. It answers "how much quieter would this have been"
with your own data rather than a guess.

## Resend cooldown

How often an agent may re-send the same detected problem is set on the agent when it is
deployed, not here. The default is five minutes.

It is deliberately not a field on this page: a setting shown here would imply the hub can
change it on a connected agent, and it cannot.

## See also

- [What ARGUS detects](../incidents/detection.md)
- [Detectors and rules](../reference/detectors.md)
- [Tolerations](../incidents/tolerations.md)
