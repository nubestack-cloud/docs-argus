# Automation

ARGUS can investigate incidents on its own, and can execute a narrow class of fixes without
waiting for a person. Both are off by default, and the second is bounded by five
independent controls.

- [Automatic investigation](automatic-investigation.md) — let ARGUS analyse new incidents
  without a click.
- [Unattended execution](unattended-execution.md) — the setting that lets a change happen
  with no approval, and what bounds it.
- [Guardrails](guardrails.md) — the auto-approval ceiling, blast-radius caps and the
  circuit breaker.
- [Maintenance and freeze windows](windows.md) — confining automation to chosen hours, or
  blocking it outright.
- [Notifications](notifications.md) — getting told when something needs a person.

!!! note "Two separate decisions"
    Automatic investigation costs money and reads your clusters. Unattended execution
    changes them. Enabling the first does not enable the second, and most installations
    should stop after the first.
