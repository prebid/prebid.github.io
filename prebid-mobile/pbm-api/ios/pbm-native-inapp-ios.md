---
layout: page_v2
title: Native In App Rendering - iOS
description: Native In App Rendering for iOS
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
Starting with the `1.14.0-beta1` version converting the native ad template to the ad objects is changed to match the IAB specs. See this [issue](https://github.com/prebid/prebid-mobile-ios/issues/494) for the details. If you update SDK from the previous version - verify the native ads integration before the release.
{% endcapture %}

{% include alerts/alert_important.html content=importantNote %}

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

9. Create Prebid line items with price priority and a display ad type that is targeting `hb_pb key-values`. Associate the creative you added in steps 4 thru 8 (making sure to choose your native format as expected creatives on the line item) to the ad unit you created in the second step.

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

#### NativeAdDelegate

The `NativeAdDelegate` protocol provides three methods to handle the display and check the validity of the returned native ad.

##### Methods

  **nativeAdLoaded**

  Use this method to pass a `NativeAd` to inflate.

*Parameters*

  {: .table .table-bordered .table-striped }  
  |  Name           | Scope    | Type     | Description           |
  |-----------------+----------+----------+-----------------------|
  | NativeAd        | Required | ad       | A NativeAd            |

  **nativeAdNotFound**

  Use this method when a `NativeAd` is not found in the server returned response. The ad should be displayed as a regular AdUnit type.

  **nativeAdNotValid**

  Use this method when a Prebid native ad was returned, but a `NativeAd` object was not able to be created from the cached assets. Display different content.

### Classes

#### NativeAd

An object representing the `NativeAd` to be displayed.

#### Using Asset Ids with In-App Native Ad Units

Setting this option to `true`, in your instance of Prebid Mobile, enables you to add an id for each asset in the assets array. The default setting is `false`

**Swift**
```
Prebid.shared.shouldAssignNativeAssetID = true
```

**Objective C**
```
[Prebid shared].shouldAssignNativeAssetID = YES;
```
##### Methods

  *registerViews*

  Takes a `View` that will handle the display of the native asset image and a `listener` object.

  *Parameters*

  {: .table .table-bordered .table-striped }  
  |  Name           | Scope    | Type     | Description                                      |
  |-----------------+----------+----------+--------------------------------------------------|
  | view            | Required | View     | The view to display the native asset image in.   |
  |                 |          |          |                                                  |

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
  |  Name                  | Scope    | Type      | Description                      |
  |------------------------+----------+-----------+----------------------------------|
  | adObject               | Required | AnyObject | The ad object to search for.     | |                                                                                  |

### Examples

#### Consume NativeAd

How to consume native in iOS:
<pre>
<code>
func createPrebidNativeView(){
    let adNib = UINib(nibName: "PrebidNativeAdView", bundle: Bundle(for: type(of: self)))
    let array = adNib.instantiate(withOwner: self, options: nil)
    if let prebidNativeAdView = array.first as? PrebidNativeAdView{
        self.prebidNativeAdView = prebidNativeAdView
        prebidNativeAdView.frame = CGRect(x: 0, y: 0, width: self.adContainerView.frame.size.width, height: 150 + self.screenWidth * 400 / 600)
        self.view.addSubview(prebidNativeAdView)
    }
}

func loadNativeAssets(){

    let image = NativeAssetImage(minimumWidth: 200, minimumHeight: 200, required: true)
    image.type = ImageAsset.Main

    let icon = NativeAssetImage(minimumWidth: 20, minimumHeight: 20, required: true)
    icon.type = ImageAsset.Icon

    let title = NativeAssetTitle(length: 90, required: true)

    let body = NativeAssetData(type: DataAsset.description, required: true)

    let cta = NativeAssetData(type: DataAsset.ctatext, required: true)

    let sponsored = NativeAssetData(type: DataAsset.sponsored, required: true)

    nativeUnit = NativeRequest(configId: "25e17008-5081-4676-94d5-923ced4359d3", assets: [icon,title,image,body,cta,sponsored])

    nativeUnit.context = ContextType.Social
    nativeUnit.placementType = PlacementType.FeedContent
    nativeUnit.contextSubType = ContextSubType.Social

    let event1 = EventType.Impression
    eventTrackers = NativeEventTracker(event: event1, methods: [EventTracking.Image,EventTracking.js])
    nativeUnit.eventtrackers = [eventTrackers]
}
</code>
</pre>

#### Google Ad Manager Integration
<pre>
<code>
var adLoader: GADAdLoader?
var nativeUnit: NativeRequest!
var nativeAd:NativeAd?
var nativeUnit: NativeRequest!
var eventTrackers: NativeEventTracker!      
func loadPrebidNativeForDFP(){
    createPrebidNativeView()
    loadNativeAssets()    
    let dfpRequest:DFPRequest = DFPRequest()
    nativeUnit.fetchDemand(adObject: dfpRequest) { [weak self] (resultCode: ResultCode) in
              adLoader = GADAdLoader(adUnitID: "/19968336/Abhas_test_native_native_adunit",
                           rootViewController: self,
                           adTypes: [ GADAdLoaderAdType.dfpBanner, GADAdLoaderAdType.nativeCustomTemplate],
                           options: [ ])
              adLoader?.delegate  = self
              adLoader?.load(dfpRequest)
    }
}

//MARK: : DFP Native Delegate
func adLoader(_ adLoader: GADAdLoader, didFailToReceiveAdWithError error: GADRequestError) {
    print("Prebid GADAdLoader failed \(error)")
}

func nativeCustomTemplateIDs(for adLoader: GADAdLoader) -> [String] {
    return ["11963183"]
}

func adLoader(_ adLoader: GADAdLoader,
              didReceive nativeCustomTemplateAd: GADNativeCustomTemplateAd){
    print("Prebid GADAdLoader received customTemplageAd")
    Utils.shared.delegate = self
    Utils.shared.findNative(adObject: nativeCustomTemplateAd)
}

func adLoader(_ adLoader: GADAdLoader, didReceive bannerView: DFPBannerView) {
    prebidNativeAdView?.addSubview(bannerView)
}

func validBannerSizes(for adLoader: GADAdLoader) -> [NSValue] {
    return [NSValueFromGADAdSize(kGADAdSizeBanner)]
}
</code>
</pre>

#### MoPub Integration

<pre>
<code>
var mpNative:MPNativeAdRequest?
var mpAd: MPNativeAd?
var nativeUnit: NativeRequest!
var nativeAd:NativeAd?
var nativeUnit: NativeRequest!
var eventTrackers: NativeEventTracker!
func loadPrebidNativeForMoPub(){
    removePreviousAds()
    createPrebidNativeView()
    loadNativeAssets()

    let settings: MPStaticNativeAdRendererSettings = MPStaticNativeAdRendererSettings.init()
    let config:MPNativeAdRendererConfiguration = MPStaticNativeAdRenderer.rendererConfiguration(with: settings)
    self.mpNative = MPNativeAdRequest.init(adUnitIdentifier: "2674981035164b2db5ef4b4546bf3d49", rendererConfigurations: [config])

    let targeting:MPNativeAdRequestTargeting = MPNativeAdRequestTargeting.init()
    self.mpNative?.targeting = targeting

    nativeUnit.fetchDemand(adObject: mpNative!) { [weak self] (resultCode: ResultCode) in
        print("Prebid demand fetch for AdManager \(resultCode.name())")
        if let mpNative = mpNative{
            mpNative.start(completionHandler: { (request, response, error)->Void in
                if error == nil {
                    self.mpAd = response!
                    Utils.shared.delegate = self
                    Utils.shared.findNative(adObject: response!)
                }
            })
       }
    }
}
</code>
</pre>

#### Native Ad Delegate Integration
<pre>
<code>
//MARK: : NativeAdDelegate Delegate
func nativeAdLoaded(ad:NativeAd) {
    print("nativeAdLoaded")
    nativeAd = ad
    nativeAd?.delegate = self
    if  let prebidNativeAdView = prebidNativeAdView {
        nativeAd?.registerView(view: prebidNativeAdView, clickableViews: [prebidNativeAdView.callToActionButton])
    }

    prebidNativeAdView?.titleLabel.text = nativeAd?.title
    prebidNativeAdView?.bodyLabel.text = nativeAd?.text
    if let iconString = nativeAd?.iconUrl, let iconUrl = URL(string: iconString) {
        DispatchQueue.global().async {
            let data = try? Data(contentsOf: iconUrl)
            DispatchQueue.main.async {
                if data != nil {
                    self.prebidNativeAdView?.iconImageView.image = UIImage(data:data!)
                }
            }
        }
    }
    if let imageString = nativeAd?.imageUrl,let imageUrl = URL(string: imageString) {
        DispatchQueue.global().async {
            let data = try? Data(contentsOf: imageUrl)
            DispatchQueue.main.async {
                if data != nil {
                 self.prebidNativeAdView?.mainImageView.image = UIImage(data:data!)
                }
            }
        }
    }
    prebidNativeAdView?.callToActionButton.setTitle(nativeAd?.callToAction, for: .normal)
    prebidNativeAdView?.sponsoredLabel.text = nativeAd?.sponsoredBy
}

func nativeAdNotFound() {
    print("nativeAdNotFound")

}
func nativeAdNotValid() {
    print("nativeAdNotValid")
}
</code>
</pre>
