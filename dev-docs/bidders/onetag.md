---
layout: bidder
title: OneTag
description: Prebid OneTag Bidder Adaptor
hide: true
biddercode: onetag
media_types: banner, video
gdpr_supported: true
usp_supported: true
---


### Bid Params

{: .table .table-bordered .table-striped }

| Name    | Scope    | Description                       | Example      | Type     |
|---------|----------|-----------------------------------|--------------|----------|
| `pubId` | required |                                   | `'386276e072'` | `string` |

### Video Additional Information

Note that right now video support is only provided when the context is "instream" or "outstream". Also a renderer should be included when defining an outstream adUnit.
