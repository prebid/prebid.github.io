Each ad unit in the original integration method is a subclass of the `AdUnit` class, which provides the following properties and methods for the additional configuration.

### Arbitrary OpenRTB

(requires SDK v2.3.1)

Prebid SDK allows the customization of the OpenRTB request on the ad unit level using the `setImpORTBConfig()` function: 

``` swift
adUnit.setImpORTBConfig("{\"bidfloor\":0.01,\"banner\":{\"battr\":[1,2,3,4]}}")
```
 
The parameter passed to `setImpORTBConfig()` will be merged into the respective `imp` object for this Ad Unit. For instance, the above example will add the `$.imp[0].bidfloor` and `$.imp[0].banner.battr` parameters to the bid request.  

To empty out a previously provided impression config, just set it to the empty string: 

``` swift
adUnit.setImpORTBConfig("")
```

### Autorefresh

#### setAutoRefreshMillis
{:.no_toc}

If set on a given banner ad unit, the `fetchDemand` function will be called every `periodMillis` until `stopAutoRefresh` is called. Each call to `fetchDemand` will invoke the `onComplete` function. This refresh only pertains to Prebid Mobile and not to any ad server refresh processes. It is suggested that the adServes refresh be turned off.

#### stopAutoRefresh
{:.no_toc}

Halts the auto-refresh behavior for a given Prebid Mobile ad unit. If no auto-refresh behavior has been set, `stopAutoRefresh` will be ignored.

#### resumeAutoRefresh
{:.no_toc}

Resumes a stopped autorefresh for the ad unit with the previously-defined autorefresh value.

### GPID

(requires SDK v2.1.6)

The Global Placement ID (GPID) is a key that uniquely identifies a specific instance of an adunit. Some bidders require this value. An important scenario is "infinite scroll" -- if your app creates instances
of an adunit dynamically as the user scrolls through content, the the GPID must be different for each by appending some kind of sequence or ID. e.g. "/newsfeed#7"

Using the following method, you can set the impression-level [GPID](https://docs.prebid.org/features/pbAdSlot.html#the-gpid) value to the bid request:

``` swift
adUnit.setGPID("/36117602/hnp-sfgate.com/Homepage/AP300")
```

### Ad Position

The `adPosition` property allows developers to specify the position of the ad within the publisher's content. This property maps to the `pos` field in the OpenRTB specification under the `imp[].banner` or `imp[].video` objects, depending on the ad format. The possible values for this field could be found in the [respective specification](https://github.com/InteractiveAdvertisingBureau/AdCOM/blob/main/AdCOM%20v1.0%20FINAL.md#list--placement-positions-).

You can set `adPosition` by using the following property: 

```swift
adUnit.adPosition = .footer
```