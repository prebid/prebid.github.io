---
layout: page_v2
title: Prebid.js 9.0 Release Notes & Publisher API Changes
description: Description of the breaking changes included for Prebid.js 9.0
sidebarType: 1
---

# Prebid.js 9.0 Bidder Interface and Publisher API Changes

{:.no_toc}

This document describes the changes included for Prebid.js version 9.0.

* TOC
{:toc}

## Removed Modules

The following modules have been removed from Prebid.js as part of the 9.0 release. Publishers building with one of them will need to point to its replacement or remove the module from their build.

{: .table .table-bordered .table-striped }
| Module      | Replacement |
|:-----------------------------------------|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Brightcom | OMS Bid Adapter |
| Sovrn Analytics | |
| Empty FPD module file | |
| Adomik | |
| Britepool | |
| SpotX | |
| pirId | |
| Engage BDR | |
| MyTarget | |
| Parrable | |
| Blue BillyWig | |
| Idward RTD | Anonymized RTD |
| Minutemedia Plus | |
| eplanning Analytics | |
| mars media Analytics | |
| sigmoid Analytics | |
| sonobi Analytics | |
| staq Analytics | |
| RichAudience | (Temporary) |
| adbookpsp | |
| yahooSSP | yahooAds |
| GDPR Consent module | TCF Consent module |
| GDPR Enforcement module | TCF Control module |
| Bizzclick | Blasto |
| Utiq | UtiqId |
| Prebid Manager | AsterioBid Prebid Manager |
| Ras | RingierAxelSpringer |
| Fledge for GPT | PAAPI for GPT |
| DFP Video | Split into DFP Video and DFP AdPod |

## Consent changes:

The USP string was removed from the consent metadata; also USP module is no longer in the recommended build. The GDPR modules were renamed to TCF modules, to reflect their adherence to a technical specification and not imply adherence to the underlying legislation and case law. Support for GPP 1.0 was removed from the GPP module. Of particular importance, "vendorless" modules such as the sharedid module no longer rely on vendor consent in the TCF object, but instead rely on publisher purpose consent. Publishers should check their __tcfapi consent data object to confirm publisher purpose consents are requested by their CMP.

## Rendering:

This [creative](https://github.com/prebid/Prebid.js/blob/master/integrationExamples/gpt/x-domain/creative.html) is now the preferred creative choice for Google Ad Manager users for web. It is created as part of the build process. This [legacy implementation](https://github.com/prebid/Prebid.js/blob/8.52.0/integrationExamples/gpt/creative_rendering.html) was deleted and examples using the Prebid Universal Creative (PUC) in documentation are being ported over to [the new guidance](https://docs.prebid.org/adops/js-dynamic-creative.html). Publishers also using Prebid Mobile SDK creative for apps may wish to remain on the PUC for ease of operations.

The legacy method of trafficking native creatives has also had a deprecation warning issued. Publishers should prefer the Ortb2 implementation as sendTargetingKeys for native, hb_native_ASSET, will no longer be supported in a coming version.

## Video ORTB2 Objects

The Ortb2 core adapter utility no longer infers placement from context. Context = 'instream' now only refers to the technical integration method the publisher is using to interact with the player and is not relevant to the ortb2 bid requests. Adapters should not infer placement nor plcmt is instream from this value. It is however reasonable to infer plcmt = 4 from context = outstream. Adapters are not permitted to only support placement and not plcmt; they are welcome to pass both. Publishers are advised to set plcmt on their video ad units explicitly to avoid downstream inferences causing buyer inventory quality enforcements.
## PAAPI

Any module described as Fledge is now PAAPI. PAAPI Configuration is simplified and publishers experimenting with Fledge in 8.x should refer to the module documentation for updates.

Publishers wishing to support PAAPI should install the PAAPI module and select the submodule appropriate for their top level seller (TLS). Both gpt.js and publisher designated top level decision logic have submodules. Ad servers wishing to add support for top level selling in Prebid.js may choose to issue instructions compatible with the newly released publisher designated TLS or submit their own submodule. 

Bid adapters can now return either complete auction config or an `igb` object according to the Ortb community extension for PAAPI. Publishers wishing to be or to designate a component seller to handle the `igb` objects returned by some bid modules should configure PAAPI with, for example

` pbjs.setConfig({
    paapi: {
       enabled: true,
       componentSeller: {
          auctionConfig: {
                decisionLogicURL: 'publisher.example'
                // ...
          }
       }
    }
 })`

PAAPI for GPT now supports custom slot configuration. Also, the autoConfig option has been removed and replaced with configWithTargeting, defaulting to true, which sets GPT targeting and submits auction configs together. It differs in the previous autoconfig in that it no longer relies on gpt being available at the time of requestBids, only at the time of setTargeting. 

Publishers should be aware this behavior may prohibit submission of auction configuration to GPT sooner than the Prebid.js auction has completed, and will likely prefer to use `setPAAPIConfigForGPT`. We're hoping a futute gpt.js release will enable submission of configuration including unresolved promises earlier than the completion of the Prebid auction, by providing an `allConfigsSubmitted` type utility. Prebid support for other top level sellers will include this functionality in the near future.

## Miscellaneous configuration changes (publishers):

Pbadslot has had a deprecation warning issued, it is redundant specifying with imp.ext.gpid. In the future, the pre-auction module will not populate it and publishers setting pbadslot explicitly will see a warning. 

We stopped supporting top level site, app, and device configuration directly, eg `setConfig({device: X})`. Please prefer the ortb2 object in configuration (or in requestBids), eg `setConfig({ortb2: {device: X}})`

s2s tmax and userId module default timings were set to more reasonable defaults.

The Topics module now requires publishers to choose which external topics gathering frames will be injected. Documentation lists many options.

We now require node.js 20+ to build. Babel was upgraded; the build target was modernized. The test suite raised its browser version targets.

transformBidParams was removed from the build so publishers would not need an adapter to use a bidder in prebid server. Appnexus adapter added the anPspParamsConverter module as a temporary measure to solve for their adapter.

Private functions are no longer available to npm consumers.

Some adapters changed their configuration, including JW Player RTD, Openweb, Yahoo Ads, Improve Digital and 33Across Id module. See [https://github.com/prebid/Prebid.js/issues/11608](https://github.com/prebid/Prebid.js/issues/11608).

## Miscellaneous deprecation notices (modules):

Bidders should prefer the eids object in the bidrequest. The redundant userid object in bid requests will be removed in a future version.

Userid submodules may no longer be able to access set methods in storage manager in the future. The parent userid module is capable of setting the value returned by the submodule according to publisher configuration.

A variety of performance degrading functions may become unavailable to bid adapters. Some already have, including .innerText and .outerText. Bidders should generally rely on the request object to interrogate navigator, and if things are missing from the request object, we invite PRs on it as preferred over redundant module implementations.

Some modules not using our methods, or using excessive payloads, for storage or network transmission were modified. 

Bidders may no longer import the events system.

getConfig is no longer allowed to gather consent, as it may be stale; use the consent object.

Bidder companion scripts are now completely removed; only other module types may source js.
