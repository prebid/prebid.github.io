<div class="api-header">Max Requests Per Origin</div>

Since browsers have a limit of how many requests they will allow to a specific domain before they block, Prebid.js
will queue auctions that would cause requests to a specific origin to exceed that limit.  The limit is different
for each browser. Prebid.js defaults to a max of `4` requests per origin.  That value can be configured with
`maxRequestsPerOrigin`.

```javascript
pbjs.setConfig({ maxRequestsPerOrigin: 6 });
```
<div class="pb-alert pb-alert-important">Most browsers allow at least six requests, but your results may vary for your user base.  Sometimes using all six requests can impact performance negatively for users with poor internet connections.</div>

```javascript
pbjs.setConfig({ maxRequestsPerOrigin: 1 });
```
<div class="pb-alert pb-alert-note">To emulate pre 1-x behavior and have all auctions queue (no concurrent auctions), you can set <code>maxRequestToOrigin</code> to one.</div>

