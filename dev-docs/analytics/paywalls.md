---
layout: analytics
title: Paywalls
description: Paywalls Analytics Adapter
modulecode: paywallsAnalyticsAdapter
prebid_member: false
---

#### Overview

The Paywalls Analytics Adapter emits [VAI (Validated Actor Inventory)](https://paywalls.net/docs/publishers/vai) classification on each Prebid auction. VAI helps publishers distinguish **human traffic** and **AI agents** from **non-human automation** (sharing/preview bots, search crawlers, AI training scrapers, etc.), enabling them to segment and analyze performance by traffic class (yield, fill, viewability, buyer outcomes) in their existing analytics stack (GA4, GTM / dataLayer, or a custom callback).

Two key-value pairs are emitted per auction:

{: .table .table-bordered .table-striped }

| Key | Example | Description |
| :-- | :------ | :---------- |
| `vai_vat` | `HUMAN` | Validated Actor Type — `HUMAN`, `AI_AGENT`, `SHARING`, or `OTHER` |
| `vai_act` | `ACT-1` | Actor Confidence Tier — `ACT-1`, `ACT-2`, or `ACT-3` |

If VAI is unavailable, both values are `UNKNOWN`.

{: .alert.alert-info :}
The companion [Paywalls RTD Provider](/dev-docs/modules/paywallsRtdProvider.html) injects VAI into ORTB2 and GAM targeting. The analytics adapter independently reads the same `window.__PW_VAI__` global and routes classification to your analytics tool of choice.

#### Build

```bash
gulp build --modules=paywallsAnalyticsAdapter
```

Or with the recommended RTD provider:

```bash
gulp build --modules=rtdModule,paywallsRtdProvider,paywallsAnalyticsAdapter
```

#### Analytics Options

{: .table .table-bordered .table-striped }

| Name | Type | Scope | Description | Default |
| :--- | :--- | :---- | :---------- | :------ |
| provider | `String` | Required | Must be `'paywalls'` | — |
| options.output | `String` | Optional | Output mode: `'gtag'`, `'dataLayer'`, or `'callback'` | `'callback'` |
| options.scriptUrl | `String` | Optional | URL of the VAI loader script | `'/pw/vai.js'` |
| options.samplingRate | `Number` | Optional | Fraction of page views that emit analytics (0.0–1.0) | `1.0` |
| options.callback | `Function` | Optional | Called with the metrics object when output is `'callback'` | `null` |

#### Example Configuration

##### gtag (Google Analytics 4)

```javascript
pbjs.enableAnalytics([{
  provider: 'paywalls',
  options: {
    output: 'gtag'
  }
}]);
```

Fires a GA4 event via the global `gtag()` function:

```javascript
gtag('event', 'vai_auction', { vai_vat: 'HUMAN', vai_act: 'ACT-1' });
```

##### dataLayer (Google Tag Manager)

```javascript
pbjs.enableAnalytics([{
  provider: 'paywalls',
  options: {
    output: 'dataLayer'
  }
}]);
```

Pushes to the GTM `dataLayer` array:

```javascript
window.dataLayer.push({
  event: 'vai_auction',
  vai_vat: 'HUMAN',
  vai_act: 'ACT-1'
});
```

In GTM, create a Custom Event trigger on `vai_auction` to route the data to any tag.

##### callback (Custom Function)

```javascript
pbjs.enableAnalytics([{
  provider: 'paywalls',
  options: {
    output: 'callback',
    callback: function (metrics) {
      console.log(metrics);
      // { vai_vat: 'HUMAN', vai_act: 'ACT-1' }
    }
  }
}]);
```

#### Sampling

Set `samplingRate` to control cost. The decision is made once per page load — all auctions on that page either emit or don't.

```javascript
pbjs.enableAnalytics([{
  provider: 'paywalls',
  options: {
    samplingRate: 0.1  // emit on ~10% of page views
  }
}]);
```

#### Activity Controls

The adapter uses `loadExternalScript` to inject `vai.js`. If your activity configuration restricts external scripts, allow the `paywalls` component:

```javascript
pbjs.setConfig({
  allowActivities: {
    loadExternalScript: {
      default: false,
      rules: [{
        condition: function (params) {
          return params.componentName === 'paywalls';
        },
        allow: true
      }]
    }
  }
});
```

#### Privacy

VAI does not collect, store, or transmit user IDs, cookies, fingerprints, or PII. Classification is based on aggregate session-level behavioral signals processed entirely in the browser.

#### Registration

For questions or integration help, contact [engineering@paywalls.net](mailto:engineering@paywalls.net).

#### Further Reading

* [VAI Documentation](https://paywalls.net/docs/publishers/vai)
* [Paywalls RTD Provider](/dev-docs/modules/paywallsRtdProvider.html)
