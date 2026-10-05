<!-- markdownlint-disable MD041 -->
(requires SDK v3.4.0)

A bid can carry `exp`, the number of seconds it stays valid. If a Prebid-rendered ad is loaded but no impression is tracked within `exp` seconds, the SDK notifies the ad unit's listener:

{: .table .table-bordered .table-striped }
| Ad unit | Listener method |
| --- | --- |
| `BannerView` | `onAdExpired(BannerView)` in `BannerViewListener` |
| `InterstitialAdUnit` | `onAdExpired(InterstitialAdUnit)` in `InterstitialAdUnitListener` |
| `RewardedAdUnit` | `onAdExpired(RewardedAdUnit)` in `RewardedAdUnitListener` |

The methods have empty default implementations, so existing listeners don't need changes.

```kotlin
override fun onAdExpired(bannerView: BannerView?) {
    // The loaded ad expired before an impression was tracked
}
```

- The countdown starts when the bid response arrives and stops once an impression is tracked.
- A banner with auto-refresh enabled removes the expired creative and loads a new ad. A banner with auto-refresh disabled keeps showing the creative, and the listener is only notified.
- An expired interstitial or rewarded ad can still be shown. To replace it, call `loadAd()` again.
- Bids without `exp`, and ad server creatives that win over the Prebid bid, don't expire.
