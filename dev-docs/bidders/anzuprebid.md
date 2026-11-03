---
layout: bidder
title: Anzu Prebid
description: Prebid Anzu Prebid Server Bidder Adapter
biddercode: anzuprebid
pbjs: false
pbs: true
pbs_app_supported: true
gvl_id: 733
tcfeu_supported: true
dsa_supported: false
usp_supported: true
coppa_supported: true
gpp_sids: tcfeu, usnat, usstate_all, usp
schain_supported: true
dchain_supported: false
userId: none
media_types: banner, video, native
deals_supported: true
floors_supported: true
fpd_supported: true
ortb_blocking_supported: true
multiformat_supported: will-bid-on-one
privacy_sandbox: no
prebid_member: false
sidebarType: 1
---

## Registration

The Anzu Prebid adapter requires setup before use. Contact [prebid@anzu.io](mailto:prebid@anzu.io) to get your zone and query string.

The adapter is available in Prebid Server only, for in-app traffic (banner, video and native). Site requests are not sent to Anzu.

## Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description                                                                                                                                                                              | Example     | Type     |
| ------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- | -------- |
| `zone`        | required | Which Anzu bid endpoint to call: `zone1` or `zone2`. Anzu tells you which one to use.                                                                                                    | `'zone1'`   | `string` |
| `queryString` | required | The query string for that zone, as provided by Anzu. Must contain only URL query characters, with no `#`, `;` or spaces, and be at most 2048 characters long. A leading `?` is optional. | `'pid=123'` | `string` |

Parameter names are case-sensitive.

Anzu's two zones are separate bid endpoints with different parameters, not geographic regions:

{: .table .table-bordered .table-striped }
| `zone`  | Typical `queryString`   |
| ------- | ----------------------- |
| `zone1` | `pid=<pid>`             |
| `zone2` | `c=rtb&m=req&key=<key>` |

The adapter appends `queryString` to the chosen zone's endpoint URL, which is fixed in Prebid Server's configuration. Requests for imps with the same `zone` and `queryString` are sent to Anzu together.

## Example

Prebid Mobile SDK publishers set these params in the impression-level stored request (the SDK's Config ID) on their Prebid Server:

```json
{
  "ext": {
    "prebid": {
      "bidder": {
        "anzuprebid": {
          "zone": "zone1",
          "queryString": "pid=123"
        }
      }
    }
  }
}
```

Publishers that call Prebid Server's `/openrtb2/auction` endpoint directly can put the same `anzuprebid` object in `imp[].ext.prebid.bidder`.

## First Party Data

The adapter forwards the full OpenRTB 2.6 request to Anzu without modification, so first-party data in `app`, `app.content`, `app.ext.data`, `user.data` and `user.ext.data` reaches Anzu's bid endpoints.
