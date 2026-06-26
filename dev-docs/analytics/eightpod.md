---
layout: analytics
title: 8pod
description: 8pod Analytics Adapter
modulecode: eightpodAnalyticsAdapter
tcfeu_supported: false
usp_supported: false
coppa_supported: false
prebid_member: false
gvl_id: none
enable_download: false
---

## Configuration

```javascript
pbjs.enableAnalytics({
  provider: 'eightpod'
});
```

Use the lowercase provider code `eightpod` to match adapter registration.

### Disclosure
The adapter subscribes to events from 8pod's ad unit when the bidWon event fires for each ad slot and sends supported ad unit events to Tealium from the rendered ad frame.


