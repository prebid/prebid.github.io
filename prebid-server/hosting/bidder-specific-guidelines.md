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

### PBS-Go

You might want to consider disabling bid adapters that you're not 
going to utilize in order to control which bidders get into the [/cookie_sync](/prebid-server/endpoints/pbs-endpoint-cookieSync.html) response when you're running the `coopSync` flag.

To disable a bid adapter, in your main pbs.yaml file, set:

```
adapters:
  BIDDERCODE:
    disabled: true
```

If the bidder supports different endpoints per geography, you can deploy different
config in each of your datacenters:

```
adapters:
  BIDDERCODE:
    endpoint: REGION_SPECIFIC_ENDPOINT
```

### PBS-Java

To enable a bid adapter, in your main YAML file, set:

```
adapters:
  BIDDERCODE:
    enabled: true
```

If the bidder supports different endpoints per geography, you can deploy different
config in each of your datacenters:

```
adapters:
  BIDDERCODE:
    enabled: true
    endpoint: REGION_SPECIFIC_ENDPOINT
```

## Bidders

### Rubicon

If you'd like to run the [rubicon](/dev-docs/bidders/rubicon.html) Prebid Server adapter, here's the process:

1. Contact globalsupport@magnite.com explaining who you are and that you'd like to set up a Prebid Server that utilizes the rubicon adapter.
2. They will ask you a bunch of questions and hopefully approve your application.
3. If they do approve, you'll be given a login and password to place in your configuration. Please do not share this with anyone else. You'll also be provided a usersync URL.
4. The Magnite XAPI has several regional endpoints that you can utilize. Note that the default endpoint in the open source config is for US-East, which may not perform as well for you as the other regional options if your datacenters are in Europe or Asia.

- US-East: https://exapi-rpprebidserver-us-east.rubiconproject.com/a/api/exchange?tk_sdc=us-east
- US-West: https://exapi-rpprebidserver-us-west.rubiconproject.com/a/api/exchange?tk_sdc=us-west
- Asia: https://exapi-rpprebidserver-apac.rubiconproject.com/a/api/exchange?tk_sdc=apac
- Europe: https://exapi-rpprebidserver-eu.rubiconproject.com/a/api/exchange?tk_sdc=eu

## Related Reading

- [Hosting a Prebid Server Cluster](/prebid-server/hosting/pbs-hosting.html)
