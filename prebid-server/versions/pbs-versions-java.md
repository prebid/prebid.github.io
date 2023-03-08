---
layout: page_v2
sidebarType: 5
title: Prebid Server | Versions | Java

---

# Prebid Server - Java

<div class="row">
    <div class="col-md-6">

The Java version of Prebid Server is for those who:
<ul>
<li> Want to host Programmatic Guaranteed</li>
<li> Or just prefer the Java language</li>
</ul>

</div>
<div class="col-md-6 centered">

<img src="/assets/images/prebid-server/java-logo.png" width="50" alt="Java Logo">

</div>
</div>


## Features

We recommend you review the [feature comparison list](/prebid-server/features/pbs-feature-idx.html) to familiarize yourself with the differences between this and PBS-Go in deciding which version is right for you.

## Code Repositories

- [Prebid Server - Java](https://github.com/prebid/prebid-server-java)
- [Prebid Cache Server - Java](https://github.com/prebid/prebid-cache-java)

## Installation

See [Hosting your own Prebid Server](/prebid-server/hosting/pbs-hosting.html) for
important architectural considerations, then follow the instructions for [Installing PBS-Java](/prebid-server/developers/installing-java.html).

## Quick Start

There are a few test requests in sample/requests that work with prebid-config-file-bidders.yaml and the files in the samples/stored directory.

1) Follow the instructions in the root-level README.txt file to build the server

2) Start the server pointing to a config in the sample directory. e.g.

```
java -jar target/prebid-server.jar --spring.config.additional-location=sample/prebid-config.yaml
```

3) Use one of the stored requests in the sample directory with curl:

```bash
cd sample
curl --header "X-Forwarded-For: 151.101.194.216" -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36' -H 'Referer: https://example.com/demo/' -H "Content-Type: application/json" http://localhost:8080/openrtb2/auction --data @FILENAME
```

Where FILENAME is one of:

- rubicon-storedresponse.json - this is a request that calls for a stored-auction-response.
- appnexus-disabled-gdpr.json - this is a request that actually calls the appnexus endpoint after disabling GDPR by setting regs.ext.gdpr:0
- pbs-stored-req-test-video.json - this is a stored-request/response chain returning a VAST document

## References

- [Building an Analytics Adapter](/prebid-server/developers/pbs-build-an-analytics-adapter.html#adding-an-analytics-adapter-in-pbs-java)

## See Also

- [Prebid Server - Go](/prebid-server/versions/pbs-versions-go.html)
- [Endpoint reference](/prebid-server/endpoints/pbs-endpoint-overview.html)
