# Work sample review

The portfolio owner supplied the annotation practice guide, chemical hazard PDF, industrial equipment guide and astronomical annotation guide. The two supplied copies of `Annotation_Best_Practices_Guide.docx` have identical SHA-256 hashes, so the site publishes one practice guide.

## Document changes

- Replaced long dashes and formulaic introductions with ordinary punctuation and direct instructions.
- Removed unsupported annotation volumes, agreement results, production histories, client or dataset references, approval claims and historical sign-off tables. The documents identify Quadri Busari as the author and remain work samples.
- Retained the technical label sets and added clear source examples, review notes, tables and page numbers.
- Corrected the equipment count to the 13 classes actually listed. Removed arbitrary universal size, visibility, vertex and quality thresholds, and separated visible conditions from conclusions about operating safety.
- Retained 23 chemical labels while distinguishing hazard families, combination tags and review status. Classifications depend on the supplied SDS; a substance name or pictogram alone is insufficient. Missing fields and out-of-schema hazards have an explicit review procedure.
- Retained 27 astronomy labels in four separate fields. Clarified wavelength and coordinate conventions, measurement precision, ambiguous morphology and data-quality flags.
- Rebuilt the existing business and QA downloads with the same document formatting and their previously reviewed content.

## Downloads

| Sample | PDF pages | Editable format |
| --- | ---: | --- |
| Annotation practice | 3 | Word |
| Chemical hazards | 5 | Word |
| Industrial equipment | 5 | Word |
| Astronomical objects | 4 | Word |
| Business documents | 1 | Word |
| Annotation QA | 1 | Word |

The archive contains the six current PDFs and six matching Word documents. Reviewed text is stored in `content/work-samples.json`; `tools/build_work_samples.py` rebuilds the downloads without adding site runtime dependencies.

The website has a sixth gallery entry for astronomy. The gallery counter now reports the last sample correctly when the end of the scroll area is reached on a wide screen.

## Verification

- Checked that the reviewed source text appears in both downloadable formats.
- Checked document author metadata, ordinary punctuation, absence of comments and tracked changes, and printable PDF text bounds.
- Inspected the rendered PDF pages and the astronomy gallery at phone width.
- Verified all twelve archive entries against the current individual files.
- Checked layout, gallery buttons and keyboard navigation at widths of 1440, 768, 390 and 320 pixels, including the final sample and its previous button.
- Verified all fourteen distinct download targets, including the CV and archive, with no browser runtime errors. Download links and core content also remain present with JavaScript disabled.
- Ran JavaScript syntax and Git whitespace checks.

The original files in Downloads were preserved and checked against the backup. Before this revision, the existing site and document files were backed up outside the repository at `C:\Users\Quasars\AppData\Local\Temp\portfolio-work-samples-20261123\backup-155608`.
