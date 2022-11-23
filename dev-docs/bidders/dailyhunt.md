---
layout: bidder
title: Dailyhunt
description: Prebid Dailyhunt Bidder Adaptor
pbjs: true
biddercode: dailyhunt
media_types: display, native, video
gdpr_supported: true
enable_download: false
pbjs_version_notes: not ported to 5.x
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name | Scope    | Description | Example | Type |
|------|----------|-------------|---------|------|
| `placement_id` | required | Serving ads based on placement_id. Contact Dailyhunt for placement_id. | `1` | `int` |
| `publisher_id` | required | Serving ads based on publisher_id. Contact Dailyhunt for publisher_id. | `1` | `int` |
| `partner_name` | required | Serving ads based on partner_name. Contact Dailyhunt for partner_name. | `dailyhunt` | `string` |
| `test_mode` | optional | Serving test mode campaign only. | `true` | `bool` |
| `bidfloor` | optional | Minimum bid for this bid expressed in CPM. | `1.4` | `float` |
| `video` | optional | A Video object required if this bid is offered as a video ad opportunity. It is ortb video object. | `video: { w: 640, h: 480, mimes: ["video/mp4"] }` | `object` |
|`site` | optional | Details about the publisher’s website. It is ortb site object. | `site:{id:"102855",cat:["IAB3-1"],domain:"http://m.dailyhunt.in",page:"http://m.dailyhunt.in/1234.html "}` | `object` |
| `device` | optional | Details about the user’s device to which the impression will be delivered. It is ortb device object. | `device: { ip: "64.124.253.1", os: "OS X", ua: "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10.6; en-US; rv:1.9.2.16)  }` | `object` |
| `user` | optional | Details about the human user of the device; the advertising audience. It is ortb user object. | `user: { id: "456789876567897654678987656789", gender: "M", gender: 1990, keywords: "marketing,traveling,reading" }` | `object` |
| `publisher` | optional | Details about the Publisher of the site. It is ortb publisher object. | `publisher: { id: "8953", name: "dailyhunt", "cat": [ "IAB3-1" ], "domain": "m.dailyhunt.in" }` | `object` |

**Notes: The `video`, `site`, `device`, `user`, `publisher` objects are all ORTB objects. Please refer to the [ORTB documentation](https://www.iab.com/wp-content/uploads/2016/03/OpenRTB-API-Specification-Version-2-5-FINAL.pdf) for additional details.**

### Test Parameters
```
    var adUnits = [
        {
            code: '/83414793/prebid_test_display',
            sizes: [[300, 250], [320, 50]],
            mediaTypes: {
                banner : {
                    sizes: [[300, 250], [320, 50]],
                }
            },
            bids: [
                {
                    bidder: 'dailyhunt',
                    params: {
                        placement_id: 1,
                        publisher_id: 1,
                        partner_name: 'dailyhunt',
                        device: {
                            ip: "182.23.143.212"
                        }
                    }
                }
            ]
        },
        {
            code: '/83414793/prebid_test_native',
            sizes: [[300, 250]],
            mediaTypes: {
                native: {
                    title: {
                        required: true
                    },
                    body: {
                        required: true
                    },
                    image: {
                        required: true
                    },
                    cta: {
                        required: true
                    }
                }
            },
            bids: [
                {
                    bidder: 'dailyhunt',
                    params: {
                        placement_id: 1,
                        publisher_id: 1,
                        partner_name: 'dailyhunt',
                        device: {
                            ip: "182.23.143.212"
                        }
                    }
                }
            ]
        },
        {
            code: '/83414793/prebid_test_video',
            mediaTypes: {
                video: {
                    playerSize: [1280, 720],
                    context: 'instream'
                }
            },
            bids: [
                {
                    bidder: 'dailyhunt',
                    params: {
                        placement_id: 1,
                        publisher_id: 1,
                        partner_name: 'dailyhunt',
                        device: {
                            ip: "182.23.143.212"
                        },
                        video: {
                            mimes: [
                                'video/mp4'
                            ]
                        }
                    }
                }
            ]
        }
    ];
```
