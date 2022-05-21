---
layout: page_v2
title: Native In App Rendering - Android
description: Native In App Rendering for Android
top_nav_section: prebid-mobile
nav_section: prebid-mobile
sidebarType: 2
---

# Native In App Rendering
{: .notoc}

This document describes the Prebid Mobile (PBM) Native In App Rendering capability. Though PBM has the ability to render native ad components through its Banner Ad object, PBM's  Native In App Rendering solution enables publishers to render the native assets in native code.

## Overview

At a high level the in app rendering process works like this:

1. The publisher configures a native ad unit.
2. PBM fetches native demand. However, instead of caching the native assets on the server, the assets are cached locally in the SDK.
3. Bid request are made to Google Ad Manager/MoPub.
4. Upon receiving results from Google Ad Manager/MoPub, PBM determines if any of the received items are from Prebid Server.
5. If there are Prebid ads, the cached assets are then rendered.

{% capture importantNote %}
The cached assets might expire. If this occurs the publisher will receive a notification and they will have to fetch the assets again.
{% endcapture %}

{% include alerts/alert_important.html content=importantNote %}

{% capture importantNote %}
Starting with the `1.14.0-beta1` version the converting of the native ad template to the ad objects is changed to match the IAB specs. See this [issue](https://github.com/prebid/prebid-mobile-ios/issues/494) for the details. If you update SDK from the previous version - verify the native ads integration before the release.
{% endcapture %}

## Ad Ops Setup

These instructions will enable you to create a creative template in either Google Ad Manager or MoPub that can then be applied to native ads in your app.

### Google Ad Manager

1. Sign in to Google Ad Manager.
2. Create an ad unit with fluid ad size.
3. Click `Delivery` and then `Native`
4. Click `Create native ad`.
5. Click `Android & iOS app code`.
6. Name your new format.
7. Choose `ADD VARIABLE` and add the following variable names and placeholders.  

  {: .table .table-bordered .table-striped }  
  | Variable Name       | Place Holder                     |
  |---------------------+----------------------------------|
  | isPrebid            | [%isPrebid%]                     |
  | hb_cache_id_local   | [%hb_cache_id_local%]            |

  Make sure to indicate that the variables are required.

8. Return to the home screen, click `Delivery > Creatives`, and create a creative with `Native Format`, choosing the template you created. In the user-defined variables you just created, set the following values:

  {: .table .table-bordered .table-striped }  
  | Variable Name       | Value                            |
  |---------------------+----------------------------------|
  | isPrebid            | 1                                |
  | hb_cache_id_local   | %%PATTERN:hb_cache_id_local%%    |

9. Now create Prebid line items with price priority and a display ad type that are targeting `hb_pb key-values`. Associate the creative you added in steps 4 thru 8 (making sure to choose your native format as expected creatives on the line item) to the ad unit you created in the second step.

### MoPub

1. Sign in to MoPub.
2. Select the order for the Prebid line items.  
3. Create a line item that targets an `hb_pb key-value`.
4. Save your line item.
5. Create the creative. When prompted, input a name and choose the format `Native`.
6. Instead of `Easy Form` choose `Manual JSON`.
7. In the JSON input field insert the following content:
<pre>
<code>
{
"mainimage": "https://dummyimage.com/600x400/000/fff",
"isPrebid": true,
"hb_cache_id_local": "%%KEYWORD:hb_cache_id_local%%"
}
</code>
</pre>

8. Click `Save`.

{% capture importantNote %}
The mainimage is a dummy field that MoPub requires for caching.  If the dummy image is not added, the ad will not work. You can insert any dummy pixel.
{% endcapture %}

{% include alerts/alert_important.html content=importantNote %}

## Code Integration

### Interface

#### PrebidNativeAdListener

The `PrebidNativeAdListener` interface provides three methods to handle the display and check the validity of the returned native ad.

##### Methods

  **onPrebidNativeLoaded**

  Use this method to pass a `PrebidNativeAd` to inflate.

*Parameters*

  {: .table .table-bordered .table-striped }  
  |  Name           | Scope    | Type     | Description           |
  |-----------------+----------+----------+-----------------------|
  | PrebidnativeAd  | Required | ad       | A PrebidNativeAd      |

  **onPrebidNativeNotFound**

  Use this method when a Prebid Native ad is not found in the server returned response. The ad should be displayed as a regular AdUnit type.

  **onPrebidNativeNotValid**

  Use this method when a Prebid native ad was returned, but a `PrebidNativeAd` object was not able to be created from the cached assets. Display different content.

### Classes

#### PrebidNativeAd

An object representing the `PrebidNativeAd` to be displayed.

#### Using Asset Ids with In-App Native Ad Units

Setting this option to `true`, in your instance of Prebid Mobile, enables you to add an id for each asset in the assets array. The default setting is `false`

**Kotlin**
```
PrebidMobile.assignNativeAssetID(true)
```

**Java**
```
PrebidMobile.assignNativeAssetID(true);
```

##### Methods

  *registerView*

  Takes a `View` that will handle the display of the native asset image and a `listener` object.

  *Parameters*

  {: .table .table-bordered .table-striped }  
  |  Name           | Scope    | Type     | Description                                      |
  |-----------------+----------+----------+--------------------------------------------------|
  | view            | Required | View     | The view to display the native asset image in.   |
  | final           | Required | Listener | A `PrebidNativeAdListener` object.               |
  |                 |          |          |                                                  |

  *registerViewList*

  **Parameters**

  {: .table .table-bordered .table-striped }  
  |  Name           | Scope    | Type     | Description                                             |
  |-----------------+----------+----------+---------------------------------------------------------|
  | view            | Required | View     | The view to display the native asset image in.          |
  | viewList        | Required | List     | A list of component views of native assets (title etc.) |
  | final           | Required | Listener | A `PrebidNativeAdListener` object.                      |

  **unregister**

  Unregisters the `View` stored for displaying the native asset's image.

##### Getters

  Use these getters to return various components of the native ad.

  {: .table .table-bordered .table-striped }  
  |  Name           | Returns  | Description                                      |
  |-----------------+-------------+-----------------------------------------------|
  | getTitle        | String   | Returns the title of the native ad.              |
  | getDescription  | String   | Returns the description of the native ad.        |
  | getIconUrl      | String   | Returns the path for the icon of the native ad.  |
  | getImageUrl     | String   | Returns the path for the  image of the native ad.|
  | getCallToAction | String   | Returns the type of action of the native ad      |
  | getClickUrl     | String   | Returns the click url of the native ad           |

#### Util

This object provides methods for searching for a `PrebidNativeAd` in the response and displaying the image from the image url in the response.

##### Methods

**findNative**

This method searches for the variable `isPrebid` in the native response. If the variable is located and its value is `true` the `PrebidNativeAd` instance is created and passed back to `PrebidNativeAdListener`.

*Parameters*

  {: .table .table-bordered .table-striped }  
  |  Name                  | Scope    | Type     | Description                                                                       |
  |------------------------+----------+----------+-----------------------------------------------------------------------------------|
  | Object                 | Required | Object |                                                                                   |
  | PrebidNativeAdListener | Required | Listener | `PrebidNativeAdListener` to pass the `PrebidNativeAd` if `isPrebid` = true.       |

**loadImage**

This method displays the image from a url in the native response in an imageView supplied by the publisher.

*Parameters*

{: .table .table-bordered .table-striped }  
|  Name                  | Scope    | Type      | Description                                                                       |
|------------------------+----------+-----------+-----------------------------------------------------------------------------------|
| imageView              | Required | ImageView | The view that the image will be displayed in.                                      |
| imageUrl               | Required | String    | The path of the image to be displayed.                                            |

### Examples

#### Inflate PrebidNativeAd
<pre>
<code>
private void inflatePrebidNativeAd(final PrebidNativeAd ad) {
    LinearLayout nativeContainer = new LinearLayout(MainActivity.this);
    nativeContainer.setOrientation(LinearLayout.VERTICAL);
    LinearLayout iconAndTitle = new LinearLayout(MainActivity.this);
    iconAndTitle.setOrientation(LinearLayout.HORIZONTAL);
    ImageView icon = new ImageView(MainActivity.this);
    icon.setLayoutParams(new LinearLayout.LayoutParams(160, 160));
    Util.loadImage(icon, ad.getIconUrl());
    iconAndTitle.addView(icon);
    TextView title = new TextView(MainActivity.this);
    title.setTextSize(20);
    title.setText(ad.getTitle());
    iconAndTitle.addView(title);
    nativeContainer.addView(iconAndTitle);
    ImageView image = new ImageView(MainActivity.this);
    image.setLayoutParams(new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT));
    Util.loadImage(image, ad.getImageUrl());
    nativeContainer.addView(image);
    TextView description = new TextView(MainActivity.this);
    description.setTextSize(18);
    description.setText(ad.getDescription());
    nativeContainer.addView(description);
    Button cta = new Button(MainActivity.this);
    cta.setText(ad.getCallToAction());
    cta.setOnClickListener(new View.OnClickListener() {
        @Override
        public void onClick(View v) {
            Intent browserIntent = new Intent(Intent.ACTION_VIEW, Uri.parse(ad.getClickUrl()));
            startActivity(browserIntent);
        }
    });
    nativeContainer.addView(cta);
    // add nativeContainer to the screen
    // e.g. ((FrameLayout) MainActivity.this.findViewById(R.id.adFrame)).addView(nativeContainer);
}
</code>
</pre>

