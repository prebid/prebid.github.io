<div class="api-header">Disable Ajax Timeout</div>

Prebid core adds a timeout on XMLHttpRequest request to terminate the request once auction is timedout. Since Prebid is ignoring all the bids after timeout it does not make sense to continue the request after timeout. However, you have the option to disable this by using `disableAjaxTimeout`.

```javascript
pbjs.setConfig({ disableAjaxTimeout: true });
```