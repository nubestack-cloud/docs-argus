# Notifications

ARGUS posts to a webhook when something happens that a person should know about. Configure
it under **Settings → Notifications**.

## Configuring the webhook

Set the webhook URL and save. Leaving the field blank keeps the current webhook unchanged;
to remove one, use the explicit clear option rather than blanking the field.

Point it at whatever your team already watches — a chat integration, an alert router, or
your own receiver.

## What it is for

Notifications are for things that stop progressing without a person:

- a high-severity incident opening
- a plan waiting for approval, and one that has been waiting too long
- an execution that failed
- a pull request that has sat unmerged
- a validation that could not confirm an outcome, or an incident reopening

A plan that has been in the queue for days is escalated rather than silently waiting, so an
approval queue nobody is watching becomes visible instead of becoming a backlog.

## Keep it narrow

Route notifications narrowly at first. A quiet, trusted channel is more useful than a busy
one people learn to ignore, and ARGUS is capable of being noisy on a fleet that has not had
its detector settings tuned.

If notifications are too frequent, the fix is usually upstream: tune detectors, add
tolerations for accepted conditions, or set storm protection. See
[What ARGUS detects](../incidents/detection.md).

## See also

- [What ARGUS detects](../incidents/detection.md)
- [Tolerations](../incidents/tolerations.md)
- [Approving a fix](../remediation/approvals.md)
