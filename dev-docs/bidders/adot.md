---
layout: bidder
title: Adot
description: Prebid Adot Bidder Adapter
biddercode: adot
media_types: banner, video, native
userIds: pubProvidedId
tcfeu_supported: true
gvl_id: 272
pbjs: true
pbs: true
floors_supported: true
schain_supported: true
sidebarType: 1
---

### Prebid JS

#### Bid Params

{: .table .table-bordered .table-striped }
| Name                | Scope                             | Description                                                                                                                                                                   | Example                                               | Type             |
|---------------------|-----------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------|------------------|
| `placementId`       | optional                          | The placement ID from Adot.                                                      | `'adot_placement_224521'`                                            | `string`         |
| `video`             | optional | Object containing video targeting parameters. See [Video Object](#adot-video-object) for details.                                                                        |  | `object`         |

#### Video Object

{: .table .table-bordered .table-striped }
| Name              | Scope                                     | Description                                                                                                                                                                                                                                  | Type             |
|-------------------|-------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------|
| `container`       | optional                                  | Selector used for finding the element in which the video player will be displayed, e.g., `#div-1`. The `ad unit code` will be used if no `container` is provided.                                                                            | `string`         |

#### Bid Config

#### PublisherId

You can set a publisherId using `pbjs.setBidderConfig` for the bidder `adot`

#### Example

```javascript
pbjs.setBidderConfig({
    bidders: ['adot'],
    config: {
        adot: {
            publisherId: '__MY_PUBLISHER_ID__'
        }
    }
});
```

#### Specific publisher path

You can set a specific publisher path using `pbjs.setBidderConfig` for the bidder `adot`
The bidrequest will add this path to the bidder endpoint

#### Example

```javascript
pbjs.setBidderConfig({
    bidders: ['adot'],
    config: {
        adot: {
            publisherPath: '__MY_PUBLISHER_PATH__'
        }
    }
});
```

### Prebid server

#### Bid Params

{: .table .table-bordered .table-striped }
| Name                | Scope    | Description                                                                                                                                                                   | Example                                               | Type             |
|---------------------|----------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------|------------------|
| `placementId`       | optional | An ID which identifies this placement of the impression.                                   | `'adot_placement_224521'`                                            | `string`         |
| `parallax`          | optional (only for prebid-server) | Specify if the wanted advertising's creative is a parallax.                                                                        | `true/false` | `boolean`         |
| `publisherPath`          | optional | Specific to each integration. Do not use until asked by someone from adot.                                                                      | `/hubvisor` | `string`         |

#### Testing Bid Request

The following test parameters can be used to verify that Prebid Server is working properly with the
server-side adot adapter. This is a mobile Bid-request example.

```
  {
  "id": "b967c495-adeb-4cf3-8f0a-0d86fa17aeb2",
  "app": {
    "id": "0",
    "name": "test-adot-integration",
    "publisher": {
      "id": "1",
      "name": "Test",
      "domain": "test.com"
    },
    "bundle": "com.example.app",
    "paid": 0,
    "domain": "test.com",
    "page": "https:\/\/www.test.com\/",
    "cat": [
      "IAB1",
      "IAB6",
      "IAB8",
      "IAB9",
      "IAB10",
      "IAB16",
      "IAB18",
      "IAB19",
      "IAB22"
    ]
  },
  "device": {
    "ua": "Mozilla\/5.0 (Linux; Android 7.0; SM-G925F Build\/NRD90M; wv) AppleWebKit\/537.36 (KHTML, like Gecko) Version\/4.0 Chrome\/80.0.3987.132 Mobile Safari\/537.36",
    "make": "phone-make",
    "model": "phone-model",
    "os": "os",
    "osv": "osv",
    "ip": "0.0.0.0",
    "ifa": "IDFA",
    "carrier": "WIFI",
    "language": "English",
    "geo": {
      "zip": "75001",
      "country": "FRA",
      "type": 2,
      "lon": 48.2,
      "lat": 2.32,
      "accuracy": 100
    },
    "ext": {
      "is_app": 1
    },
    "connectiontype": 2,
    "devicetype": 4
  },
  "user": {
    "id": "IDFA",
    "buyeruid": ""
  },
  "imp": [
    {
      "id": "dec4147e-a63f-4d25-9fff-da9bfd05bd02",
      "banner": {
        "w": 320,
        "h": 50,
        "format": [
          {
            "w": 320,
            "h": 50
          }
        ],
        "api": [
          1,
          2,
          5,
          6,
          7
        ]
      },
      "bidfloorcur": "USD",
      "bidfloor": 0.1,
      "instl": 0,
      "ext": {
        "adot": {
        }
      }
    }
  ],
  "cur": [
    "USD"
  ],
  "regs": {
    "ext": {
      "gdpr": 1
    }
  },
  "at": 1
}
```

Please contact <admin@we-are-adot.com> if you would like to build and deploy Prebid server and use it with Adot.
