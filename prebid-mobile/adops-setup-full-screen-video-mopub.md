---
layout: page_v2
title: Setup Rewarded Video for MoPub
description: Setup Full Screen Video for MoPub
pid: 1
top_nav_section: prebid-mobile
nav_section: prebid-mobile-adops
sidebarType: 3
---

# Step-by-Step Line Item Setup for Full-screen Video on MoPub

* TOC
{:toc }

This page provides step-by-step instructions to set up full-screen video line items on MoPub to be used with the Prebid Mobile SDK.

## Step 1. Create full screen adUnit  
<img src="/assets/images/ad-ops/mopub/full/mopub-lineitem-full-adunit.png" alt="Under New ad unit, select Fullscreen.">&nbsp;&nbsp;

## Step 2. Add a line item  
In the *Add a Line Item* section:
1.  For the *Type and Priority* settings, select *Non-Guaranteed* as the type and set the priority to *12*. This ensures the line item will compete with all other demand.  
2. Set the Rate to the price you want to target.&nbsp;  
<img src="/assets/images/ad-ops/mopub/rewarded/mopub-lineitem-rewarded.png" width="1000" height="544" alt="For the Type and Priority settings, select Non-Guaranteed as the type and set the priority to 12">&nbsp;&nbsp;
3. In the *Advanced Targeting* section, set the target for *Keywords* to `hb_pb:0.50`&nbsp;
<img src="/assets/images/ad-ops/mopub/rewarded/mopub-lineitem-advanced.png" width="1000" height="254" alt="In the Advanced Targeting section, set the target for Keywords to hb_pb:0.50">&nbsp;&nbsp;  

For each level of pricing granularity required, one line item/creative pairing will need to be set up.

Line items must be set up to target custom keywords that include bid price information. The bid price keywords will contain how much the buyer bid on the impression.

Prebid Mobile, by default, will send the highest bid price to MoPub using the keyword `hb_pb` but will also submit the key `hb_pb_BIDDERCODE` for each bidder. You can decide to create one set of line items for all bidders or one set of line items for each bidder.

## Step 3. Add creatives to your line item  
Full-screen video creatives must have a *VAST tag* with the *Format* set to *Fullscreen* that includes the code below:  
```
<VAST version="2.0">
  <Ad id="1">
    <Wrapper>
      <AdSystem>MoPub</AdSystem>
      <VASTAdTagURI><![CDATA[https://%%KEYWORD:hb_cache_host%%%%KEYWORD:hb_cache_path%%?uuid=%%KEYWORD:hb_uuid%%]]></VASTAdTagURI>
      <Impression><![CDATA[{PATH TO CREATIVE}]]></Impression>
    </Wrapper>
  </Ad>
</VAST>
```
<br>    
<img src="/assets/images/ad-ops/mopub/full/mopub_lineitem_full_vasttag.png" alt="MoPub VAST tag code">&nbsp;&nbsp;

The `hb_uuid` variable value is the cache id that will load the ad markup from the bid stored in Prebid Cache. Within each line item, for each ad unit size, there should be one creative with this content.

The XML can be constructed by providing the VAST tag URL as:
`https://%%KEYWORD:hb_cache_host%%%%KEYWORD:hb_cache_path%%?uuid=%%KEYWORD:hb_uuid%%`

## Step 4. Duplicate line items  
Duplicate your line items according to your [price granularity](/prebid-mobile/adops-price-granularity.html) setting.
