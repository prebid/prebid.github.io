---
layout: bidder
title: StackAdapt
description: StackAdapt Prebid Bidder Adapter
biddercode: stackadapt
pbjs: true
pbs: true
gvl_id: 238
tcfeu_supported: true
usp_supported: true
userId: all
media_types: banner, video, native, audio
coppa_supported: true
gpp_sids: tcfeu, tcfca, usnat, usstate_all, usp
gpp_supported: true
schain_supported: true
dchain_supported: false
deals_supported: true
floors_supported: true
fpd_supported: true
ortb_blocking_supported: true
multiformat_supported: will-bid-on-any
privacy_sandbox: no
prebid_member: false
sidebarType: 1
---

### Note

- Prebid.js supports `banner` and `video` format only.
- Prebid Server supports `banner`, `video`, `native`, and `audio` formats.
- `supplyId` is required for Prebid Server only. It identifies the supply source and is provided by StackAdapt.

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope              | Description                               | Example            | Type     |
|---------------|--------------------|-------------------------------------------|--------------------|----------|
| `publisherId` | required           | StackAdapt provided id                    | `'4cd53a92ra91'`   | `string` |
| `supplyId`    | required (PBS only)| Supply source ID, provided by StackAdapt  | `'ssp-1'`          | `string` |
| `placementId` | optional           | StackAdapt provided id                    | `'e95365f397a7'`   | `string` |
| `banner`      | optional           | banner supporting expdir                  | `{expdir: [1, 3]}` | `object` |
| `bidfloor`    | optional           | bid floor price                           | `1.01`             | `float`  |

The following banner parameters are supported:

{: .table .table-bordered .table-striped }
| Name     | Scope    | Description                       | Example  | Type             |
|----------|----------|-----------------------------------|----------|------------------|
| `expdir` | optional | Directions the banner may expand. | `[1, 3]` | `Array[integer]` |

### Banner

#### `mediaTypes.banner` Parameters

