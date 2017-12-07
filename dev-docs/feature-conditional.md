---
layout: page
title: Conditional Ad Units - <font color="red">NEW!</font>
description: Using labels for conditional bids
---

<div class="bs-docs-section" markdown="1">

# Conditional Bids and AdUnits

Prebid 1.0 introduced the `sizeConfig` feature primarily for [responsive ad designs]({{site.baseurl}}/dev-docs/feature-responsive.html), focusing on constraining sizes based on device.
But a number of other scenarios are supported as well:

1. What if some bidders should be skipped for some devices?
1. What if some bidders have different parameters for different devices?
1. What if some AdUnit auctions should be skipped entirely for some devices?
1. What if some bid requests apply only to users originating from certain countries? 

By supporting these scenarios, header bidding can be more efficient - the browser can send bids to a more surgical set of bidders based on device size or other attributes the page code can create.

Before going into how these scenarios work, a few words about the design of Prebid's approach. With Prebid 1.0,
we introduce 'labels', which are just generic tags. Labels are defined by code in the page and then used by certain AdUnits and bids.

The basic steps are:

1. Build up an array of labels from two sources: either as an output of sizeConfig or as an optional argument to requestBids().
1. Apply label targeting to AdUnits or specific bids.

Let's jump into an example.

## Use Case: What if some bidders should be skipped for some devices?

Say a particular bidder is focused on mobile phone demand, so it's really not worthwhile for either party
to send them requests from display or tablets.

We'll start with how to set up the labels from sizeConfig:

{% highlight js %}

pbjs.setConfig({
  sizeConfig: [{
       mediaQuery: '(min-width: 1200px)',
       sizesSupported: [[970,90], [728,90], [300,250], [160,600]],
       label: [ "display"]
     }, {
       mediaQuery: '(min-width: 768px) and (max-width: 1199px)',
       sizesSupported: [[468,60], [300,250], [160,600]],
       label: [ "tablet"]
     }, {
       mediaQuery: '(min-width: 0px) and (max-width: 767px)',
       sizesSupported: [[300,50],[320,50],[120,20],[168,28]],
       label: [ "phone"]
  }]
});

{% endhighlight %}

Here, labels are applied for each of the 3 screen sizes that can later be used in
conditional AdUnit logic. For example:

{% highlight js %}

var AdUnits = [{
    code: "ad-slot-1",
    sizes: [[768,90], [468,60], [320,50]], 
    bids: [
        {
            bidder: "bidderA",
            params: {
                placement: "1000"
            }
       },{
            bidder: "mobileBidder",
            labelAny: ["phone"],  // this bid only applies to small screensizes
            params: {
                placement: "2000"
            }
       }
   ]
}]

{% endhighlight %}

How this works:

1. Users with a screen width of 767px and under will cause the third mediaQuery to fire.
1. This rule puts "phone" into the label array and a list of sizes into sizesSupported
1. Then the AdUnit is processed:
    1. The first bid doesn't have any conditional logic, so is present in every auction.
    1. The second bid requires that "phone" be present in the label array, otherwise it won't be part of the auction.

## Use case: What if some bidders have different parameters for different devices?

For reporting and targeting purposes, Publishers and SSPs sometimes break out different 'placements' for different platforms.

For instance, say that a given bidder wants to define different placements for different devices according to this table:

{: .table .table-bordered .table-striped }
| Device | Placement ID |
|--------|---------|
| Display | 1111 |
| Phones and tablets | 2222 |

Assuming the same sizeConfig as in the first use case above, the AdUnit would contain bids for both
placements, but the conditional `labelAny` is added to them both:

{% highlight js %}

var AdUnits = [{
    code: "ad-slot-1",
    sizes: [[768,90], [468,60], [320,50]], 
    bids: [
        {
            bidder: "bidderA",
            labelAny: ["display"],
            params: {
                placement: "1111"
            }
       },{
            bidder: "bidderA",
            labelAny: ["phone", "tablet"],
            params: {
                placement: "2222"
            }
       }
   ]
}]

