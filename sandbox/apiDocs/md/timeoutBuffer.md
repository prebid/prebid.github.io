<div class="api-header">Set Timeout Buffer</div>

Prebid core adds a timeout buffer to extend the time that bidders have to return a bid after the auction closes. This buffer is used to offset the "time slippage" of the setTimeout behavior in browsers. Prebid.js sets the default value to 400ms. You can change this value by setting `timeoutBuffer` to the amount of time you want to use. The following example sets the buffer to 300ms.

```javascript
pbjs.setConfig({ timeoutBuffer: 300 });
```