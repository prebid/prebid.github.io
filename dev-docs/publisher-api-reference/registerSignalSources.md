---
layout: api_prebidjs
title: pbjs.registerSignalSources()
description: enabling ESP (encrypt signals) for Open Bidding
sidebarType: 1
---

{: .alert.alert-info :}
To use this function, include the [UserId module](/dev-docs/modules/userId.html) in your Prebid.js build.

This function registers each source in `userSync.encryptedSignalSources` with GPT as a secure signal provider, as described in the [UserId module ESP configuration](/dev-docs/modules/userId.html#esp-configurations). The signal for each source is produced by [`pbjs.getEncryptedEidsForSource()`](/dev-docs/publisher-api-reference/getEncryptedEidsForSource.html) when GPT collects it.

Only call this function once both of these are true:

1. `pbjs.setConfig` has already been called with the user sync config. Without `encryptedSignalSources`, a warning is logged and nothing is registered.
2. `gpt.js` has already loaded. Otherwise, the call does nothing and doesn't log a message.

Registration happens after `encryptedSignalSources.registerDelay` milliseconds (0 by default).

Example

```js
// initialize command queues
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