{% endhighlight %}

Example of how this works:

1. Users with a screen width of 1000px will cause the second mediaQuery to fire.
1. This rule puts "tablet" into the label array and a list of sizes into sizesSupported.
1. Then the AdUnit is processed:
    1. The first bid requires that the label "display" be present in the array. It's not, so that bid is skipped.
    1. The second bid requires that either "phone" or "tablet" be present. Since tablet is in the label array, that bid is activated and the correct placement is sent to bidderA.

## Use Case: What if some AdUnit auctions should be skipped entirely for some devices?

Say there's a responsive page where one of the AdUnits only supports larger sizes, so it doesn't make sense
on phones. We really don't want to use that AdUnit for mobile users. Wouldn't it be great if `labelAny` and `labelAll` could be applied to the entire AdUnit? They can. Here's an example:

{% highlight js %}

var AdUnits = [{
    code: "ad-slot-1",
    sizes: [[768,90]], 
    labelAny: ["display", "tablet"], // skip the ad unit entirely for phones
    bids: [
        {
            bidder: "bidderA",  // no conditions
            params: {
                placement: "1111"
            }
       },{
            bidder: "tabletBidder",
            labelAny: ["tablet"], // additional conditions can be applied to bids
            params: {
                placement: "2222"
            }
       }
   ]
}]

{% endhighlight %}

## Use Case: What if some bid requests apply only to users originating certain countries? 

Labels aren't constrained to describing device size -- they can be used for any condition the page wants
to define. To support this, labels can now be passed into the `requestBids()` function as an argument.

A specific use case: suppose that a certain bidder doesn't have a data center outside of a
certain region. It's really not worth sending them bid
requests for users outside of their geographic area. Assuming the page can figure out where the user's from,
a label can be implemented and applied to make the bid conditional.

{% highlight js %}
// page logic determines the 'europeanUser' boolean
If (europeanUser) {
    reqArgs={labels:['eur']};
} 
requestBids(reqArgs);
{% endhighlight %}

Then this label can be applied to conditions in the AdUnit just like labels that originate from sizeConfig. E.g.

{% highlight js %}
var AdUnits = [{
    code: "ad-slot-1",
    sizes: [[768,90], [468,60], [320,50]], 
    bids: [
       {
            bidder: "euroMobileBidder",
            labelAll: ["eur", "phone"],
            params: {
                placement: "9876"
            }
       },
       ...
   ]
}]
{% endhighlight %}

This example shows that the 'euroMobileBidder' is only interested in receiving bids that have **both**
labels: both "eur" as passed into requestBids and "phone" as created by sizeConfig.


## Syntax Notes

Probably you've gotten the gist of the feature by now, but it's still worth laying out the syntax a little more. In Prebid 1.0, label targeting is constrained to two relatively simple operators: `labelAny` and `labelAll`.

With the `labelAny` conditional, just one label has to match for the condition to be true.
{% highlight bash %}
labelAny: ["A", "B"]
// Either A or B can be defined in the label array to activate this bid or AdUnit
{% endhighlight %}

With the `labelAll` conditional, Every element of the target array must match an element of the label array in order for the condition to be true.
{% highlight bash %}
labelAll: ["A", "B"] 
// both A and B must be defined in the label array to activate this bid or AdUnit
{% endhighlight %}


{: .alert.alert-warning :}
**This feature only works in Prebid 1.0 and later.**
Only one conditional may be specified on a given AdUnit or bid -- if both labelAny and labelAll are specified, only the first one will be utilized and an error will be logged to the console. It is allowable for an AdUnit to have one condition and a bid to have another.

We may someday implement full boolean logic in this feature, but the common use cases don't demand the complexity or code size at this point.


## Further Reading

+ [Responsive ad designs]({{site.baseurl}}/dev-docs/feature-responsive.html)
+ [Information about formulating MediaQueries](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Using_media_queries)


</div>
