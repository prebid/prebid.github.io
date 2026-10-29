---
layout: analytics
title: Adkernel
description: Adkernel Analytics Adapter
modulecode: adkernelAdn
tcfeu_supported: true
usp_supported: true
coppa_supported: true
prebid_member: false
gvl_id: 14
---

## Registration

Please visit [adkernel.com/dsp-suite/](https://adkernel.com/dsp-suite/) for more information. A publisher ID provided by Adkernel is required.

## Configuration

```javascript
pbjs.enableAnalytics({
  provider: 'adkernelAdn',
  options: {
    pubId: 50357
  }
});
```

{: .table .table-bordered .table-striped }
| Name | Scope | Type | Description |
| --- | --- | --- | --- |
| `pubId` | required | `number` or `string` | Publisher ID provided by Adkernel. If missing, the adapter logs an error and is not enabled. |
| `host` | optional | `string` | Collection host name, without protocol. Default: `tag.adkernel.com`. |
| `queueTimeout` | optional | `number` | Milliseconds of event inactivity after which queued events are sent. Default: `4000`. |

## Data Collected

The adapter listens to `auctionInit`, `bidRequested`, `bidResponse`, `bidTimeout`, `bidWon` and `auctionEnd`, recording bidder code, ad unit code, CPM and response/auction times. Events are queued and sent as one JSON payload at `auctionEnd`, or once `queueTimeout` elapses with no new events (for example, a later `bidWon`).

Each payload also includes the page domain and path, screen size, browser language, GDPR/USP consent strings, the COPPA flag, and a traffic source derived from UTM parameters and the referrer. The traffic source is persisted in local storage under `adk_dpt_analytics`.

Data is sent by ajax POST to `https://<host>/hb-analytics`.
