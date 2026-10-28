---
layout: analytics
title: DataBlocks
description: DataBlocks Analytics Adapter
modulecode: datablocks
prebid_member: true
---

## Registration

Please visit [datablocks.net/](https://datablocks.net/) for more information.

## Configuration

This is a bundle-type adapter: it forwards Prebid events to a `window.datablocksAnalytics` function, which must be defined by the DataBlocks script before analytics is enabled.

```javascript
pbjs.enableAnalytics({
  provider: 'datablocks'
});
```

The adapter does not read any adapter-specific options; the `publisherId`, `sourceId` and `host` options shown in the module's readme are not used by the adapter code.

## Collected Data

Every Prebid event (except `auctionDebug`) is passed as `datablocksAnalytics('on', eventType, args)`. The adapter makes no network requests itself; collection and transport are handled by the DataBlocks script.
