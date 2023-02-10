---

layout: page_v2
title: Prebid Mobile Rendering Modules
description: Prebid Mobile Rendering Modules architecture
sidebarType: 2

---

# AppLovin MAX Setup

## Custom Network Setup

In your MAX account go to `Mediation` -> `Manage` -> `Networks` and click `Click here to add a Custom Network`. Then create an **SDK** custom network with the following adapter names:

<img src="/assets/images/prebid-mobile/modules/rendering/max-cusom-network-setup.png" alt="Pipeline Screenshot" align="center">



iOS adapter:
```
PrebidMAXMediationAdapter
```

Android Adapter:  
```
com.applovin.mediation.adapters.PrebidMaxMediationAdapter
```


## Add Placements


Now you have to add placements for Prebid Custom Network into the respective ad unit's waterfall.

Create or choose an existing Ad Unit. Go the the `Custom Networks & Deals` section. Chose the Prebid's custom network that you created at the previous step. Change the status to active and add placements following the [price granularity](/adops/price-granularity.html) guide to determine how many entries you need.

<img src="/assets/images/prebid-mobile/modules/rendering/max-ad-unit-setup.png" alt="Pipeline Screenshot" align="center">


Make sure that the `Custom Parameters` field contain expecting targetting keywords of the winning bid:

```
{"hb_pb":"0.10"}
```

{: .alert.alert-warning :}
The adapter will render the winning bid only if the bid's targeting keywords contain `all` keywords from the `Custom Parameters` field.
