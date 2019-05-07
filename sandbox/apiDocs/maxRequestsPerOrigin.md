<div class="api-header">Max Requests Per Origin</div>

Since browsers have a limit of how many requests they will allow to a specific domain before they block, Prebid.js
will queue auctions that would cause requests to a specific origin to exceed that limit.  The limit is different
for each browser. Prebid.js defaults to a max of `4` requests per origin.  That value can be configured with
`maxRequestsPerOrigin`.

{% include alerts/alert_warning.html content=Most browsers allow at least 6 requests, but your results may vary for your user base.  Sometimes using all six requests can impact performance negatively for users with poor internet connections. %}

```javascript
pbjs.setConfig({ maxRequestsPerOrigin: 6 });
```
{% include alerts/alert_note.html content=To emulate pre 1-x behavior and have all auctions queue (no concurrent auctions), you can set it to one. %}

```javascript
pbjs.setConfig({ maxRequestsPerOrigin: 1 });
```