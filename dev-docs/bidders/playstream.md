---
layout: bidder
title: Playstream Media
description: Prebid.js Playstream Media Bid Adapter
biddercode: playstream
pbjs: true
media_types: video, banner
multiformat_supported: will-bid-on-one
userIds: all
fpd_supported: true
tcfeu_supported: true
usp_supported: some
coppa_supported: some
schain_supported: true
prebid_member: false
ortb_blocking_supported: some
floors_supported: true
sidebarType: 1
---

## Description

**Playstream Media** Prebid.js adapter supports **banner** and **video** demand using an **OpenRTB 2.x** request/response flow.

The adapter sends a **POST** request to:

- `https://<host>/server/adserver/hb?adUnitId=<adUnitId>&publisherId=<publisherId>`

> Note: `host` should be a hostname only (no protocol, no path). The adapter uses HTTPS.
>
> Note: `getUserSyncs()` currently returns an empty array (no user sync pixels are triggered by this adapter).

## Bid Params

{: .table .table-bordered .table-striped }
| Name            | Scope    | Description                                                              | Example                        | Type     |
|:----------------|:---------|:-------------------------------------------------------------------------|:-------------------------------|:---------|
| `host`          | required | Playstream bidder host (hostname only; no protocol/path)                 | `'exchange.ortb.net'`          | `string` |
| `adUnitId`      | required | adUnit ID from Playstream Platform                                       | `'697871ac0ec1c6100e1f9121'`   | `string` |
| `publisherId`   | required | Publisher ID from Playstream Platform                                    | `'697871ac0ec1c6100e1f9122'`   | `string` |
| `type`          | required | Type of request: `'video'` or `'banner'`                                 | `'banner'`                     | `string` |
| `price`         | optional | Bid floor in `USD` only (defaults to Playstream dashboard configuration) | `0.5`                          | `number` |
| `ip`            | optional | User IP (targeting)                                                      | `'192.168.1.1'`                | `string` |
| `latitude`      | optional | User latitude (targeting)                                                | `23.21`                        | `number` |
| `longitude`     | optional | User longitude (targeting)                                               | `-23.21`                       | `number` |
| `maxAdDuration` | optional | Max ad pod duration (seconds)                                            | `120`                          | `number` |
| `maxSlotPerPod` | optional | Max ad slots per pod                                                     | `3`                            | `number` |
| `gdpr`          | optional | GDPR flag (`0` or `1`)                                                   | `0`                            | `number` |
| `consent`       | optional | GDPR consent string (tcString)                                           | `''`                           | `string` |

## Required Params

Playstream Media client-side Prebid.js adapter requires only:

- `host`
- `adUnitId`
- `publisherId`
- `type`

## Supported Media Types

This adapter supports only:

- `banner`
- `video`

It does **not** support `native` or `audio`.

## First Party Data and User IDs

- **FPD (First Party Data):** When available, the adapter forwards `bidderRequest.ortb2` and impression-level `bidRequest.ortb2Imp` into the OpenRTB request (`site/app/user/device/regs/ext`).
- **User IDs:** If your Prebid build includes User ID modules, their EIDs typically appear under `ortb2.user.ext.eids` and are forwarded in the OpenRTB request.

## Privacy Support Notes

- **TCF-EU (GDPR):** If Prebid populates consent into `ortb2.regs` / `ortb2.user.ext.consent`, the adapter forwards it. Optional `gdpr`/`consent` bidder params can be used as overrides if you support them server-side.
- **USP/CCPA & COPPA:** If these signals are present in `ortb2.regs` (or related fields), they will be forwarded as part of the OpenRTB request.

## schain Support

If the `schain` module is enabled in Prebid, the adapter forwards supply chain information in the OpenRTB request (typically `source.ext.schain`).

## Sample Bids

### Display

Replace the values below with the Host / Ad Unit ID / Publisher ID shared by the Admin/Support team. Do not use the sample IDs in production.

```javascript
var adUnits = [
    {
        code: 'div-1',
        mediaTypes: {
            banner: { 
                sizes: [[300, 250], [728, 90]]
            }
        },
        sizes: [[300, 250], [728, 90]],
        bids: [{
            bidder: 'playstream',
            params: {
                host: 'asia-southeast.ortb.net',            // Provided by Admin/Support team
                adUnitId: '697871ac0ec1c6100e1f9121',       // Provided by Admin/Support team
                publisherId: '697871ac0ec1c6100e1f9122',    // Provided by Admin/Support team
                type: 'banner',
            }
        }]
    }
];
```

### Video

Replace the values below with the Host / Ad Unit ID / Publisher ID shared by the Admin/Support team. Do not use the sample IDs in production.

```javascript
var adUnits = [
    {
        code: 'div-2',
        mediaTypes: {
            video: {
                context: 'instream',
                playerSize: [640, 360]
            }
        },
        sizes: [640, 360],
        bids: [{
            bidder: 'playstream',
            params: {
                host: 'asia-southeast.ortb.net',            // Provided by Admin/Support team
                adUnitId: '697871ac0ec1c6100e1f9121',       // Provided by Admin/Support team
                publisherId: '697871ac0ec1c6100e1f9122',    // Provided by Admin/Support team
                type: 'video',
                price: 0.4
            }
        }]
    }
];
```
