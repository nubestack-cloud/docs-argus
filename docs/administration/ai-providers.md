# AI providers

ARGUS uses one AI provider at a time. You can configure several and switch between them
without a restart.

Go to **Settings → AI providers**.

![The AI providers page showing a configured provider marked active, with test, edit and
delete controls](../assets/images/09-settings-providers.png)

*Exactly one provider is active. Switching takes effect on the next investigation.*

## Two kinds

| Kind | What it is |
|---|---|
| API endpoint | Any OpenAI-compatible endpoint — a hosted service, or a model you run yourself |
| Agent CLI | An isolated runner container beside the hub, driving an agent CLI |

### API endpoint

| Field | Notes |
|---|---|
| Base URL | The endpoint. A self-hosted model is configured here like any other |
| Model | The model name exactly as the provider expects it |
| API key | Stored encrypted |

### Agent CLI

| Field | Notes |
|---|---|
| Runner URL | The runner service beside the hub |
| Agent | Which CLI the runner drives |
| Runner token | The shared token the runner expects |

## Test before switching

**Test connection** verifies the endpoint, the credential and the model. A failure names
the reason, which is easier to act on now than as a failed investigation later.

## Choosing a model

Investigation quality depends on the model more than on any setting. The loop is tool-based
and iterative, so two properties matter: reliable tool-calling, and enough context to hold
several object descriptions and log extracts at once.

A small model will produce investigations that stop early or propose actions that do not
match their evidence.

## Switching

Switching the active provider affects the next investigation. Analyses already recorded keep
the model they were produced with, so a change in provider is visible in the history rather
than rewriting it.

## What is sent

Incident context and the results of read-only tool calls, with redaction already applied
inside the cluster. No cluster credentials are ever included, and the model cannot execute
anything — it proposes, and a typed, signed, rehearsed path executes. See
[Security model](../overview/security-model.md).

## See also

- [Investigation](../incidents/investigation.md)
- [Model pricing and spend](spend.md)
- [Configure analysis](../getting-started/configure-analysis.md)
