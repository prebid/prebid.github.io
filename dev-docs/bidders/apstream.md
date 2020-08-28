---
layout: bidder
title: AP Stream
description: AP Stream Bidder Adapter
biddercode: apstream
pbjs: true
media_types: banner
gdpr_supported: true
tcf2_supported: true
gvl_id: 394
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name           | Scope      | Description                                     | Example            | type    |
| :-----------   | :--------- | :------------                                   | :----------------- | :---    |
| `publisherId`  | required   | Publisher Id will be generated on AP Stream.    | '1234'             | string  |
| `code`         | optional   | Ad code                                         | 'S1_Leaderboard'   | string  |
| `adunitId`     | optional   | Ad unit Id                                      | 1234               | integer |
| `endpoint`     | optional   | Endpoint for custom bidder                      | 'site.com/v1'      | string  |
| `test`         | optional   | Use test endpoint                               | true               | boolean |
| `sendDsu`      | optional   | Send DSU to bidder (default `true`)             | false              | boolean |
