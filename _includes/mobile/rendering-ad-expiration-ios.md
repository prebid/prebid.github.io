<!-- markdownlint-disable MD041 -->
(requires SDK v3.4.0)

A bid can carry `exp`, the number of seconds it stays valid. If a Prebid-rendered ad is loaded but no impression is tracked within `exp` seconds, the SDK notifies the ad unit's delegate:

{: .table .table-bordered .table-striped }
| Ad unit | Delegate method |
| --- | --- |
| `BannerView` | `bannerViewDidExpire(_:)` in `BannerViewDelegate` |
| `InterstitialRenderingAdUnit` | `interstitialDidExpireAd(_:)` in `InterstitialAdUnitDelegate` |
| `RewardedAdUnit` | `rewardedAdDidExpire(_:)` in `RewardedAdUnitDelegate` |

``` swift
// MARK: BannerViewDelegate

func bannerViewDidExpire(_ bannerView: BannerView) {
    // The loaded ad expired before an impression was tracked
}
```

- The countdown starts when the ad finishes loading and stops once an impression is tracked.
- A banner with auto-refresh enabled removes the expired creative and loads a new ad. A banner with auto-refresh disabled keeps showing the creative, and the delegate is only notified.
- An expired interstitial or rewarded ad can still be shown. To replace it, call `loadAd()` again.
- Bids without `exp`, and ad server creatives that win over the Prebid bid, don't expire.
