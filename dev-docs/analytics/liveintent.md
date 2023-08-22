---
layout: analytics
title: LiveIntent
description: LiveIntent Analytics Adapter
modulecode: liveintent
prebid_member: true
gvl_id: 148
---

#### Registration

Please visit [LiveIntent](https://www.liveintent.com/) for more information.

#### Example Configuration

```
pbjs.enableAnalytics(
  {
    provider: 'liveintent',
    options: {
      bidWonTimeout: 2000,
      sampling: 0.5 // the tracked event percentage, a number between 0 and 1.
    }
  }
)
```
