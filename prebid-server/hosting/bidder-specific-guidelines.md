---
layout: page_v2
title: Bidder-Specific Hosting Guidelines
description: Bidder-Specific Hosting Guidelines
pid: 0
sidebarType: 5
---

# Bidder-Specific Hosting Guidelines
{:.no_toc}

* TOC
{:toc}

## Setting up a Bid Adapter

In general, a PBS host company may want to run only the server-side bid adapters they require.

PBS-Go enables most bidders by default. PBS-Java doesn't enable any bidders by default.

### Geographic Regions

Bidders can declare certain geographic details in their YAML that host companies should be aware of:

1. Some bidders (e.g. rubicon) have region-specific auction endpoints. They want the host company to choose the closest matching endpoint. e.g. if the bidder says they have two endpoint "us" and "eu", you should deploy that bidders YAML with the appropriate endpoint value when you deploy to your various datacenters. Your DevOps team should be able to do this with whatever system you're using to deploy.
1. Some bidders (e.g. 33across) don't do business globally. They won't bid on requests in certain regions, so it helps everyone to avoid sending them bid requests outside of their scope of business. Please look for a `geoscope` parameter in the bidder's YAML file and consider disabling that bidder in regions where it might not make sense to call them. Again, your DevOps team should be able to manage this.

Note that Prebid Server does not have the ability to automatically determine its datacenter region and take these actions for host companies. It must be done as part of the deploy.

### PBS-Go

You might want to consider disabling bid adapters that you're not 
going to utilize in order to control which bidders get into the [/cookie_sync](/prebid-server/endpoints/pbs-endpoint-cookieSync.html) response when you're running the `coopSync` flag.

To disable a bid adapter, in your main pbs.yaml file, set:

```yaml
adapters:
  BIDDERCODE:
    disabled: true
```

As noted above, if the bidder supports different endpoints per geography, you can deploy different
config in each of your datacenters:

```yaml
adapters:
  BIDDERCODE:
    endpoint: REGION_SPECIFIC_ENDPOINT
```

### PBS-Java

To enable a bid adapter, in your main YAML file, set:

```yaml
adapters:
  BIDDERCODE:
    enabled: true
```

As noted above, if the bidder supports different endpoints per geography, you can deploy different
config in each of your datacenters:

```yaml
adapters:
  BIDDERCODE:
    enabled: true
    endpoint: REGION_SPECIFIC_ENDPOINT
```

## Bidder-Specific Details

### Rubicon

If you'd like to run the [rubicon](/dev-docs/bidders/rubicon.html) Prebid Server adapter, here's the process:

1. Contact "globalsupport@magnite.com" explaining who you are and that you'd like to set up a Prebid Server that utilizes the rubicon adapter.
2. They will ask you a bunch of questions and hopefully approve your application.
3. If they do approve, you'll be given a login and password to place in your configuration. Please do not share this with anyone else. You'll also be provided a usersync URL.
4. The Magnite XAPI has several regional endpoints that you can utilize. Note that the default endpoint in the open source config is for US-East, which may not perform as well for you as the other regional options if your datacenters are in Europe or Asia.

## Related Reading

- [Hosting a Prebid Server Cluster](/prebid-server/hosting/pbs-hosting.html)
