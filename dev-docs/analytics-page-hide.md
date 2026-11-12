---
layout: page_v2
title: Sending Analytics Events When the Page Is Hidden
description: How Prebid.js analytics adapters can send queued events before the page is unloaded
top_nav_section: dev_docs
nav_section: adapters
sidebarType: 1
---

# Sending Analytics Events When the Page Is Hidden

{:.no_toc}

Since Prebid.js 11.50, an analytics adapter can opt in to receive the events still waiting in its queue when the page is hidden or unloaded, and send them before the page goes away. This guide is for analytics adapter maintainers: it explains why events are lost today, how the opt-in works, the rules an adapter must follow to opt in safely, and how to migrate and test common adapter designs.

* TOC
{:toc}

## Why events are lost

Prebid.js does not call an adapter's `track` function as soon as an event is emitted. The [base analytics adapter](/dev-docs/integrate-with-the-prebid-analytics-api.html) queues events and passes them to `track` after a 100 ms debounce. Many adapters then hold events longer, for example to send a batch at auction end or on a timer.

When the page goes away before those timers fire, the events are lost. This happens when:

* the user clicks an ad that navigates the same tab (`target="_top"`), so the `bidClick` emitted for the click is still in the queue when the page unloads;
* the user follows a link, reloads or closes the tab shortly after an auction, losing `bidWon` events or an auction-end batch;
* a mobile user switches apps; the browser may later discard the page without running any more JavaScript.

Requests started with plain `XMLHttpRequest` or `fetch`, and image pixels, are usually cancelled when the page unloads, so events sent that way at the last moment are lost too.

### Which browser events to use

