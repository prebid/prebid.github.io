---
layout: page_v2
title: Dev Tips
description: Troubleshooting tips for developers implementing Prebid.js Header Bidding.
pid: 0

top_nav_section: dev_docs
nav_section: troubleshooting
redirect_from: "/dev-docs/toubleshooting-tips.html"
sidebarType: 1

---



# Tips for Troubleshooting
{:.no_toc}

This page has tips and tricks for troubleshooting issues with your Prebid.js integration.

* TOC
{:toc}

## Turn on Prebid.js debug messages

Add `pbjs_debug=true` to the end of your page's URL. For example: <code>/pbjs_demo.html?pbjs_debug=true</code>. This will add two types of messages to your browser's developer console:

1. Prebid.js suppresses Javascript errors in the normal mode to not break the rest of your page. Adding the `pbjs_debug` parameter will expose the Javascript errors.
2. You'll find additional debug messages. Filter the messages by string `MESSAGE:`. For example:

<br>

![Prebid.js Debug Console]({{ site.github.url }}/assets/images/dev-docs/pbjs_debug-console-log.png){: .pb-sm-img :}

<br>

{: .table .table-bordered .table-striped }
| Message |  Description   |
| :----  |:--------|
| Calling bidder |  When Prebid.js sends out bid requests, this message is logged |
| Set key value for placement | After all the bids came back, or when timeout is reached, prebid.js will set keyword targeting for the defined ad units. |
| Calling renderAd | If a header bidding bid wins the ad server's auction, prebid.js will render the winning bid's creative. |

<br>

## Turn on your ad server's developer console

The ad server's developer console usually provide information such as targeting, latency, and key events logging. For example, here is a screenshot of Google Ad Manager's GPT developer console logs:

<br>

![Prebid.js Debug Console]({{ site.github.url }}/assets/images/dev-docs/googfc.png){: .pb-md-img :}

<br>

## See all bids in the console

To print information about all of the bids that come in to the Console on any page that is running Prebid.js, follow these steps.

Open the Chrome Dev Tools.  In the **Sources** tab, next to **Content Scripts**, click the **>>** button and you can add **Snippets**:

![View Snippets in Dev Tools]({{site.github.url}}/assets/images/dev-docs/troubleshooting-tips/01-view-snippets.png){: .pb-sm-img :}

<br />

Right-click to add a **New** snippet:

![Add New Snippet in Dev Tools]({{site.github.url}}/assets/images/dev-docs/troubleshooting-tips/02-add-new-snippet.png){: .pb-sm-img :}

<br />

Paste in the following code using Control-V (or Command-V on Mac), and give the snippet a name, such as 'show-all-bids':

```javascript
(function() {
  function forEach(responses, cb) {
    Object.keys(responses).forEach(function(adUnitCode) {
      var response = responses[adUnitCode];
      response.bids.forEach(function(bid) {
        cb(adUnitCode, bid);
      });
    });
  }
  var winners = pbjs.getAllWinningBids();
  var output = [];
  forEach(pbjs.getBidResponses(), function(code, bid) {
    output.push({
      bid: bid,
      adunit: code,
      adId: bid.adId,
      bidder: bid.bidder,
      time: bid.timeToRespond,
      cpm: bid.cpm,
      msg: bid.statusMessage,
      rendered: !!winners.find(function(winner) {
        return winner.adId==bid.adId;
      })
    });
  });
  forEach(pbjs.getNoBids && pbjs.getNoBids() || {}, function(code, bid) {
    output.push({
      msg: "no bid",
      adunit: code,
      adId: bid.bidId,
      bidder: bid.bidder
    });
  });
  if (output.length) {
    if (console.table) {
      console.table(output);
    } else {
      for (var j = 0; j < output.length; j++) {
        console.log(output[j]);
      }
    }
  } else {
    console.warn('NO prebid responses');
  }
})();
```

<br />

Right-click the snippet and choose **Run**:

![Run a Snippet in Dev Tools]({{site.github.url}}/assets/images/dev-docs/troubleshooting-tips/03-run-snippet.png){: .pb-sm-img :}

<br />

Check the output in Console to see the bids:

![See Snippet Output in Dev Tools]({{site.github.url}}/assets/images/dev-docs/troubleshooting-tips/04-snippet-output.png){: .pb-sm-img :}

## See all winning bids in the console

To print information about all of the winning bids that come in to the Console on any page that is running Prebid.js, follow these steps.

Open the Chrome Dev Tools.  In the **Sources** tab, next to **Content Scripts**, click the **>>** button and you can add **Snippets**:

![View Snippets in Dev Tools]({{site.github.url}}/assets/images/dev-docs/troubleshooting-tips/01-view-snippets.png){: .pb-sm-img :}

<br />

Right-click to add a **New** snippet:

![Add New Snippet in Dev Tools]({{site.github.url}}/assets/images/dev-docs/troubleshooting-tips/02-add-new-snippet.png){: .pb-sm-img :}

<br />

Paste in the following code using Control-V (or Command-V on Mac), and give the snippet a name, such as 'show-all-winning-bids':

```javascript
var bids = pbjs.getAllWinningBids();
var output = [];
for (var i = 0; i < bids.length; i++) {
    var b = bids[i];
    output.push({
        'adunit': b.adUnitCode, 'adId': b.adId, 'bidder': b.bidder,
        'time': b.timeToRespond, 'cpm': b.cpm
    });
}
if (output.length) {
    if (console.table) {
        console.table(output);
    } else {
        for (var j = 0; j < output.length; j++) {
            console.log(output[j]);
        }
    }
} else {
    console.warn('No prebid winners');
}
```

<br />

Right-click the snippet and choose **Run**:

![Run a Snippet in Dev Tools]({{site.github.url}}/assets/images/dev-docs/troubleshooting-tips/03-run-snippet.png){: .pb-sm-img :}

<br />

Check the output in Console to see the bids (note that this screenshot shows the output from "see all bids" but they're very similar):

![See Snippet Output in Dev Tools]({{site.github.url}}/assets/images/dev-docs/troubleshooting-tips/04-snippet-output.png){: .pb-sm-img :}

## Modify bid responses for testing

Using `pbjs.setConfig({debugging:{ ... }})` from the javascript console, it is possible to override and filter bids as they come in.
When this type of debugging is enabled it will persist across page loads using `sessionStorage`.  This allows
for easy testing of pages that immediately start auctions (most pages), but also means you need to remember
to deactivate debugging when you are done (or clear your local storage / use incognito mode when testing).

```
// Filtering bidders
javascript console> pbjs.setConfig({
  debugging: {
    enabled: true,                     // suppresses bids from other bidders
    bidders: ['bidderA', 'bidderB']
  }
});

// Overwriting bid responses for all bidders
javascript console> pbjs.setConfig({
  debugging: {
    enabled: true,
    bids: [{
      cpm: 1.5
    }]
  }
});

// Overwriting bid responses for a specific bidder and adUnit code (can use either separately)
javascript console> pbjs.setConfig({
  debugging: {
    enabled: true,
    bids: [{
      bidder: 'bidderA',
      adUnitCode: '/19968336/header-bid-tag-0',
      cpm: 1.5
    }]
  }
});

// Disabling debugging
javascript console> pbjs.setConfig({
  debugging: {
    enabled: false
  }
});
```

## Related Reading

+ [Prebid.js FAQ](/dev-docs/faq.html)
+ [Prebid.js Common Issues](/dev-docs/common-issues.html)
