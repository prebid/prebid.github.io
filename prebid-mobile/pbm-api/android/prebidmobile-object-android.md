---
layout: page_v2
title: PrebidMobileObject - Android
description: PrebidMobileObject - Android
top_nav_section: prebid-mobile
nav_section: prebid-mobile
sidebarType: 2
---

# PrebidMobile Object
{:.no_toc}

Apply global settings with the `PrebidMobile` object.

* TOC
{:toc}


##Methods

### setAccountId

**Parameters**

`accountId`: String containing the Prebid Server account ID.


```java
void setPrebidServerAccountId(String accountId)
```

Example:
```java
PrebidMobile.setPrebidServerAccountId("1234");
```


### getAccountId

Retrieve the Prebid Server account ID.

**Parameters**

none

```java
String getPrebidServerAccountId()
```



### setHost

**Parameters**

`host`: Object containing configuration your Prebid Server host with which Prebid SDK will communicate. Choose from the system-defined Prebid Server hosts or define your own custom Prebid Server host.

```java
void setPrebidServerHost(Host host)
```

Example:
```java
PrebidMobile.setPrebidServerHost(Host.RUBICON);

//or set a custom host
Host.CUSTOM.setHostUrl("https://prebid-server.bidder.com/");
PrebidMobile.setPrebidServerHost(Host.CUSTOM);
```

### getHost

Retrieve the Prebid Server host with which Prebid Mobile will communicate.

**Parameters**

none

```java
Host getPrebidServerHost()
```


**Parameters**

`timoeoutMillis`: The Prebid timeout (accessible to Prebid SDK 1.2+), set in milliseconds, will return control to the ad server SDK to fetch an ad once the expiration period is achieved. Because Prebid SDK solicits bids from Prebid Server in one payload, setting Prebid timeout too low can stymie all demand resulting in a potential negative revenue impact.

### Set Prebid Timeout

```java
void setTimeoutMillis(int timeoutMillis)
```

### Get Prebid Timeout*
```java
int getTimeoutMillis()
```

Example:
```java
PrebidMobile.setTimeoutMillis(3_000);
```


### setShareGeoLocation

If this flag is True AND the app collects the user's geographical location data, Prebid Mobile will send the user's geographical location data to Prebid Server. If this flag is False OR the app does not collect the user's geographical location data, Prebid Mobile will not populate any user geographical location information in the call to Prebid Server.

**Parameters**

`share`: Boolean value. Default = `false`.

```java
void setShareGeoLocation(boolean share)
```

Example:
```java
PrebidMobile.setShareGeoLocation(true);
```

### isShareGeoLocation

Returns a boolean value specifying whether geographic location is shared.

**Parameters**

none

```java
boolean isShareGeoLocation()
```

### setCustomHeaders

The following methods enable the customization of the HTTP call to the Prebid server:

```
public static void setCustomHeaders(HashMap<String, String> customHeaders)
```

You can also inspect the current custon headers using: 

```
public static HashMap<String, String> getCustomHeaders()
```

### setApplicationContext

Prebid Mobile will use the application context to retrieve metadata needed for targeting, such as user agent, location, device information, and connectivity information.

**Parameters**

`context`: Context object.

```java
void setApplicationContext(Context context)
```


### getApplicationContext

**Parameters**

none

```java
Context getApplicationContext()
```

Example:
```java
PrebidMobile.setApplicationContext(getApplicationContext());
```


### Set Auction Response

**Parameters**
`storedAuctionResponse`: Set as type string, stored auction responses signal Prebid Server to respond with a static response matching the storedAuctionResponse found in the Prebid Server Database, useful for debugging and integration testing. No bid requests will be sent to any bidders when a matching storedAuctionResponse is found. For more information on how stored auction responses work, refer to the written [description on github issue 133](https://github.com/prebid/prebid-mobile-android/issues/133).

```java
void setStoredAuctionResponse(@NonNull String storedAuctionResponse)
```


### Get Auction Response

**Parameters**
none

```java
String getStoredAuctionResponse()
```

Example:

```java
PrebidMobile.setStoredAuctionResponse("111122223333");
```

### addStoredBidResponses
Stored Bid Responses are similar to Stored Auction Responses in that they signal to Prebid Server to respond with a static pre-defined response, except Stored Bid Responses is done at the bidder level, with bid requests sent out for any bidders not specified in the bidder parameter. For more information on how stored auction responses work, refer to the written [description on github issue 133](https://github.com/prebid/prebid-mobile-android/issues/133).

**Parameters**
`bidder`: Bidder name as defined by Prebid Server bid adapter of type string.
`responseId`: Configuration ID used in the Prebid Server Database to store static bid responses.

```java
void addStoredBidResponse(String bidder, String responseId)
```

Example:
```java
PrebidMobile.addStoredBidResponse("appnexus", "221144");
PrebidMobile.addStoredBidResponse("rubicon", "221155");
```

### clearStoredResponses

**Parameters**
none

```java
void clearStoredBidResponses()
```

### pbsDebug

`pbsDebug`: adds the debug flag ("test":1) on the outbound http call to Prebid Server. The test:1 flag will signal to Prebid Server to emit the full resolved request (resolving any Stored Request IDs) as well as the full Bid Request and Bid Response to and from each bidder.
```java
pbsDebug(Boolean)
```

Example:
PrebidMobile.setPbsDebug(true);

## Related Topics

- [Prebid Mobile API - Android]({{site.baseurl}}/prebid-mobile/pbm-api/android/pbm-api-android.html)
- [Ad Unit](/prebid-mobile/pbm-api/android/pbm-adunit-android.html)
- [Banner Ad Unit](/prebid-mobile/pbm-api/android/pbm-banneradunit-android.html)
- [Interstitial Ad Unit](/prebid-mobile/pbm-api/android/pbm-bannerinterstitialadunit-android.html)
- [Result Codes]({{site.baseurl}}/prebid-mobile/pbm-api/android/pbm-api-result-codes-android.html)
- [Targeting Parameters]({{site.baseurl}}/prebid-mobile/pbm-api/android/pbm-targeting-params-android.html)
- [Prebid Mobile API - iOS]({{site.baseurl}}/prebid-mobile/pbm-api/ios/pbm-api-ios.html)
