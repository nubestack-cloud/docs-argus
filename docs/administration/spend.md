# Model pricing and spend

ARGUS records what every investigation cost, but it can only do that if you tell it what
your model costs. Set prices under **Settings → Model pricing**.

## Why prices are not pre-filled

No vendor's rates are built in. A hardcoded price goes stale silently, and a cost figure
that is quietly wrong is worse than no figure — so until you configure prices, every
analysis records an honest zero.

## Setting prices

Three prices, in US dollars per million tokens, for the model configured under **AI
providers**:

| Price | Covers |
|---|---|
| Input tokens | Tokens sent to the model |
| Cached-read input tokens | Tokens served from the provider's cache, usually cheaper |
| Output tokens | Tokens the model generated |

All three must be set together. Saving with one or two filled in is rejected, because a
partial price table produces a figure that looks complete and is not.

## The daily spend ceiling

Once prices are set, a check compares today's accumulated spend against the ceiling before
starting any **automatic** investigation. When the ceiling is reached, automatic
investigation stops for the rest of the day and says so in the log rather than silently
doing nothing. It resumes on its own when spend resets at the next UTC day, or when you
raise the ceiling.

A manual **Analyze** click is a deliberate, bounded human action and is never blocked by the
ceiling.

!!! note "A ceiling needs prices"
    A ceiling with no price table does nothing, because recorded cost is always zero without
    prices to compute it from.

## Subscription-billed providers

An agent-CLI provider authenticated by a subscription rather than per token records cost on
a separate, notional basis that the ceiling does not count. With that provider active, real
activity cannot breach the ceiling however low it is set. The page says so directly when
that is the case.

This is a property of subscription billing rather than something to work around: there is
no per-request charge to meter.

## Where spend appears

The overview shows today's spend against the ceiling. Each analysis records its own cost on
the incident. Where a provider cannot report cost, it reads as not measured rather than as
zero.

## See also

- [AI providers](ai-providers.md)
- [Automatic investigation](../automation/automatic-investigation.md)
- [Insights](insights.md)
