# Signals

**Signals** lists every finding the agents have reported — the raw symptoms and risks
underneath the incidents — and what ARGUS did with each. Use it to see what ARGUS noticed
and did not raise.

![The signals list, showing findings with what ARGUS did with each: raised, recorded but not
raised, or suppressed](../assets/images/40-signals.png)

*Each signal says whether it opened or joined an incident, and if not, why not.*

## What ARGUS did with a signal

| Tab | Meaning |
|---|---|
| Raised | The finding opened an incident or joined one |
| Recorded, not raised | Kept as evidence. It was a risk, rested on unverified evidence, or showed no harm yet |
| Suppressed | A toleration or storm protection kept it from raising, and the row says which |
| All | Every signal in the window |

**What opens an incident**, at the top of the page, states the rule: only an active fault, on
better than unverified evidence, showing degradation or unavailability, opens an incident.

## Reading a signal

Each row gives the object, the reason, the cluster and the severity, what ARGUS did and why,
the evidence class — fault, risk or anomaly, its confidence and its impact — how many times it was
seen, and when.

Look-alike signals on one page are grouped under their reason. **Only this reason** narrows
the list to that reason across the whole window, with its exact count.

## Filters

Search by reason, and narrow by cluster and time window. **More** holds further filters.

## See also

- [What ARGUS detects](detection.md)
- [The incident list](incident-list.md)
- [Tolerations](tolerations.md)
