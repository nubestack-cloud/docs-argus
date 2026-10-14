# Outbound access

By default ARGUS refuses to connect to a private or internal address for an AI provider or a
Git repository. **Settings → Outbound access** names the internal destinations you trust, such
as a self-hosted model server or a Git server on your own network.

## What is refused by default

Loopback, link-local and private address ranges, checked against the address a name actually
resolves to at connection time — so a public hostname that resolves inward is refused too. When
a call is refused, the error names the address, says it is private, and points at this setting.

## Adding a destination

Add one entry per destination, each with a reason:

| Entry | Permits |
|---|---|
| `10.20.0.0/16` | Every address in that range |
| `192.168.4.9` | That one address |
| `ghe.internal.example.com` | Whatever that name resolves to at the moment of each call |

The reason is required, so whoever reviews the list later knows why each exception exists.
Changes take effect when you save the settings page; until then, each row says it is staged
rather than in effect.

## Limits

- Anything you do not name stays refused. There is no switch that allows internal addresses
  in general.
- An entry can only name a private address. A public range, or a catch-all such as
  `0.0.0.0/0`, is rejected.
- Cloud instance-metadata addresses can never be named — directly, inside a wider range, or
  through a hostname that resolves to one.
- Prefer an address or a range to a hostname. A hostname entry trusts whoever controls that
  name's DNS record.
- The list holds at most 64 entries.

The list applies to AI providers and Git repositories only. The notification webhooks, your
identity provider and the embedding model server may already be internal without an entry;
metadata addresses are refused for all of them regardless.

## See also

- [AI providers](ai-providers.md)
- [Git repositories](repositories.md)
- [Network requirements](../reference/network-requirements.md)
