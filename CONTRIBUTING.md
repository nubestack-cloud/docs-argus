# Contributing to the ARGUS documentation

This file is about *how to write*: voice, page shape, conventions, and the check a change
has to pass.

## Who this documentation is for

Engineers evaluating, installing, operating or governing ARGUS: platform and SRE engineers,
the people who carry the pager for a Kubernetes fleet, and the security reviewers who have
to sign it off.

Write for someone who wants to get a real task done, who is short on time, and who will
notice if you overstate what the product does.

## Voice

- **Plain, declarative prose.** Say what happens, in what order, and what the reader has to
  decide. Second person for instructions.
- **British spelling** — organise, colour, behaviour, licence (noun) / license (verb).
- **Sentence case for all headings**, including table headers.
- **No marketing register.** No "seamlessly", "effortlessly", "powerful", "robust",
  "leverage", "unlock", "empower". No exclamation marks.
- **Lead with the answer.** The first paragraph says what the page is for and what the
  reader will be able to do.
- **Concrete over abstract.** A real field name, a real default, a real number — or nothing.
- **Bold is for interface labels**, not for emphasis of ordinary prose:
  **Settings → Detectors**, **Analyze**, **Test connection**.
- Wrap lines at roughly 90 characters.

## What this is not

This is user and product documentation. It is not a developer guide, an engineering
notebook or a design rationale. Four habits break that; each is a defect, fix it on sight.

### 1. Never write about the documentation or its sources

The reader does not know or care that a source tree, a design document or an internal
guide exists. Never name "the sources", "this page", "the guide" or "this documentation" in
body text. A page may refer to *other pages* by title, which is different.

### 2. No source code, file paths or internal identifiers

A user cannot open a source file. Citing one makes a product page read like a code review.
No page names a source file, a function, a constant, an internal identifier, a repository or
a branch — not in body text, not in a table, not in an admonition.

Naming a *technology* is fine where the reader benefits: it is a Helm chart; the database is
PostgreSQL; the tunnel is mutual TLS. Naming a file is not.

Things a user genuinely interacts with are legitimate: interface labels, container image
names, commands they run, and setting names as the interface presents them.

### 3. No editorial voice, and no essays

Write the product's behaviour, not an opinion about it. Drop the knowing asides and the
self-congratulation.

Banned constructions: "worth noting", "worth internalising", "honest caveat", "that is the
design, not a gap", "not a defect", any "at 3am" framing, and rhetorical questions. Also
avoid counting things in prose — "Three properties worth knowing" — just make the list.

### 4. Headings name a subject

A heading is a label a reader scans and a link they land on, not a sentence arguing a case.
Use a noun phrase. Troubleshooting headings are the deliberate exception: they are symptoms,
phrased as the reader would search for them.

## Accuracy rules specific to this product

These exist because getting them wrong would mislead someone about what ARGUS will do to
their cluster.

- **Never imply a change happens without approval** unless the page is specifically about
  unattended execution, and then say what bounds it.
- **Never describe confidence as a measurement.** It is the model's own signal.
- **Never present a guidance outcome as a shortfall.** Most faults have no executable fix;
  that is a result.
- **State a default whenever you describe a setting.** "Off by default" is load-bearing
  information.
- **Do not document an interface that does not exist.** If a capability is configured
  outside the product's own screens, either describe it without inventing a screen, or leave
  it out.

## Page shape

Every page:

1. Starts with a single `# Heading` in sentence case, matching its nav label.
2. Follows with one to three sentences of orientation.
3. Uses `##` for major sections and `###` sparingly. Never deeper.
4. Ends with a **See also** section of two to four relative links — a deliberate handoff,
   not a sitemap.

Section `index.md` pages are landing pages: a short paragraph, then an annotated list of the
section's pages saying why you would read each. Under about 60 lines.

Reference pages lead with the table and keep prose to the minimum needed to make it
unambiguous.

A narrative page is usually 60–200 lines. Past about 250, it wants splitting.

## Conventions

### Links

Relative paths to the `.md` file, because `--strict` validates them:

```markdown
See [Resolution routes](../remediation/routes.md).
```

Never link to a built URL path, and never link to a heading anchor in another file unless
you have confirmed the heading exists.

### Images

Screenshots live in `docs/assets/images/` and are referenced relatively. Alt text describes
what is in the image; the italic line under it says what the reader should notice.

```markdown
![The detectors page, showing three detectors and the rule catalogue](../assets/images/10-settings-detectors.png)

*Each detector can be disabled, and each sweep rule individually.*
```

Screenshots are taken at 1600×1000 with a 2× device scale factor, signed in as an
administrator so every control is visible rather than disabled.

### Brand assets

Two files, deliberately, both holding identical geometry:

| File | Used as | Fill |
|---|---|---|
| `docs/assets/images/argus-mark.svg` | The header logo | White |
| `docs/assets/images/argus-favicon.svg` | The browser-tab icon | Teal |

The mark is the ARGUS aperture: twelve iris blades with three stopping halfway, and a
pupil. It is never drawn fully open.

The header version is reversed to white because the header paints a teal ground the teal
mark would disappear into. The favicon keeps the product's own teal, which is the colour
the mark holds on every other ground. Do not consolidate them into one file, and do not
"correct" the white one back to teal.

Neither file uses CSS or `currentColor`. The theme renders the logo as an image and a
favicon is rasterised outside the page, so in both cases there is nothing to inherit from
and the fill has to be a literal.

One trap, and it is silent: **no double hyphen inside an SVG comment.** XML forbids it, so
the file becomes malformed, every browser refuses to parse it, and you get no icon at all
with a correct 200 on the wire and nothing in the console. Parse-check an edited mark before
committing it:

```bash
python3 -c "from xml.dom.minidom import parse; parse('docs/assets/images/argus-mark.svg')"
```

### Admonitions

Use them sparingly — a page of admonitions has no emphasis left. Reserve `!!! danger` for
things that destroy data or expose credentials.

### Code blocks

Always label the language. Use `text` for ASCII diagrams. No `$` prompt — the copy button
copies it too.

## Before you publish

```bash
. .venv/bin/activate
mkdocs build --strict
```

- [ ] `mkdocs build --strict` passes with no warnings.
- [ ] Every page you touched is in the nav.
- [ ] Every page ends with a **See also**.
- [ ] No source file, function or repository is named anywhere.
- [ ] Every setting you described states its default.
