---
layout: page
title: Responsive Ad Sizes - <font color="red">NEW!</font>
description: Choosing which sizes should be in the auction based on screen size
---

<div class="bs-docs-section" markdown="1">

# Basic Responsive Ad Sizes
{:.no_toc}

{: .alert.alert-warning :}
**This feature only works in Prebid 1.0 and later.**  

Responsive web designs are easier when the ad technology supports different sizes based on the user's device.

Using an IAB example, say the AdUnit in the page can support sizes 768x90, 468x60, and 320x50. When users
view the page from a large screen, they should get the 768x90 ad, when on a medium screen they should get
468x60, and on small screen, 320x50.

Assuming that the backend bidders don't support figuring out which size to bid on, the only way to
constrain the sizes before Prebid 1.0 was for the publisher to dynamically create AdUnits and register them with Prebid.

In Prebid 1.0, the AdUnit is defined up-front as supporting all three of these sizes:

{% highlight js %}

var AdUnits = [{
    code: "ad-slot-1",
    sizes: [[768,90], [468,60], [320,50]], 
    bids: [
        {
            bidder: "bidderA",
            params: {
                placement: "123456"
            }
       }]
}]

{% endhighlight %}

Then this list of sizes can be
filtered at runtime with the new sizeConfig feature. Think of sizeConfig as a series of rules that have
conditions and outputs. The conditions are defined using the 'MediaQuery' format, and the first output
is "sizesSupported". For example:

{% highlight js %}

pbjs.setConfig({
  sizeConfig: [{
       mediaQuery: '(min-width: 1200px)',                         // desktops
       sizesSupported: [[970,90], [728,90], [300,250], [160,600]]
     }, {
       mediaQuery: '(min-width: 768px) and (max-width: 1199px)',  // tablets
       sizesSupported: [[468,60], [300,250], [160,600]]
     }, {
       mediaQuery: '(min-width: 0px) and (max-width: 767px)',     // phones
       sizesSupported: [[300,50],[320,50],[120,20],[168,28]]
  }]
});

{% endhighlight %}

For more information about formulating MediaQueries, see the [MDN Page](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Using_media_queries).

Here's how it works:

1. Before the auction, the sizeConfig is processed. 
1. Just one mediaQuery block should match, and if so, the sizesSupported defined there will be used to filter AdUnit sizes.
    * If more than one mediaQuery block matches, all matching sizesSupported will be unioned together. We don't recommend structuring your sizeConfig such that multiple mediaQueries match, but it is possible.
    * If no mediaQuery blocks match, the default is to allow all sizes.
    * An empty array for sizesSupported [] turns off all sizes
1. Next, process the AdUnits. If there were any sizes specified by sizeConfig, then they're used as a filter to limit the number of sizes that apply to the AdUnit. In other words, the sizes actually used for the auction are the intersection of AdUnits[].sizes and the resulting sizesSupported.

## Further Reading

+ [Other conditional AdUnit scenarios]({{site.baseurl}}/dev-docs/feature-conditional.html)
+ [Information about formulating MediaQueries](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Using_media_queries)

</div>
