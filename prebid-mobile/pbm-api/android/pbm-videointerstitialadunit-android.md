---
layout: page_v2
title: InterstitialAdUnit - Android
description: InterstitialAdUnit - Android
top_nav_section: prebid-mobile
nav_section: prebid-mobile
sidebarType: 2
---

# VideoInterstitialAdUnit Object
{:.no_toc}

Use the `VideoInterstitialAdUnit` object to create and configure an interstitial ad unit in your app.


Currently Google Ad Manager is the only supported ad server. We plan to provide support for additional ad servers in subsequent releases.
{: .alert .alert-info}

* TOC
{:toc}

## Object

### VideoInterstitialAdUnit

Create a new Video Interstitial Ad Unit associated with a Prebid Server configuration ID.


```java
VideoInterstitialAdUnit("configId");
```

**Parameters**

`configId`: String; Prebid Server configuration ID.



## Methods

`VideoInterstitialAdUnit` inherits all methods from the [AdUnit](/prebid-mobile/pbm-api/android/pbm-adunit-android.html) object.



## Example

**Google Ad Manager**

```java
AdUnit adUnit;
private PublisherInterstitialAd amInterstitial;

private void setupAndLoadAMInterstitialVAST() {
   setupPBInterstitialVAST();
   setupAMInterstitialVAST();
   loadInterstitial();
}

private void setupPBInterstitialVAST() {
   PrebidMobile.setPrebidServerHost(Host.RUBICON);
   PrebidMobile.setPrebidServerAccountId("AccountID");

   adUnit = new VideoInterstitialAdUnit("configID");
}

private void setupAMInterstitialVAST() {
   setupAMInterstitial("/networkId/adUnit");
}

private void setupAMInterstitial(String id) {
   amInterstitial = new PublisherInterstitialAd(this);
   amInterstitial.setAdUnitId(id);
}

private void loadInterstitial() {
   PublisherAdRequest.Builder builder = new PublisherAdRequest.Builder();
   final PublisherAdRequest request = builder.build();
   adUnit.fetchDemand(request, new OnCompleteListener() {
       @Override
       public void onComplete(ResultCode resultCode) {
           DemoActivity.this.resultCode = resultCode;
       }
   });
}
```

## Related Topics

- [Ad Unit]({{site.baseurl}}/prebid-mobile/pbm-api/android/pbm-adunit-android.html)
- [Prebid Mobile API - Android]({{site.baseurl}}/prebid-mobile/pbm-api/android/pbm-api-android.html)
- [Banner Ad Unit]({{site.baseurl}}/prebid-mobile/pbm-api/android/pbm-banneradunit-android.html)
- [Result Codes]({{site.baseurl}}/prebid-mobile/pbm-api/android/pbm-api-result-codes-android.html)
- [Targeting Parameters]({{site.baseurl}}/prebid-mobile/pbm-api/android/pbm-targeting-params-android.html)
- [Prebid Mobile Object]({{site.baseurl}}/prebid-mobile/pbm-api/android/prebidmobile-object-android.html)
- [Prebid Mobile API - iOS]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-api-iOS.html)
