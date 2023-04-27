---
layout: page_v2
page_type: module
title: Module - Google Ad Manager Express
description: A simplified installation mechanism for publishers that have Google Publisher Tag (GPT) ad calls in their pages.
module_code : express
display_name : Google Ad Manager Express
enable_download : true
vendor_specific: true
sidebarType : 1
---



# GAM/Google Ad Manager Express Module
{:.no_toc}

This module is a simplified alternate installation mechanism for publishers that have Google Publisher Tag (GPT) ad calls in their pages. Here's how it works:
 
* You build a Prebid.js package that contains the extra module code and optionally the page's AdUnits.
* One or two lines of javascript are added to a page already coded with GPT ad calls.
* The module intercepts ad behavior by overriding certain GPT APIs, coordinating the appropriate header bidding behavior, and then calling DoubleClick.
* Bidder parameters for the auction are determined by linking the Google Ad Manager slots to the Prebid AdUnits
* Currently supports display formats only (i.e not video)

Definitions:

* **GAM** - Google Ad Manager
* **DFP** - DoubleClick For Publishers is the old name of GAM.
* **GPT** - Google Publisher Tag - the javascript SDK used by publishers to define and load ads into their pages
* **Slot** - Sometimes called 'AdUnit' in the GAM/DFP world, the slot is often a combination of size and page location. e.g. 'top_leader'
* **Prebid AdUnit** - links the ad server slot to the header bidders and their parameters
* **Div ID** - the element ID of the HTML DIV where the ad will be displayed
* **Package** - a javascript file that contains one or more functions. e.g. Prebid + Express.

## Page integration

Adding the module to a page is done by adding just one line of javascript:
{% highlight js %}
<script src="https://some.hosting.domain/path/prebid.js">
{% endhighlight %}

The prebid.js file needs to be loaded before the GPT library loads, unless you're willing to manage the timing with additional queue functions. The examples here assume the easiest integration, which is synchronous.

The prebid.js file must also be constructed so that it contains:
- the Prebid.js adunits with the code keyed to the GAM slot name or the div element ID
- a call to pbjs.express()

## Implementation

### Prepare the AdUnit Configuration

Create an AdUnits file and source control it in a separate local repository. E.g. my-prebid-config/pub123adUnits.js:
 
{% highlight js %}
     var pbjs = pbjs || {};
     pbjs.que = pbjs.que || [];
     pbjs.que.push(function() {
        pbjs.addAdUnits({
            code: 'door-medrect',   // must match Google Ad Manager slot name
            // sizes are optional: Express will copy sizes from the Google Ad Manager slot
            sizes: [[300, 250], [300,600]],
            bids: [{
                bidder: 'rubicon',
                params: {
                    accountId: 14062,
                    siteId: 70608,
                    zoneId: 472364
                }
            }]
        });
        pbjs.express(); // activates the Google Ad Manager Express feature.
     });
{% endhighlight %}

Notes:

* The pbjs and pbjs.que variables need to be defined if not already defined on the page.
* The Express module will copy the sizes from the GPT slots if they're not specified in the PBJS AdUnits.
 
### Build the package
 
#### Step 1: Bundle the module code

Follow the basic build instructions on the Gihub repo's main README. To include the module, an additional option must be added to the the gulp build command:
 
{% highlight js %}
gulp build --modules=express
{% endhighlight %}
 
This command will build the following files:
 
- build/dist/prebid-core.js - the base Prebid code
- build/dist/express.js - additional code for Google Ad Manager express 
- build/dist/prebid.js - a combined file with the base Prebid code and the Google Ad Manager express code
 
#### Step 2: Append the AdUnits

If you've chosen to append the AdUnits right to the end of the package, use the command line to concatenate the files. e.g.

{% highlight js %}
cat build/dist/prebid.js my-prebid-config/pub123adUnits.js >> build/dist/prebid-express-with-adunits.js
{% endhighlight %}
 
#### Step 3: Publish the package(s) to your CDN

