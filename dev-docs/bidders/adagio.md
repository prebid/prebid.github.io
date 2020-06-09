---
layout: bidder
title: Adagio
description: Prebid Adagio Bidder Adaptor
hide: true
biddercode: adagio
media_types: banner
gdpr_supported: true
schain_supported: true
tcf2_supported: true
---

### Note

The Adagio bidder adaptor requires setup and approval from the Adagio team. Please reach out to [contact@adagio.io](mailto:contact@adagio.io) for more information.

### Bid Params

**Important**: Adagio needs to collect attention data about the ads displayed on a page and must listen to some specifics ad-server events. Please refer to the [Adagio user guide](https://adagio-team.atlassian.net/wiki/spaces/AH/pages/67272705/EN+Adagio+Prebid.js+installation+guide+for+publishers) for details.

{: .table .table-bordered .table-striped }

| Name               | Scope              | Description                                                                                                          | Example         | Type      |
|--------------------|--------------------|----------------------------------------------------------------------------------------------------------------------|-----------------|-----------|
| `organizationId`   | required           | Id of the Organization. Handed out by Adagio.                                                                        | `'1010'`        | `string`  |
| `site`             | required           | Name of the site. Handed out by Adagio.<br><i>- max length: 50</i>                                                   | `'mysite-com'`  | `string`  |
| `adUnitElementId`  | required           | Refers to the adunit html attribute id in a page.                                                                    | `'gpt-ban-atf'` | `string`  |
| `environment`*     | required | Environment where the page is displayed.<br><i>- max length: 30</i><br><i>- max distinctives values: 10</i>          | `'desktop'`     | `string`  |
| `placement`*       | required | Refers to the placement of an adunit in a page.<br>Must not contain any information about the type of device.<br><i>- max length: 30</i><br><i>- max distinctives values: 10</i> | `'ban_atf'`     | `string`  |
| `pagetype`*        | recommended        | Describes what kind of content will be present in the page.<br><i>- max length: 30</i><br><i>- max distinctives values: 50</i> | `'article'`     | `string`  |
| `category`*        | recommended        | Category of the content displayed in the page.<br><i>- max length: 30</i><br><i>- max distinctives values: 50</i>    | `'sport'`       | `string`  |
| `subcategory`*     | optional           | Subcategory of the content displayed in the page.<br><i>- max length: 30</i><br><i>- max distinctives values: 50</i> | `'handball'`    | `string`  |
| `postBid`          | optional           | Used in Post-Bid context only.                                                                                       | `true`          | `boolean` |

<i>*These parameters will have its accentuated characters converted to their non-accentuated version:&nbsp;`é`&nbsp;=>&nbsp;`e`</i>
