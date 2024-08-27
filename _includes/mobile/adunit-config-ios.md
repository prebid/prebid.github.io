Each ad unit in the original integration method is a subclass of the `AdUnit` class, which provides the following properties and methods for the additional configuration.

### Autorefresh

#### setAutoRefreshMillis
{:.no_toc}

If set on a given banner adunit, the `fetchDemand` function will be called every `periodMillis` until `stopAutoRefresh` is called. Each call to `fetchDemand` will invoke the `onComplete` function. This refresh only pertains to Prebid Mobile and not to any ad server refresh processes. It is suggested that the adServes refresh be turned off.

#### stopAutoRefresh
{:.no_toc}

Halts the auto-refresh behavior for a given Prebid Mobile ad unit. If no auto-refresh behavior has been set, `stopAutoRefresh` will be ignored.

#### resumeAutoRefresh
{:.no_toc}

Allows to resume the stopped autorefresh for the ad unit with predefined autorefresh value.

### GPID

(requires SDK v2.1.6)

The Global Placement ID (GPID) is a key that uniquely identifies a specific instance of an adunit. Some bidders require this value. An important scenario is "infinite scroll" -- if your app creates instances
of an adunit dynamically as the user scrolls through content, the the GPID must be different for each by appending some kind of sequence or ID. e.g. "/newsfeed#7"

Using the following method, you can set the impression-level [GPID](https://docs.prebid.org/features/pbAdSlot.html#the-gpid) value to the bid request:

``` swift
adUnit.setGPID("/36117602/hnp-sfgate.com/Homepage/AP300")
```

### Ad Slot

PB Ad Slot is an identifier tied to the placement the ad will be delivered in. The use case for PB Ad Slot is to pass to exchange an ID they can use to tie to reporting systems or use for data science driven model building to match with impressions sourced from alternate integrations. A common ID to pass is the ad server slot name.

``` swift
adUnit.ortb2Imp.ext.data.pbadslot = "/1111111/homepage/med-rect-2"`
```