After testing, get your javascript file(s) out to your Content Delivery Network (CDN) as normal.

Note that there are more dynamic ways of combining these components for publishers or integrators ready to build a more advanced infrastructure.

## Functions

The Google Ad Manager Express module adds one new function to Prebid:

{% highlight js %}
pbjs.express(AdUnits);
{% endhighlight %}

This function initiates the scanning of the in-page Google Ad Manager slots, mapping them to Prebid AdUnits, kicking off the Prebid auction, and forwarding the results to Google Ad Manager.

The AdUnits argument is optional -- if not provided it will look for AdUnits previously registered with pbjs.addAdUnits(). If no AdUnits can be found, it will return an error.

## Technical Details

- DoubleClick must be the primary ad server and the pages must use enableAsyncRendering
- The first call to googletag.display() will run auctions for AdUnits that have codes matching one of these two conditions:
  - AdUnit.code matches gptSlot.getAdUnitPath()
  - AdUnit.code matches gptSlot.getSlotElementId()
- Additional calls to display() (e.g. an infinite scroll scenario) will run auctions only for new GPT slots that have been defined since the last call to display().
- If googletag.disableInitialLoad() is called, then Prebid Express will not run auctions when display() is called. Instead it waits for a call to refresh().
- When refresh(gptSlots) is called, Express will run auctions for the array of slots provided, or if none is provided, then for all slots that have been defined on the page.
- Integration works whether enableSingleRequest is on or off, but we recommend single request
  - If enableSingleRequest is off, there are multiple calls to requestBids - one per slot

### Risks

The practice of intercepting GPT ad calls has precedence in the industry, but may not work in all scenarios. The publisher assumes all risks:

- The approach used by the module may not work in complex page implementations. We recommend thorough testing.
- Obtaining Google support may be more difficult with this module in the page.
- Google may change GPT such that this module stops operating correctly.

## Minimal Example

1) Build a version of your prebid.js file

2) Append the following lines to the file:

```
var adUnits = [
  {
    code: '/111111/slot-name',
    mediaTypes: {
      banner: {
        sizes: [[300,250]]
      }
    },
    bids: [
    {
      bidder: 'rubicon',
      params: { account: 1001, siteId: 113932, zoneId: 535510 }
    }
  }];
pbjs.express(adUnits);
```

3) Two things to note: first, the AdUnit.code field must match an actual GPT slot name. Second, the call to `pbjs.express(adUnits)` is what kicks off header bidding.

4) Integrate your Prebid.js file into the page

```
<meta charset="UTF8">
<html>
<head>
    // prebid.js needs to be loaded synchronously to make sure GPT doesn't fire before header bidding takes place
    <script src="https://some.hosting.domain/path/myprebid.js"></script>
    // it's assumed that the above myprebid.js file contains:
    // - a definition for a prebid.js adunit with a `code` of 'slot-name' or 'div-name'
    // - a call to pbjs.express(adUnits)

    <script type="text/javascript" src="https://securepubads.g.doubleclick.net/tag/js/gpt.js" async="true"></script>
    <script type ="text/javascript">
        var googletag = googletag || {};
        googletag.cmd = googletag.cmd || [];
    </script>
    <script type="text/javascript">
        googletag.cmd.push(function() {
            googletag.defineSlot('/111111/slot-name', [[300, 250]], 'div-name').addService(googletag.pubads());
            googletag.pubads().enableSingleRequest();
            googletag.pubads().enableAsyncRendering();
            googletag.enableServices();
        });
    </script>
</head>

<body>
<h2>Express Test</h2>
<div id='div-name'>
    <script type='text/javascript'>
    googletag.cmd.push(function() { googletag.display('div-name'); });
</script>
</div>
</body>
</html>
```

## Further Reading

+ [Learn more about AdUnits]({{site.baseurl}}/dev-docs/getting-started.html)

+ More about [Google Publisher Tags](https://developers.google.com/doubleclick-gpt/reference)

