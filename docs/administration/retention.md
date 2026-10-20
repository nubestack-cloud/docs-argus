# Data retention

A new install keeps **findings for 30 days** and everything else forever. Configure retention
under **Settings → General**.

![The data retention settings, with three windows all defaulting to keep
forever](../assets/images/13-settings-general.png)

*Three independent windows, here set to 120 days each. Blank means keep forever.*

## The three windows

| Window | Covers |
|---|---|
| Audit log retention | The hash-chained record of consequential actions |
| Incident retention | Incidents and their analyses, plans, approvals and executions |
| Finding retention | Raw findings — the highest-volume data ARGUS stores |

Leave a field blank to keep that data indefinitely. A new install sets finding retention to
30 days, because findings are most of the database; incidents and the audit log are kept until
you set a window. An install upgraded from a release before 0.2.0 keeps whatever it had,
including keeping everything.

## What setting a window does

A daily maintenance job permanently drops history older than the window.

!!! danger "Deletion cannot be undone"
    There is no recovery from a retention window other than a database backup taken before
    the job ran. Set a window you are sure about. The bundled database is not backed up on a
    schedule; with an external database, make sure your backups predate the change.

A saved change takes effect at the next daily maintenance run, not immediately.

## Choosing windows

**Findings** are the volume. A cluster with a noisy namespace can produce tens of thousands
in a fortnight, and busy clusters add 15–20 MB a day each. Findings are evidence for
incidents that are usually long closed, so this is the window that keeps disk in check. It
removes them a month at a time, so up to a month more than the window is held.

**Incidents** are the history you would want when asking whether a fault has happened
before. Keep them longer than findings.

**Audit** records are the ones an auditor asks for. Consider your own obligations rather
than disk: this is usually the longest window, and often the one that should stay blank.

## See also

- [Insights](insights.md)
- [Audit log](audit-log.md)
- [Install the hub](../getting-started/install.md)
