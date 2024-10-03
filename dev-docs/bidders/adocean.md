---
layout: bidder
title: AdOcean
description: Prebid AdOcean Bidder Adaptor
pbjs: true
pbs: true
biddercode: adocean
tcfeu_supported: true
gvl_id: 328
sidebarType: 1
---

### Note

The AdOcean bid adapter may require an additional setup from the AdOcean team. Please contact with your local Technical Support team or by visiting [AdOcean website](https://adocean-global.com/en/contact/).

### Prebid.JS Bid Params

{: .table .table-bordered .table-striped }
| Name     | Scope    | Description       | Example                                            | Type     |
|----------|----------|-------------------|----------------------------------------------------|----------|
| slaveId  | required | slave ID          | `'adoceanmyaozpniqismex'`                          | `string` |
| masterId | required | master ID         | `'tmYF.DMl7ZBq.Nqt2Bq4FutQTJfTpxCOmtNPZoQUDcL.G7'` | `string` |
| emiter   | required | traffic source id | `'myao.adocean.pl'`                                | `string` |

### Prebid Server Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description                                           | Example                                            | Type     |
|---------------|----------|-------------------------------------------------------|----------------------------------------------------|----------|
| slaveId       | required | slave ID                                              | `'adoceanmyaozpniqismex'`                          | `string` |
| masterId      | required | master ID                                             | `'tmYF.DMl7ZBq.Nqt2Bq4FutQTJfTpxCOmtNPZoQUDcL.G7'` | `string` |
| emitterPrefix | required | AdOcean emitter prefix                                | `'myao'`                                           | `string` |
