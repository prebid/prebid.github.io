---
layout: bidder
title: RingierAxelSpringer
description: Prebid RingierAxelSpringer Bidder Adapter
biddercode: ras
media_types: banner
pbjs: true
gvl_id: 1021
tcfeu_supported: true
safeframes_ok: false
deals_supported: false
floors_supported: false
fpd_supported: false
sidebarType: 1
---



### Bid Params

{: .table .table-bordered .table-striped }
| Name             | Scope    | Description                                                                                          | Example                                     | Type     |
|------------------|----------|------------------------------------------------------------------------------------------------------|---------------------------------------------|----------|
| `network`        | required | Specific identifier provided by RAS                                                                  | `'4178463'`                                   | `string` |
| `site`           | required | Specific identifier name (case-insensitive) that is associated with this ad unit and provided by RAS | `'example_com'`                             | `string` |
| `area`           | required | Ad unit category name; only case-insensitive alphanumeric with underscores and hyphens are allowed   | `'sport'`                                   | `string` |
| `slot`           | required | Ad unit placement name (case-insensitive) provided by RAS                                            | `'slot'`                                    | `string` |
| `pageContext`    | optional | Web page context data                                                                                | `{}`                                        | `object` |
| `pageContext.dr` | optional | Document referrer URL address                                                                        | `'https://example.com/'`                    | `string` |
| `pageContext.du` | optional | Document URL address                                                                                 | `'https://example.com/sport/football/article.html?id=932016a5-02fc-4d5c-b643-fafc2f270f06'` | `string` |
| `pageContext.dv` | optional | Document virtual address as slash-separated path that may consist of any number of parts (case-insensitive alphanumeric with underscores and hyphens); first part should be the same as `site` value and second as `area` value; next parts may reflect website navigation | `'example_com/sport/football'`              | `string` |
| `pageContext.keyWords` | optional | List of keywords associated with this ad unit; only case-insensitive alphanumeric with underscores and hyphens are allowed | `['euro', 'lewandowski']` | `string[]` |
| `pageContext.keyValues` | optional | Key-values associated with this ad unit (case-insensitive); following characters are not allowed in the values: `" ' = ! + # * ~ ; ^ ( ) < > ] [ & @` | `{}`                    | `object` |
| `pageContext.keyValues.ci`    | optional | Content unique identifier                                                                | `'932016a5-02fc-4d5c-b643-fafc2f270f06'`                                        | `object` |
| `pageContext.keyValues.adunit` | optional | Ad unit name                                                                           | `'example_com/sport'`                    | `string` |