#### GAM Code Integration
<pre>
<code>
AdLoader adLoader = new AdLoader.Builder(MainActivity.this, "/19968336/Wei_test_native_native")
        .forPublisherAdView(new OnPublisherAdViewLoadedListener() {
            @Override
            public void onPublisherAdViewLoaded(PublisherAdView publisherAdView) {
                adView = publisherAdView;
                ((FrameLayout) findViewById(R.id.adFrame)).addView(publisherAdView);
            }
        }, AdSize.BANNER)
        .forUnifiedNativeAd(new UnifiedNativeAd.OnUnifiedNativeAdLoadedListener() {
            @Override
            public void onUnifiedNativeAdLoaded(UnifiedNativeAd unifiedNativeAd) {
                MainActivity.this.unifiedNativeAd = unifiedNativeAd;
                // display unifiedNativeAd
            }
        })
        .forCustomTemplateAd("11885766", new NativeCustomTemplateAd.OnCustomTemplateAdLoadedListener() { // You should be using your native format's template id

            @Override
            public void onCustomTemplateAdLoaded(NativeCustomTemplateAd nativeCustomTemplateAd) {
                Util.findNative(nativeCustomTemplateAd, new PrebidNativeAdListener() {
                    @Override
                    public void onPrebidNativeLoaded(PrebidNativeAd ad) {
                       inflatePrebidNativeAd(ad);
                    }

                    @Override
                    public void onPrebidNativeNotFound() {
                        // inflate nativeCustomTemplateAd
                    }

                    @Override
                    public void onPrebidNativeNotValid() {
                        // show your own content
                        // this happens when not able to create PrebidNativeAd from hb_cache_id
                    }
                });
            }
        }, new NativeCustomTemplateAd.OnCustomClickListener() {

            @Override
            public void onCustomClick(NativeCustomTemplateAd nativeCustomTemplateAd, String s) {

            }
        })
        .withAdListener(new AdListener() {
            @Override
            public void onAdFailedToLoad(int i) {
                super.onAdFailedToLoad(i);
            }
        })
        .build();
