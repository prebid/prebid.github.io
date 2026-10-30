---
layout: analytics
title: PubPerf
description: PubPerf Analytics Adapter
modulecode: pubperf
enable_download: false
---

## Registration

Please visit [http://www.pubperf.com/](http://www.pubperf.com/) for more information. Contact `support@transfon.com` to sign up and get your Pubperf tag.

## Configuration

The Pubperf tag, which defines `window.pubperf_pbjs`, must be on the page before `enableAnalytics` is called; otherwise the adapter logs an error and stays disabled.

```js
pbjs.enableAnalytics({
  provider: 'pubperf'
});
```

The adapter has no options.

## Data Collected

This is a bundle adapter: it forwards every Prebid event and its arguments to `window.pubperf_pbjs('on', eventType, args)`. The Pubperf tag handles collection and transport.
