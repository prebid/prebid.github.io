---
layout: page
title: Attach Bid to Ad View
description: Attach Bid to Ad View
pid: 3
top_nav_section: prebid-mobile
nav_section: prebid-mobile-android
---

<div class="bs-docs-section" markdown="1">

# Attach Bid to Ad View
{:.no_toc}

Call API to attach the bid.

### For DFP

For developers using DFP, use the following API to attach the top bid:

```java
PrebidMobileForDFP.attachTopBid(request, SampleConstants.DFP_BANNER_ADUNIT_320x50, context); 
```

To wait until bid is ready, implement the following listener:

```java

/**
 * Listener Interface to be used with attachTopBidWhenReady for PublisherAdRequest.
 */
public interface OnAttachCompleteListener {
 
    /**
     * Called whenever the bid has been attached to the PublisherAdRequest, or when the timeout has occurred. Which ever is the earliest.
     */
    void onAttachComplete(PublisherAdRequest request);
}
```

Use the following API to listen to bid ready:

```java
PrebidMobileForDFP.attachTopBidWhenReady(request, adUnitCode, context, timeoutInMillis, listener);
```

### For MoPub

For developers using MoPub, use the following API to attach the top bid:

```java
PrebidMobileForMoPub.attachTopBid(MoPubView adView, String adUnitCode)
```

To wait until the bid is ready before attaching the top bid, implement the following listener:

```java
/**
 * Listener Interface to be used with attachTopBidWhenReady for Banner.
 */
public interface OnAttachCompleteListener {
 
    /**
     * Called whenever the bid has been attached to the Banner view, or when the timeout has occurred. Which ever is the earliest.
     */
    void onAttachComplete(MoPubView adView);
}
```

Then call this API to listen to bid ready:

```java
PrebidMobileForMoPub.attachTopBidWhenReady(adView, adUnitCode, listener, waitTime);
```

</div>
