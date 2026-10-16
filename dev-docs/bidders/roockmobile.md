---
layout: bidder
title: Roockmobile
description: Roockmobile bidder adapter
biddercode: roockmobile
media_types: banner, video, native
pbjs: true
pbs: false
gvl_id: none
multiformat_supported: will-bid-on-any
privacy_sandbox: no
sidebarType: 1
---

## Note

The Roockmobile bidder adapter requires an assigned channel identifier, token, and placement identifier. Contact <qun.ma@roockmobile.com> for setup.

Bid requests use OpenRTB 2.5. The optional `domain` parameter may select an HTTPS Roockmobile-controlled origin; request paths remain fixed as `/pbjs` for bids and `/usersync` for user sync.

Each impression requires a `tagid`. Publishers may provide it through the standard `ortb2Imp.tagid` field; bidder parameter `tagid` overrides that value when present.

For integration testing or Prebid review, set numeric `test: 1`. This sends OpenRTB root field `test: 1`. Omit the bidder parameter in production, where normal requests carry `test: 0`.

## Bid Params

{: .table .table-bordered .table-striped }

| Name | Scope | Description | Example | Type |
| --- | --- | --- | --- | --- |
| `mid` | required | Roockmobile channel identifier. | `'YOUR_MID'` | `string` |
| `token` | required | Roockmobile authentication token. | `'YOUR_TOKEN'` | `string` |
| `tagid` | optional | Overrides the standard `ortb2Imp.tagid` placement identifier; sent as `imp[].tagid`. | `'YOUR_TAGID'` | `string` |
| `test` | optional | Set to numeric `1` only for test and review traffic. | `1` | `number` |
| `domain` | optional | HTTPS origin under `rmcdnnode.com` or `roockmobile.com`; paths remain fixed. | `'https://test.rmcdnnode.com'` | `string` |

## Test Parameters

The following credentials are reserved for integration testing and Prebid review. Numeric `test: 1` requests test creatives.

```javascript
{
  bidder: 'roockmobile',
  params: {
    mid: '2299',
    token: 'd8b92f59d593c760edba95de3ee35e30',
    tagid: '210091',
    test: 1
  }
}
```

## Banner Example

```javascript
{
  bidder: 'roockmobile',
  params: {
    mid: 'YOUR_MID',
    token: 'YOUR_TOKEN',
    tagid: 'YOUR_TAGID'
  }
}
```

## Video Example

Declare video properties under `mediaTypes.video`. The adapter forwards the standard OpenRTB video fields and accepts VAST XML in `bid.adm`.

```javascript
{
  code: 'roockmobile-video',
  mediaTypes: {
    video: {
      context: 'instream',
      mimes: ['video/mp4'],
      playerSize: [[640, 360]],
      minduration: 5,
      maxduration: 30,
      protocols: [2, 3, 5, 6],
      playbackmethod: [2]
    }
  },
  bids: [{
    bidder: 'roockmobile',
    params: {
      mid: 'YOUR_MID',
      token: 'YOUR_TOKEN',
      tagid: 'YOUR_VIDEO_TAGID'
    }
  }]
}
```

## Native Example

```javascript
{
  code: 'roockmobile-native',
  mediaTypes: {
    native: {
      title: { required: true },
      image: { required: true },
      sponsoredBy: { required: false }
    }
  },
  bids: [{
    bidder: 'roockmobile',
    params: {
      mid: 'YOUR_MID',
      token: 'YOUR_TOKEN',
      tagid: 'YOUR_NATIVE_TAGID'
    }
  }]
}
```

## User Sync

Roockmobile uses Prebid's standard user-sync registration. The adapter prefers iframe sync when the publisher permits it and otherwise uses image sync when enabled.
