---
layout: page_v2
title: VideoAdUnit - Android
description: VideoAdUnit - Android
top_nav_section: prebid-mobile
nav_section: prebid-mobile
sidebarType: 2
---

# VideoAdUnit Object
{:.no_toc}

Use the `VideoAdUnit` object to create and configure an outstream vido ad unit in your app.

Currently Google Ad Manager is the only supported ad server. Subsequent releases will provide support for additional ad servers.
{: .alert .alert-info}

* TOC
{:toc}

## Object

### VideoAdUnit

Create a new Outstream Video Ad Unit associated with a Prebid Server configuration ID and a video player size.

```java
VideoAdUnit( "configID", width, height, VideoAdUnit.PlacementType.placement);
```

**Parameters**

* `configId`: String; Prebid Server configuration ID.
* `width`: Integer; Width of the video player
* `height`: Integer; Height of the video player
* `placement` is an enumeration whose value is one of:
	* IN_BANNER
	* IN_ARTICLE
	* IN_FEED

## Methods

`VideoAdUnit` inherits all methods from the [AdUnit]({{site.baseurl}}/prebid-mobile/pbm-api/android/adunit-android.html) object.

## Example

```
private PublisherAdView amBanner;
AdUnit adUnit;

void setupAndLoadAMBannerVAST() {
   setupPBBannerVAST();
   setupAMBannerVAST();
   loadBanner();
}

private void setupPBBannerVAST() {
   PrebidMobile.setPrebidServerHost(Host.RUBICON);
   PrebidMobile.setPrebidServerAccountId("AccountID");
   adUnit = new VideoAdUnit("configId", 300, 250, VideoAdUnit.PlacementType.IN_BANNER);
}

private void setupAMBannerVAST() {
   setupAMBanner(300, 250, "/networkId/adUnit");
}

private void setupAMBanner(int width, int height, String id) {
   amBanner = new PublisherAdView(this);
   amBanner.setAdUnitId(id);
   amBanner.setAdSizes(new AdSize(width, height));
}

private void loadBanner() {
   final PublisherAdRequest.Builder builder = new PublisherAdRequest.Builder();
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

- [Prebid Mobile API - Android]({{site.baseurl}}/prebid-mobile/pbm-api/android/pbm-api-android.html)
- [Ad Unit]({{site.baseurl}}/prebid-mobile/pbm-api/android/adunit-android.html)
- [Intersitial Ad Unit]({{site.baseurl}}/prebid-mobile/pbm-api/android/interstitialadunit-android.html)
- [Result Codes]({{site.baseurl}}/prebid-mobile/pbm-api/android/pbm-api-result-codes-android.html)
- [Targeting Parameters]({{site.baseurl}}/prebid-mobile/pbm-api/android/pbm-targeting-params-android.html)
- [Prebid Mobile Object]({{site.baseurl}}/prebid-mobile/pbm-api/android/prebidmobile-object-android.html)
- [Prebid Mobile API - iOS]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-api-ios.html)
