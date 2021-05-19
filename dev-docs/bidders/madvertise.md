---
layout: bidder
title: Madvertise
description: Prebid Madvertise Bidder Adapter
pbjs: true
biddercode: madvertise
gdpr_supported: true
gvl_id: 153
media_types: banner, video
safeframes_ok: true
pbs: true
pbs_app_supported: true
---

### Prebid.js Bid Params

{: .table .table-bordered .table-striped }
| Name         | Scope    | Description                                                                                             | Example                                 | Type      |
|--------------|----------|---------------------------------------------------------------------------------------------------------|-----------------------------------------|-----------|
| `s`          | required | Zone code. This parameter should be the unique Publisher ID of your mobile application or website.      | `'/4543756/prebidadaptor/madvertiseHB'` | `string`  |
| `lat`        | optional | Latitude                                                                                                | `48.866667`                             | `float`   |
| `long`       | optional | Longitude                                                                                               | `2.333333`                              | `float`   |
| `age`        | optional | Age                                                                                                     | `19`                                    | `integer` |
| `gender`     | optional | Gender m or f                                                                                           | `'f'`                                   | `string`  |
| `locale`     | optional | Locale                                                                                                  | `'fr'`                                  | `string`  |
| `floor`      | optional | Bid floor                                                                                               | `1.0`                                   | `float`   |

#### Example

```
{
    bidder: 'madvertise',
    params: { 
            s: "/4543756/prebidadaptor/madvertiseHB",
            tgt:'aa=a;bb=b'
    }
}
```
### Prebid Server Bid Params

{: .table .table-bordered .table-striped }
| Name         | Scope    | Description                                                                                             | Example                                 | Type      |
|--------------|----------|---------------------------------------------------------------------------------------------------------|-----------------------------------------|-----------|
|`zoneId`      | required | The zone ID provided by Madvertise.                                                                     | `'/1111111/banner'`                     | `string`  |


#### Example

```
{
    "id": "some-request-id",
    "test": 1,
    "site": {
        "page": "prebid.org"
    },
    "imp": [
        {
            "id": "some-impression-id",
            "banner": {
                "format": [
                    {
                        "w": 320,
                        "h": 50
                    }
                ]
            },
            "ext": {
                "prebid": {
                    "bidder": {
                        "madvertise": {
                            "zoneId": "/1111111/banner"
                        }
                    }
                }
            }
        }
    ],
    "tmax": 1000
}
```