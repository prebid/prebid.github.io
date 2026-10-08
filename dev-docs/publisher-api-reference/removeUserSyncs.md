---
layout: api_prebidjs
title: pbjs.removeUserSyncs()
description: removeUserSyncs API
sidebarType: 1
---

Removes the user sync iframes that were inserted by this Prebid instance,
and returns how many iframes got removed.
Iframes belonging to other instances running on the same page are left alone.

User sync iframes are appended to and never cleaned up, so in a single page application they keep accumulating for as long as the user stays on the page without a reload.
Calling this method on navigation in a single page application would clean those up.

Removal is a pure DOM cleanup.
Syncs registered afterwards insert new iframes as usual and the call can be repeated on every route change.
Image pixels are unaffected, they never enter the DOM.

**Kind**: static method of `pbjs`.

**Example**

```javascript
const removedFramesCount = pbjs.removeUserSyncs();
```