PublisherAdRequest request = new PublisherAdRequest.Builder().build();
nativeAdUnit.fetchDemand(adView, new OnCompleteListener() {
            @Override
            public void onComplete(ResultCode resultCode) {
                adLoader.loadAd(request);
            }
        });
</code>
</pre>

#### MoPub Code Integration

<pre>
<code>
MoPubNative mMoPubNative = new MoPubNative(MainActivity.this, "2674981035164b2db5ef4b4546bf3d49", new MoPubNative.MoPubNativeNetworkListener() {
    @Override
    public void onNativeLoad(final NativeAd nativeAd) {
        MainActivity.this.ad = nativeAd;
        Util.findNative(nativeAd, new PrebidNativeAdListener() {
            @Override
            public void onPrebidNativeLoaded(final PrebidNativeAd ad) {
                inflatePrebidNativeAd(ad);
            }

            @Override
            public void onPrebidNativeNotFound() {
                infalteMoPubNativeAd(nativeAd);
            }

            @Override
            public void onPrebidNativeNotValid() {
                // should not show the NativeAd on the screen, do something else
            }
        });

    }

    @Override
    public void onNativeFail(NativeErrorCode errorCode) {
    }
});
mMoPubNative.registerAdRenderer(new MoPubStaticNativeAdRenderer(null));
RequestParameters mRP = new RequestParameters.Builder().build();
nativeAdUnit.fetchDemand(mRP, new OnCompleteListener() {
            @Override
            public void onComplete(ResultCode resultCode) {
                mMoPubNative.makeRequest(mRP);
            }
        });
</code>
</pre>
