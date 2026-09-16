# Maintenance and freeze windows

Windows control *when* unattended execution may run. They gate automation only — a person
can approve a remediation at any time.

Configure them under **Settings → Investigation**.

## The two kinds

| Kind | Effect |
|---|---|
| Maintenance | Permits automation, confining it to the hours the window is open |
| Freeze | Blocks automation whenever it is open, regardless of anything else |

A freeze window wins. If a freeze and a maintenance window overlap, automation does not
run.

## Configuring one

| Field | Meaning |
|---|---|
| Kind | Freeze or maintenance |
| Opens at | A cron expression for when the window starts |
| Stays open for | How long it remains open, from one hour to three days |
| Timezone | The timezone the cron expression is read in |
| Reason | Why this window exists, recorded with it |

Set the timezone deliberately. A change freeze over a public holiday means the timezone
your organisation observes, not the hub's.

## No windows means no time restriction

With no windows configured, automation is not restricted by time. That is not the same as
"nothing is permitted" — it means time is simply not one of the things bounding automation,
and the other guardrails still apply.

Add a maintenance window only if you actively want automation confined to particular hours.

## Typical use

**A change freeze.** A freeze window over a release period, a month-end close or a holiday
shutdown, with the reason recorded so the next person understands why automation is quiet.

**A maintenance window.** Automation confined to a low-traffic period, so an unattended
restart happens at 03:00 rather than at peak.

## See also

- [Unattended execution](unattended-execution.md)
- [Guardrails](guardrails.md)