* [`visibilitychange`](https://developer.mozilla.org/en-US/docs/Web/API/Document/visibilitychange_event) to `hidden` fires when the user switches tabs or apps, minimizes the window, or navigates away. On mobile it is often the last event a page receives, because a backgrounded page can be discarded without further notice.
* [`pagehide`](https://developer.mozilla.org/en-US/docs/Web/API/Window/pagehide_event) fires when the page is unloaded or enters the back/forward cache. Some browsers, notably older Safari versions, don't fire `visibilitychange` when the page is unloaded.
* `unload` and `beforeunload` are unreliable, especially on mobile, and an `unload` listener can keep the page out of the [back/forward cache](https://web.dev/articles/bfcache). Don't use them; see [Deprecating the unload event](https://developer.chrome.com/docs/web-platform/deprecating-unload).

Listening to both `pagehide` and `visibilitychange` covers all current browsers, as recommended by the [Page Lifecycle API](https://developer.chrome.com/docs/web-platform/page-lifecycle-api) guide. A page that becomes hidden can also become visible again, or be restored from the back/forward cache, so these events can fire more than once per page view.

## How the opt-in works

An adapter opts in by passing `flushOnPageHide: true` to the base adapter, and can add an `onPageHide` function:

```javascript
import adapter from '../libraries/analyticsAdapter/AnalyticsAdapter.js';
import adapterManager from '../src/adapterManager.js';

const exAnalytics = Object.assign(adapter({url, analyticsType: 'endpoint', flushOnPageHide: true}), {
  track({eventType, args}) {
    // called for every queued event, synchronously when the page is hidden
  },
  onPageHide() {
    // optional: called after the queued events have been passed to track;
    // send anything the adapter is still holding, such as an incomplete batch
  }
});

adapterManager.registerAnalyticsAdapter({adapter: exAnalytics, code: 'exAnalytic'});
```

With `flushOnPageHide: true`:

* When the adapter is enabled with `pbjs.enableAnalytics` and the session is sampled in (see the `sampling` option), the base adapter adds a `pagehide` listener on `window` and a `visibilitychange` listener on `document`. Sampled-out adapters get no listeners.
* On `pagehide`, or on `visibilitychange` when `document.visibilityState` is `hidden`, the base adapter cancels the debounce timer and passes every queued event to `track`, synchronously, inside the browser event.
* It then calls the adapter's `onPageHide`, if there is one. `onPageHide` is called on every page hide, even when the queue was empty. Errors it throws are logged and don't affect other listeners.
* After that, events are queued and debounced as usual, so an adapter keeps working if the page becomes visible again.
* `disableAnalytics` removes the listeners and discards queued events, as before.

Adapters that don't set `flushOnPageHide` behave as before: queued events are passed to `track` only when the debounce timer fires, which may be never.

The base adapter looks up `onPageHide` on the adapter object when the page is hidden, so it can be defined with `Object.assign` as above or added later. If your adapter overrides `enableAnalytics`, call the base version with the adapter as `this` (for example `adapter.originEnableAnalytics(config)` or `baseEnable.call(this, config)`), as the base adapter already requires.

## Rules for opting in

Opt in only if all of the following hold. Otherwise the opt-in either gains nothing or wastes the little time the page has left.

1. **Send synchronously.** Everything `track` and `onPageHide` do before the request starts must run inside the event handler. Don't wait for promises (`await`, `.then`), timers, `requestIdleCallback`, `CompressionStream`, WebCrypto (`crypto.subtle`), or scripts that are still loading. Some browsers (Firefox, at least) drop a request that is started after the handler returns, even in a promise callback.
2. **Use a transport that survives unload.** Send with one of:
   * Prebid's `ajax` with the `keepalive` option, and a string body: `ajax(url, null, JSON.stringify(payload), {method: 'POST', keepalive: true})`. Since Prebid.js 11.50, `ajax` and Prebid's `fetch` start a `keepalive` request synchronously when the body is a string or empty. With other body types (such as `Blob`, `FormData` or `ArrayBuffer`) Prebid.js still reads the body asynchronously to check its size, so the request may start too late.
   * `sendBeacon(url, data)` from `src/ajax.js`, a wrapper around [`navigator.sendBeacon`](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/sendBeacon). It sends a `POST` and returns `false` if the browser refuses the data; fall back to `ajax` with `keepalive`, not to a plain request.
3. **No plain XHR, `fetch` without `keepalive`, or image pixels.** They are usually cancelled when the page unloads. To replace a pixel, use `ajax(url, null, null, {method: 'GET', keepalive: true})` or `sendBeacon`.
4. **Keep payloads small.** Browsers limit the total size of in-flight `keepalive` and beacon requests to about 64 KB per page. Prebid's `ajax` drops `keepalive` from a request whose body exceeds 64 KB, which makes it an ordinary request that is likely cancelled, and `sendBeacon` returns `false`. Send only what's pending, trim fields, or split large batches.
5. **Don't rely on the response.** Callbacks may never run once the page is gone, so retries, cookie updates or follow-up requests that depend on the response won't happen.
6. **Keep `track` cheap.** It may run for many queued events in a row while the page is going away. Avoid serializing every event's full `args` for logging, or other heavy work, in `track`.
7. **Expect repeated calls.** `onPageHide` runs each time the page is hidden, and the page may come back. Send only what is pending, and don't tear down the adapter's state.
8. **Prefer a CORS-safelisted content type.** Prebid's `ajax` sends `text/plain` by default, which avoids a CORS preflight request before the data is sent.

## Migrating an adapter

Find the pattern that matches your adapter in the [adapter status table](#adapter-status), then:

1. Check that `track` meets the [rules](#rules-for-opting-in), or change it so it does.
2. Add `flushOnPageHide: true` to the `adapter({...})` call.
3. If the adapter holds events after `track`, send them in `onPageHide`.
4. Remove any page-hide workarounds the opt-in replaces.
5. Add unit tests (see [Testing](#testing)) and check a same-tab click in a browser.
6. Open a pull request on [Prebid.js](https://github.com/prebid/Prebid.js), and mention in it that the adapter now sends events on page hide.

### Pattern A: the adapter has its own page-hide listener

Some adapters already buffer events and send them with `sendBeacon` from their own `pagehide` or `visibilitychange` listener. Those listeners are registered before the base adapter's, so they run first and send before the base adapter has passed the last queued events (such as a `bidClick`) to `track`. Some adapters work around this by changing the debounce delay to drain the queue themselves.

Before:

```javascript
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') {
    sendBuffered(); // runs before the base adapter's queue is passed to track
  }
});

const exAnalytics = Object.assign(adapter({analyticsType: 'endpoint'}), {track});
```

After:

```javascript
const exAnalytics = Object.assign(adapter({analyticsType: 'endpoint', flushOnPageHide: true}), {
  track,
  onPageHide() {
    sendBuffered(); // runs after every queued event has been passed to track
  }
});
```

Remove the adapter's own listeners, the code that removes them in `disableAnalytics`, and any queue-draining workarounds such as `setDebounceDelay(0)`.

### Pattern B: the adapter batches events on a timer

If `track` adds events to a batch that is sent at auction end, after a delay or when it's full, send the incomplete batch from `onPageHide`. The [generic analytics adapter](/dev-docs/modules/genericAnalyticsAdapter.html) does this; see `modules/genericAnalyticsAdapter.ts`.

Before:

```javascript
let batch = [];
let timer = null;

function sendBatch() {
  clearTimeout(timer);
  timer = null;
  ajax(url, null, JSON.stringify(batch), {method: 'POST'});
  batch = [];
}

const exAnalytics = Object.assign(adapter({analyticsType: 'endpoint'}), {
  track({eventType, args}) {
    batch.push({eventType, args: pick(args, FIELDS)});
    if (timer == null) timer = setTimeout(sendBatch, 1000);
  }
});
```

After:

```javascript
function sendBatch() {
  clearTimeout(timer);
  timer = null;
  ajax(url, null, JSON.stringify(batch), {method: 'POST', keepalive: true});
  batch = [];
}

const exAnalytics = Object.assign(adapter({analyticsType: 'endpoint', flushOnPageHide: true}), {
  track({eventType, args}) {
    batch.push({eventType, args: pick(args, FIELDS)});
    if (timer == null) timer = setTimeout(sendBatch, 1000);
  },
  onPageHide() {
    if (batch.length > 0) sendBatch();
  }
});
```

If the adapter keeps per-auction state and sends it when the auction ends, send the state of every auction that has data not yet sent.

### Pattern C: the adapter sends with plain `ajax`

Most adapters send each event, or each auction, with `ajax` and no `keepalive`. Add `keepalive: true` and make sure the body is a string:

```javascript
// before
ajax(url, null, JSON.stringify(payload), {method: 'POST', contentType: 'application/json'});

// after
ajax(url, null, JSON.stringify(payload), {method: 'POST', keepalive: true});
```

Or use `sendBeacon`, falling back to `keepalive`:

```javascript
import {ajax, sendBeacon} from '../src/ajax.js';

const body = JSON.stringify(payload);
if (!sendBeacon(url, body)) {
  ajax(url, null, body, {method: 'POST', keepalive: true});
}
```

Check that the endpoint accepts the new request: `sendBeacon` with a string sends `text/plain;charset=UTF-8`, and dropping a non-safelisted `contentType` changes the `Content-Type` header. If the adapter uses the response, for example to read a server-side configuration, keep that request as it is; only the requests that carry events need to survive unload. If events are also batched on a timer, apply [pattern B](#pattern-b-the-adapter-batches-events-on-a-timer) as well.

### Pattern D: the adapter defers sending

Some adapters wait for a promise, a timer race, compression (`CompressionStream` or gzip helpers), or a WebCrypto signature before sending. None of these can finish inside the page-hide handler. Keep the deferred path for normal operation, and add a synchronous path for page hide:

* send uncompressed when the page is hidden, if the endpoint accepts it;
* compute signatures, keys or tokens ahead of time, for example when the adapter is enabled or when the auction ends, so sending on page hide doesn't need `crypto.subtle`;
* replace `Promise.race([timeout, onHidden])`-style waits with a timer plus `onPageHide`, both calling the same synchronous send function.

Before:

```javascript
function auctionEnded(auction) {
  Promise.race([
    new Promise(resolve => setTimeout(resolve, LOGGING_DELAY)),
    new Promise(resolve => onHidden(resolve))
  ]).then(() => compress(JSON.stringify(auction))) // async: too late on page hide
    .then(body => ajax(url, null, body, {method: 'POST'}));
}
```

After:

```javascript
const pending = new Map();

function send(auctionId, {hidden = false} = {}) {
  const auction = pending.get(auctionId);
  if (auction == null) return;
  pending.delete(auctionId);
  const json = JSON.stringify(auction);
  if (hidden) {
    // synchronous: no compression while the page is going away
    ajax(url, null, json, {method: 'POST', keepalive: true});
  } else {
    compress(json).then(body => ajax(url, null, body, {method: 'POST'}));
  }
}

const exAnalytics = Object.assign(adapter({analyticsType: 'endpoint', flushOnPageHide: true}), {
  track({eventType, args}) {
    if (eventType === EVENTS.AUCTION_END) {
      pending.set(args.auctionId, summarize(args));
      setTimeout(() => send(args.auctionId), LOGGING_DELAY);
    }
  },
  onPageHide() {
    [...pending.keys()].forEach(auctionId => send(auctionId, {hidden: true}));
  }
});
```

If the adapter loads an external script before it can send, events that arrive before the script has loaded can't be sent on page hide; send them with `keepalive` directly, or leave the adapter out.

### Pattern E: the adapter delegates to an external library

If `track` hands events to a script loaded from your servers, the opt-in only helps if that library sends what it receives right away, or has a synchronous flush. Check that the library:

* sends with `sendBeacon` or `fetch` with `keepalive`, not with plain XHR or pixels;
* doesn't batch events on its own timer, or offers a synchronous flush function the adapter can call from `onPageHide`;
* is loaded by the time events arrive; otherwise the adapter is still buffering them;
* doesn't already flush on `pagehide` or `visibilitychange` by itself, before the base adapter has passed the last queued events to `track`. If it does, expose its flush to the adapter and call it from `onPageHide` instead.

If the library only stores events (for example in a global queue it processes later), opting in gains nothing until the library itself changes.

## Testing

### Unit tests

The global test setup sets the debounce delay to 0, so events reach `track` immediately. To test the page-hide path, restore the delay, emit an event, and check that dispatching `pagehide` (or `visibilitychange` with `document.visibilityState` set to `hidden`) sends it synchronously. Stub your transport through a `dep` object, as Prebid.js modules usually do, so the test can see the call:

```javascript
import {expect} from 'chai';
import sinon from 'sinon';
import * as events from 'src/events.js';
import {EVENTS} from 'src/constants.js';
import {setDebounceDelay} from '../../../libraries/analyticsAdapter/AnalyticsAdapter.js';
import exAnalytics, {dep} from 'modules/exAnalyticsAdapter.js';

describe('exAnalytics, when the page is hidden', () => {
  let clock, ajaxStub;

  beforeEach(() => {
    setDebounceDelay(100);
    clock = sinon.useFakeTimers();
    ajaxStub = sinon.stub(dep, 'ajax');
    sinon.stub(events, 'getEvents').returns([]); // skip events from other tests
    exAnalytics.enableAnalytics({provider: 'exAnalytic', options: {}});
  });

  afterEach(() => {
    exAnalytics.disableAnalytics();
    events.getEvents.restore();
    ajaxStub.restore();
    clock.restore();
    setDebounceDelay(0);
  });

  it('sends queued events with keepalive on pagehide, before the debounce delay', () => {
    events.emit(EVENTS.BID_WON, {auctionId: 'a1', adId: 'b1', cpm: 1});
    sinon.assert.notCalled(ajaxStub);
    window.dispatchEvent(new Event('pagehide'));
    sinon.assert.calledOnce(ajaxStub);
    expect(ajaxStub.firstCall.args[3]).to.include({keepalive: true});
  });

  it('sends on visibilitychange to hidden', () => {
    Object.defineProperty(document, 'visibilityState', {configurable: true, get: () => 'hidden'});
    try {
      events.emit(EVENTS.BID_WON, {auctionId: 'a1', adId: 'b1', cpm: 1});
      document.dispatchEvent(new Event('visibilitychange'));
      sinon.assert.calledOnce(ajaxStub);
    } finally {
      delete document.visibilityState;
    }
  });
});
```

Also test that:

* `onPageHide` sends an incomplete batch, and doesn't send when nothing is pending;
* nothing is sent twice when the batch timer fires after `onPageHide` (`clock.tick(...)` after the page-hide event);
* nothing is sent after `disableAnalytics`.

In Prebid.js, `test/spec/AnalyticsAdapter_spec.js` covers the base adapter, and `test/spec/modules/pgamdirectAnalyticsAdapter_spec.js` and `test/spec/modules/genericAnalyticsAdapter_spec.js` show adapter tests.

### In a browser

1. Build Prebid.js with your adapter, for example `gulp serve --modules=appnexusBidAdapter,exAnalyticsAdapter`, and set up a test page with an auction and analytics enabled.
2. Open the browser's developer tools and turn on **Preserve log** (Chrome, Edge) or **Persist Logs** (Firefox) in the Network panel.
3. Leave the page in the same tab right after the auction: click a creative link with `target="_top"`, or type another URL. Also try switching tabs, which fires `visibilitychange`.
4. Confirm that your collector received the request. Keepalive requests appear as `fetch` requests, beacons as `ping` (Chrome) or `beacon` (Firefox). Developer tools can show a request as cancelled or pending even when it reached the server, so check the server side too.

Test in Firefox as well as Chrome: Firefox drops `keepalive` requests that are started after the page-hide handler returns, so it shows when something in your send path is asynchronous. `keepalive` is supported from Chrome 66, Firefox 133 and Safari 13; older browsers can still send with `sendBeacon`.

Prebid.js's end-to-end test `test/spec/e2e/modules/e2e_bidClick_same_tab.spec.js` checks this for the generic adapter: a creative link navigates the tab to a landing page served by the test server, and the test checks that the `bidClick` reached the test server's analytics collector. Run it locally with `gulp e2e-test --local`.

## Adapter status

Status as of Prebid.js 11.50. If your adapter has opted in, or has changed since, please update this table in your docs pull request.

{: .table .table-bordered .table-striped }
| Adapter (module code) | Status | Notes | Pattern |
| --- | --- | --- | --- |
| `generic` | Opted in | `track` only batches; `onPageHide` sends the incomplete batch. The default URL handler sends with `keepalive`; custom handlers should use `keepalive` or `sendBeacon` | B |
| `33across` | Opted in | `track` only updates its cache, or sends the report with `sendBeacon` | |
| `im` | Opted in | `track` updates its cache or sends with `sendBeacon` | |
| `nexx360` | Opted in | `track` buffers per auction, or sends single events with `keepalive` | |
| `pgamdirect` | Opted in | `track` normalizes one event and sends it with `keepalive` | |
| `pubxai`, `scaleable`, `xe` | Not yet | Buffer events and send them with `sendBeacon` from their own `pagehide`/`visibilitychange` listeners, which run before the base adapter's queue is drained (`xe` drains it with `setDebounceDelay(0)`) | A |
| `tercept` | Not yet | Has its own beacon flush, but sends `bidWon` with plain `ajax` | A, C |
| `yuktamedia` | Not yet | Uses `keepalive`, but `track` serializes every event's full `args` for logging, and falls back to plain `ajax` | C |
| `medianet` | Not yet | Waits for a timer or its own page-hide listener in a `Promise.race`, then sends from the promise callback | D |
| `mobkoi` | Not yet | Awaits promises before sending, and sends some events with pixels | D, C |
| `byData` | Not yet | Signs payloads with WebCrypto before sending | D |
| `id5` | Not yet | Compresses payloads with gzip before sending | D |
| `adloox` | Not yet | Loads an external measurement script for each won bid | E |
| `yandex` | Not yet | Sends through the Yandex Metrica counter on a timer, and doesn't call the base `enableAnalytics` | E |
| `automatad`, `rivr`, `datablocks`, `hubvisor`, `optimon`, `pubperf`, `pubstack`, `pulsepoint` | Not yet | Hand events to external libraries | E |
| `pianoDmp`, `relevant`, `eightpod` | Not yet | `track` only hands data to an external queue or stores it, so opting in gains nothing | E |
| `sharethrough` | Not yet | Sends an image pixel | C |
| `AsteriobidPbm`, `adWMG`, `adagio`, `adkernelAdn`, `adnuntius`, `adplus`, `advRed`, `adxcg`, `adxpremium`, `agma`, `appier`, `asteriobid`, `ats`, `browsi`, `concert`, `datawrkz`, `finteza`, `greenbids`, `growthCode`, `hadron`, `intentIq`, `invisibly`, `kargo`, `liveIntent`, `livewrapped`, `magnite`, `malltv`, `nobid`, `oolo`, `oxxion`, `pubmatic`, `pubwise`, `r2b2`, `roxot`, `smartyads`, `symitri`, `ucfunnel`, `uniquest`, `yieldone`, `zeta_global_ssp` | Not yet | Send with plain `ajax` or `fetch` without `keepalive`, many from timers or intervals | C, and B if batching |

## Further reading

* [How to add a Prebid.js analytics adapter](/dev-docs/integrate-with-the-prebid-analytics-api.html)
* [Generic analytics adapter](/dev-docs/modules/genericAnalyticsAdapter.html)
* [Bid click tracking](/dev-docs/modules/bidClickTracking.html)
* [Page Lifecycle API](https://developer.chrome.com/docs/web-platform/page-lifecycle-api)
* [`keepalive` (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/RequestInit#keepalive)