The StackAdapt bid adapter requires `sizes` to be defined in valid format. 
See [mediaTypes.banner](https://docs.prebid.org/dev-docs/adunit-reference.html#adUnit.mediaTypes.banner) for defining mediaTypes parameters.

Below are banner ad unit examples with required and optional parameters:

```js
    var adUnits = [
            // Banner adUnit - required parameters
            {
                code: 'div-test-ad-1',
                mediaTypes: {
                    banner: {
                        sizes: [[300, 250]]
                    }
                },
                bids: [{
                    bidder: 'stackadapt',
                    params: {
                        publisherId: '4cd53a92ra91',
                        supplyId: '9891',
                    }
                }]
            },
            // Banner adUnit - including optional parameters
            {
                code: 'div-test-ad-2',
                mediaTypes: {
                    banner: {
                        sizes: [[300, 250]],
                        pos: 1
                    }
                },
                bids: [{
                    bidder: 'stackadapt',
                    params: {
                        publisherId: '4cd53a92ra91',
                        supplyId: '9891',
                        placementId: 'e95365f397a7',
                        bidfloor: 1.01,
                        banner: {
                            expdir: [1, 3]
                        }
                    }
                }]
            }
        ];
```

### Video

#### `mediaTypes.video` Parameters

The StackAdapt bid adapter requires `mimes`, `protocols`, `maxduration`, `api`, and `plcmt` to be defined in valid format.
See [mediaTypes.video](https://docs.prebid.org/dev-docs/adunit-reference.html#adUnit.mediaTypes.video) for defining mediaTypes parameters.

Below are video ad unit examples with required and optional parameters:

```js
    var adUnits = [
            // Video adUnit - required parameters
            {
                code: 'div-test-ad-3',
                mediaTypes: {
                    video: {
                        mimes: ['video/mp4'],
                        protocols: [2, 3, 5, 6],
                        maxduration: 60,
                        api: [1, 2],
                        plcmt: 1
                    }
                },
                bids: [{
                    bidder: 'stackadapt',
                    params: {
                        publisherId: '4cd53a92ra91',
                        supplyId: '9891',
                    }
                }]
            },
            // Video adUnit - including optional parameters
            {
                code: 'div-test-ad-4',
                mediaTypes: {
                    video: {
                        playerSize: [640, 360],
                        mimes: ['video/mp4'],
                        protocols: [2, 3, 5, 6],
                        minduration: 1,
                        maxduration: 60,
                        api: [1, 2],
                        playback_method: [1],
                        plcmt: 1,
                        startdelay: 1,
                        pos: 1,
                        minbitrate: 300,
                        maxbitrate: 1500,
                        skip: 1,
                        skipmin: 5,
                        skipafter: 15
                    }
                },
                bids: [{
                    bidder: 'stackadapt',
                    params: {
                        publisherId: '4cd53a92ra91',
                        supplyId: '9891',
                        placementId: 'e95365f397a7',
                        bidfloor: 1.01,
                    }
                }]
            }
        ];
```

### Native

#### `mediaTypes.native` Parameters

The StackAdapt bid adapter requires `request` to be defined with a valid native request payload containing `assets`.
The `request` field is a JSON-encoded string following the [OpenRTB Native Ads Specification](https://www.iab.com/wp-content/uploads/2018/03/OpenRTB-Native-Ads-Specification-Final-1.2.pdf). Each asset in the request must include at least one image (type 3 for main image) or video asset.
See [mediaTypes.native](https://docs.prebid.org/dev-docs/adunit-reference.html#adUnit.mediaTypes.native) for defining mediaTypes parameters.

Below are native ad unit examples with required and optional parameters:

```js
    var adUnits = [
            // Native adUnit - required parameters
            {
                code: 'div-test-ad-5',
                mediaTypes: {
                    native: {
                        ortb: {
                            ver: '1.1',
                            assets: [
                                {
                                    id: 1,
                                    required: 1,
                                    img: {
                                        type: 3,
                                        w: 1200,
                                        h: 627
                                    }
                                }
                            ]
                        }
                    }
                },
                bids: [{
                    bidder: 'stackadapt',
                    params: {
                        publisherId: '4cd53a92ra91',
                        supplyId: '9891',
                    }
                }]
            },
            // Native adUnit - including optional parameters
            {
                code: 'div-test-ad-6',
                mediaTypes: {
                    native: {
                        ortb: {
                            ver: '1.1',
                            assets: [
                                {
                                    id: 1,
                                    required: 1,
                                    title: {
                                        len: 90
                                    }
                                },
                                {
                                    id: 2,
                                    required: 0,
                                    data: {
                                        type: 2,
                                        len: 140
                                    }
                                },
                                {
                                    id: 3,
                                    required: 1,
                                    img: {
                                        type: 3,
                                        w: 1200,
                                        h: 627
                                    }
                                }
                            ]
                        }
                    }
                },
                bids: [{
                    bidder: 'stackadapt',
                    params: {
                        publisherId: '4cd53a92ra91',
                        supplyId: '9891',
                        placementId: 'e95365f397a7',
                        bidfloor: 1.01,
                    }
                }]
            }
        ];
```

### Audio

#### `mediaTypes.audio` Parameters

The StackAdapt bid adapter requires `mimes` and `protocols` to be defined in valid format.
See [mediaTypes.audio](https://docs.prebid.org/dev-docs/adunit-reference.html#adUnit.mediaTypes.audio) for defining mediaTypes parameters.

Below are audio ad unit examples with required and optional parameters:

```js
    var adUnits = [
            // Audio adUnit - required parameters
            {
                code: 'div-test-ad-7',
                mediaTypes: {
                    audio: {
                        mimes: ['audio/mp4', 'audio/mpeg'],
                        protocols: [2, 3, 5, 6]
                    }
                },
                bids: [{
                    bidder: 'stackadapt',
                    params: {
                        publisherId: '4cd53a92ra91',
                        supplyId: '9891',
                    }
                }]
            },
            // Audio adUnit - including optional parameters
            {
                code: 'div-test-ad-8',
                mediaTypes: {
                    audio: {
                        mimes: ['audio/mp4', 'audio/mpeg', 'audio/ogg'],
                        protocols: [2, 3, 5, 6, 7, 8],
                        minduration: 5,
                        maxduration: 30,
                        startdelay: 0,
                        api: [1, 2]
                    }
                },
                bids: [{
                    bidder: 'stackadapt',
                    params: {
                        publisherId: '4cd53a92ra91',
                        supplyId: '9891',
                        placementId: 'e95365f397a7',
                        bidfloor: 1.01,
                    }
                }]
            }
        ];
```
