---
layout: api_prebidjs
title: pbjs.removeUserSyncs(options)
description: removeUserSyncs API
sidebarType: 1
---

Since Prebid.js 11.30, removes the user sync iframes that were inserted by this Prebid instance,
and returns how many iframes got removed.
Iframes belonging to other instances running on the same page are left alone.

User sync iframes are appended to the page's `<html>` element and never cleaned up, so in a single page application they keep accumulating for as long as the user stays on the page without a reload.
Calling this method on navigation in a single page application would clean those up.

Removal is a pure DOM cleanup.
Syncs registered afterwards insert new iframes as usual and the call can be repeated on every route change.
Image pixels are unaffected, they never enter the DOM.

**Kind**: static method of `pbjs`.

{: .table .table-bordered .table-striped }
| Param | Scope | Type | Description |
| --- | --- | --- | --- |
| options | Optional | `object` | Options (listed below). Without them, every sync iframe of this instance is removed. |
| options.withChildFrames | Optional | `boolean` | If `true`, only remove the sync iframes that have created frames of their own. Since Prebid.js 11.47. |

## Removing sync frames that fan out

Some sync iframes load partner sync frames, which load more of their own. A single sync can grow into hundreds of hidden nested frames, each costing memory, a browser process and main thread time, and they stay until the user leaves the page.

`withChildFrames: true` removes only those sync iframes: the ones whose window contains frames (`iframe.contentWindow.length > 0`, which Prebid.js can read even when the sync page is on another origin). Simple syncs are left in place, and a later call without options can still remove them.

## Automatic removal

Since Prebid.js 11.47, Prebid.js can also remove sync iframes on its own, including those requested by Prebid Server's cookie sync. Turn it on with [`userSync.removeIframes`](/dev-docs/publisher-api-reference/setConfig.html#setConfig-ConfigureUserSyncing-UserSyncProperties). With `removeIframes: true`, each sync iframe is removed, timed from when it loads:

* after 3 seconds, if it has created frames of its own, with a warning in the console naming the sync URL;
* after 15 seconds, regardless.

```javascript
pbjs.setConfig({ userSync: { removeIframes: true } });
```

It is off by default in Prebid.js 11. `removeUserSyncs` is still useful to remove sync iframes right away, for example on navigation in a single page application.

**Example**

```javascript
const removedFramesCount = pbjs.removeUserSyncs();
```
