<div class="api-header">Bidder Timeouts</div>

Set a global bidder timeout:

```javascript
pbjs.setConfig({ bidderTimeout: 3000 });
```

{% include alerts/alert_warning.html content=**Bid Timeouts and JavaScript Timers**
Note that it's possible for the timeout to be triggered later than expected, leading to a bid participating in the auction later than expected.  This is due to how [`setTimeout`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setTimeout) works in JS: it queues the callback in the event loop in an approximate location that *should* execute after this time but *it is not guaranteed*.
With a busy page load, bids can be included in the auction even if the time to respond is greater than the timeout set by Prebid.js.  However, we do close the auction immediately if the threshold is greater than 200ms, so you should see a drop off after that period.
For more information about the asynchronous event loop and `setTimeout`, see [How JavaScript Timers Work](https://johnresig.com/blog/how-javascript-timers-work/). %}
