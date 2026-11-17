---
layout: analytics
title: PubWise
description: PubWise Analytics Adapter
modulecode: pubwise
prebid_member: true
---

## Registration

Please visit [www.pubwise.io](https://www.pubwise.io/) for more information. PubWise provides the site ID.

## Configuration

```js
pbjs.enableAnalytics({
  provider: 'pubwise',
  options: {
    site: 'b1ccf317-a6fc-428d-ba69-0c9c208aa61c',
    custom: {
      c_slot1: 'homepage'
    }
  }
});
```

{: .table .table-bordered .table-striped }

| Name | Scope | Type | Description |
| --- | --- | --- | --- |
| `site` | required | string | PubWise site ID. Not validated; defaults to `''`. |
| `endpoint` | optional | string | Collection URL. Defaults to `https://api.pubwise.io/api/v5/event/add/`. |
| `debug` | optional | boolean | Flags events as debug traffic. Defaults to the Prebid `debug` setting. |
| `custom` | optional | object | Custom segments added to each payload. Supported keys: `c_script_type`, `c_host`, `c_slot1`, `c_slot2`, `c_slot3`, `c_slot4` (strings). Other keys are ignored. |

## Data Collected

The adapter records `auctionInit`, `bidRequested`, `bidResponse`, `bidWon`, `bidTimeout`, `adRenderFailed` and `tcf2Enforcement`. Bid responses are sent without `ad`, `adUrl` and `adserverTargeting`.

Events are batched with page metadata (site, session ID, Prebid version, `window.PREBID_TIMEOUT`, UTM parameters, custom segments) and sent as a JSON POST to `endpoint` on `auctionEnd`, `bidWon`, and every 100 ms while events are pending.

The adapter uses local storage for a session ID (`pubwise_sess_id`, `pubwise_sess_timeout`; 30-minute inactivity timeout) and for the `utm_*` query parameters (`pubwise_utm_*`), which are kept until the session expires.
