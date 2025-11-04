---
layout: api_prebidjs
title: pbjs.registerSignalSources()
description: enabling ESP (encrypt signals) for Open Bidding
sidebarType: 1
---

{: .alert.alert-info :}
To use this function, include the [UserId module](/dev-docs/modules/userId.html) in your Prebid.js build.

This function will register all configured encrypted signals as described in the [UserId module ESP configuration](/dev-docs/modules/userId.html#esp-configurations).

The condition can only be called under two conditions

1. The `pbjs.setConfig` call with the user sync config must have already happend
2. The `gpt.js` tag must already be loaded

Example

```js
// initialze command queues
window.pbjs = window.pbjs || { que: []};
window.googletag = window.googletag || { cmd: []};

// wait for prebid and configure it
const prebidConfigured = new Promise(resolve => window.pbjs.que.push(resolve))
  .then(() => window.pbjs.setConfig(/* your prebid config */));

// wait for gpt.js
const gptLoaded = new Promise(resolve => window.googletag.cmd.push(resolve));

// wait for gpt and prebid to be loaded and configured
Promise.all([prebidConfigured, gptLoaded])
  .then(() => window.pbjs.registerSignalSources());
```
