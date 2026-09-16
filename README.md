# ARGUS documentation

Product and user documentation for NubeStack ARGUS, built with MkDocs and Material.

Published site: <https://argus.nubestack.com/> (GitHub Pages default:
<https://nubestack-collab.github.io/docs-argus/>)

## Build it

```bash
python3 -m venv .venv
. .venv/bin/activate
pip install -r requirements.txt
mkdocs serve
```

Then open `http://127.0.0.1:8000/`.

Before publishing a change:

```bash
mkdocs build --strict
```

`--strict` turns broken internal links and nav omissions into errors, so a page that is not
reachable fails the build rather than shipping.

## What is here

| Path | Contents |
|---|---|
| `docs/` | The pages, one directory per nav section |
| `docs/assets/images/` | Screenshots, plus the header mark and favicon |
| `docs/stylesheets/extra.css` | Small overrides on the Material theme |
| `mkdocs.yml` | Theme, extensions and the nav |
| `CONTRIBUTING.md` | How to write for this site — read before editing a page |
| `.github/workflows/docs.yml` | Strict build on every push and pull request; deploys `main` to Pages |

This repository contains documentation only.

## Publishing

Pushes to `main` build and deploy to GitHub Pages automatically; pull requests stop at the
strict build and publish nothing.

No manual setup is needed. The deploy job runs `actions/configure-pages` with
`enablement: true`, which switches Pages on for the repository and sets the source to
**GitHub Actions** on the first run. If that step fails on the very first run, the
repository's Actions permissions are read-only — set **Settings → Actions → General →
Workflow permissions** to allow write access, or turn Pages on by hand under
**Settings → Pages** with **GitHub Actions** as the source, then re-run the workflow.

## Custom domain

The site is served at `argus.nubestack.com` rather than the default
`nubestack-collab.github.io` address. Two things in this repository make that work, and both
are in place:

- `docs/CNAME` — a single line, `argus.nubestack.com`. MkDocs copies it into `site/` on
  every build, and GitHub Pages reads it from the deployed artifact to know which custom
  domain to serve. It must live in `docs/`, not at the repository root, or the build will
  not carry it.
- `site_url` in `mkdocs.yml` — set to `https://argus.nubestack.com/`, which drives the
  canonical `<link>` tag and the sitemap.

Two things outside this repository have to match, and only an organisation admin can set
them:

1. **DNS** — at whichever provider hosts the nameservers for `nubestack.com`, a `CNAME`
   record for the `argus` host pointing at `nubestack-collab.github.io`. Check the
   registrar's nameserver settings if unsure: a domain bought at one provider is not
   necessarily hosted there.
2. **GitHub** — the repository's **Settings → Pages → Custom domain** set to
   `argus.nubestack.com`, and **Enforce HTTPS** ticked once GitHub has issued a certificate
   for it.

Until the DNS record resolves, the deployment still succeeds and the site is reachable at
the default Pages address.
