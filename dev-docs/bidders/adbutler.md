---
layout: bidder
title: AdButler
description: AdButler Bid Adapter
biddercode: adbutler
pbjs: true
sidebarType: 1
media_types: banner
safeframes_ok: true
tcfeu_supported: false
usp_supported: false
coppa_supported: false
---

### Bid params

{: .table .table-bordered .table-striped }

| Name        | Scope    | Description                                                                                                  | Example                       | Type          |
|-------------|----------|--------------------------------------------------------------------------------------------------------------|-------------------------------|---------------|
| `accountID` | required | Account ID                                                                                                   | `'181556'`                    | `string`      |
| `zoneID`    | required | Zone ID                                                                                                      | `'705374'`                    | `string`      |
| `domain`    | optional | Ad serving domain (set if using custom domains)                                                              | `'servedbyadbutler.com'`      | `string`      |
| `keyword`   | optional | Keyword(s) used for custom targeting                                                                         | `'green,orange'`              | `string`      |
| `minCPM`    | optional | Minimum CPM value to accept                                                                                  | `'1.00'`                      | `string`      |
| `maxCPM`    | optional | Maximum CPM value to accept                                                                                  | `'5.00'`                      | `string`      |
| `extra`     | optional | Other ad request parameters [(API Docs)](https://www.adbutler.com/docs/api/#tag/AdServe/paths/~1adserve/get) | `{ _abdk: { bird: "duck" } }` | `object`      |
