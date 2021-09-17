---
layout: bidder
title: vi
description: vi bid adapter
pbjs: true
biddercode: vi
pbjs_version_notes: not in 5.x
---

### bid params
{: .table .table-bordered .table-striped }

| Name          | Scope    | Description                                     | Example                           |
| :------------ | :------- | :---------------------------------------------- | :--------------------------------- |
| `pubId` | required | Publisher ID, provided by vi           | 'sb_test' |
| `lang`      | required | Ad language, in ISO 639-1 language code format  | 'en-US', 'es-ES', 'de'              |
| `cat`      | required | Ad IAB category (top-level or subcategory), single one supported  | 'IAB1', 'IAB9-1'        |
| `bidFloor`      | optional | Lowest value of expected bid price  | 0.001        |
| `useSizes`      | optional | Specifies from which section of the config sizes are taken, possible values are 'banner', 'video'. If omitted, sizes from both sections are merged.  | 'banner'  |
