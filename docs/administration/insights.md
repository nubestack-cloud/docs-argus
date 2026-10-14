# Insights

**Insights** answers questions about the fleet rather than about one incident: where the
noise is, whether investigations are reaching conclusions, and which clusters are unstable.

![The insights page: investigations and whether they concluded, tokens and cost, and the
objects whose faults keep happening](../assets/images/06-insights.png)

*Every figure is computed from real recorded data for the selected scope. Nothing is
extrapolated or estimated.*

## Scope

Pick a cluster or the whole fleet, and a date range. The page refreshes every 30 seconds.

## What it shows

| Card | Answers |
|---|---|
| Investigations | How many ran, how many reached a conclusion and how many hit a bound, with the average number of tool round-trips and runs per day |
| Tokens and cost | Tokens billed, read from cache and produced, total cost where it is measured, and today's spend against the ceiling |
| What keeps happening | The objects whose faults recur most, with reason, incidents, clusters and occurrences. **Recurring** ranks over the whole range; **New in 7d** shows what started recently |
| Where the noise comes from | Namespaces ranked by finding volume, with their incident counts. **Noisiest** over the range, **New** for namespaces quiet before the last week |
| Incidents by cluster | Each cluster's incidents split into reopened or failed, open and closed — fixes that do not hold show as the first |
| Fixes people reject | Kinds of fix that reviewers turn down, with how often and the reasons they gave |
| Automation candidates | Kinds of fix that reviewers approve consistently, with their risk — the ones worth considering for unattended execution |

Cost is shown as not measured, never as zero, where the provider bills a flat subscription.
**Not measured yet** at the bottom lists the figures that cannot be computed from the
recorded data.

## Using it

Insights is the page to read monthly rather than during an incident.

If the queue feels noisy, start with where the noise comes from and decide per namespace
whether the condition is real, accepted, or a detector that wants disabling.

If investigations are frequently stopping without a conclusion, look at the investigation
bounds and the model before concluding the estate is unusual.

If a cluster shows repeated reopenings, the fixes are not holding, and the incidents
themselves will say which class of fault is recurring.

Before turning on unattended execution, read **Fixes people reject** and
**Automation candidates** together: a kind of fix reviewers keep approving is a candidate,
and one they keep rejecting is not.

## See also

- [Detector settings](detectors.md)
- [What ARGUS detects](../incidents/detection.md)
- [Model pricing and spend](spend.md)
