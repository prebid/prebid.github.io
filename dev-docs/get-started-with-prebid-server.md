---
layout: page
title: Get Started with Prebid Server
description: Get Started with Prebid Server
pid: 27
top_nav_section: dev_docs
nav_section: prebid-server
---

<div class="bs-docs-section" markdown="1">

# Get Started with Prebid Server
{:.no_toc}

This page has instructions for setting up Prebid.js with [Prebid Server]() (<span style="color: rgb(255,0,0);">FIXME</span>: <strong>link?</strong>).

For many publishers, client-side header bidding is a balancing act between the inclusion of demand partners and impact to the page.

Using [Prebid Server]() (<span style="color: rgb(255,0,0);">FIXME</span>: <strong>link?</strong>), you can move demand partners server-side, eliminating most of the latency impact that comes with adding more partners.

This should help you make more money without sacrificing user experience.

* TOC
{:toc}

## Step 1: Register for a Prebid Server Account

- Go to the [Prebid Server signup page]() (<span style="color: rgb(255,0,0);">FIXME</span>: <strong>link?</strong>) and click the button to sign up

- Fill out the form details, including your email address

- When approved, you will receive an email with your assigned `accountId`. You will need this for configuring Prebid.js to use Prebid Server.

## Step 2: Download Prebid.js with Prebid Server Enabled

- Go to [the Prebid.org download page]({{site.github.url}}/download.html) and select all the demand adapters you want to work with, including "Prebid Server".

- For example, if you want to use AppNexus, Index Exchange, and Rubicon with Prebid Server, select:
  - *AppNexus*
  - *Index Exchange*
  - *Rubicon*
  - *Prebid Server*

- Then, click **Get Custom Prebid.js** and follow the instructions.

## Step 3: Incorporate the Build and Configure S2S Bidder Adapters

1. Update your site's hosted copy of Prebid.js to use the new build you just generated.  (For example, you may host your copy on your site's servers or using a [CDN](https://en.wikipedia.org/wiki/Content_delivery_network) such as Fastly or Akamai.)

2. Include the following code in your Prebid.js configuration:

{% highlight js %}

pbjs.setS2SConfig({

  // String (required): The account ID obtained in step 1.
  accountId: '1',

  // Boolean (required): Enables S2S - defaults to `false`.
  enabled: true,

  // Array[String] (required): List of bidder codes to enable for S2S.
  // Note that these must have been included in the Prebid.js build
  // from Step 2.
  bidders: ['appnexus', 'pubmatic'],

  // Number (optional): Timeout for bidders called via the S2S
  // endpoint, in milliseconds. Default value is 1000.
  timeout: 1000,

  // String (optional): Adapter code for S2S. Defaults to 's2s'.
  adapter: 's2s',

  // String (optional): Will override the default endpoint for Prebid Server.
  endpoint: 'http://prebid.adnxs.com'
});

{% endhighlight %}

## Related Topics

+ [Prebid.js Developer Docs]({{}}/dev-docs/getting-started.html)

</div>
