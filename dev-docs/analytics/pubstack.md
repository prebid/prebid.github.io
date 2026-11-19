---
layout: analytics
title: PubStack
description: PubStack Analytics Adapter
modulecode: pubstack
prebid_member: true
---

## Registration

Please visit [pubstack.io/?source=prebid.org-analytics](https://pubstack.io/?source=prebid.org-analytics) for more information.

## Configuration

The Pubstack tag, which defines `window.PubstackAnalytics`, must be on the page.

```js
pbjs.enableAnalytics({
  provider: 'pubstack'
});
```

The adapter has no options.

## Data Collected

This is a bundle adapter: it forwards every Prebid event and its arguments to `window.PubstackAnalytics('on', eventType, args)`. The Pubstack tag handles collection and transport.
