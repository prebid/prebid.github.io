---
layout: page_v2
sidebarType: 5
title: Prebid Server | Use Cases | Long Form Video

---

# Use Case: Prebid Server | Long Form Video
{: .no_toc}

* TOC
{:toc}

Prebid Server (PBS) supports filling _pods_ of multiple video advertisements, including support for competitve separation.

## Workflow

Here's a workflow diagramming how this works.

![Prebid Server Long Form Video](/assets/images/flowcharts/prebid-server/pbs-lfv-flow.png){:class="pb-xlg-img"}

1. Application makes request for a video stream.
2. An SSAI Server sends a video request to PBS, specifying the pod requirements.
3. PBS sends a request for bids to selected demand partners by relaying OpenRTB requests to them.
4. Demand partners return a bid response to PBS. If competitive seperation is enabled, PBS peforms [category translation](/dev-docs/modules/categoryTranslation.html) on each bid. Whether category translation is required or not, the bids are stored in prebid cache.
5. PBS generates key-value pairs that are comprised of price, category, and duration values.
6. The SSAI server parses the returned key-values, appending them as a query string to the ad server request URL and submits the request.
7. The ad server returns the optimized pod.
8. The SSAI server requests the creatives from prebid cache.
9. The SSAI server requests the content from the content host and stitches the creatives and content together.
10. The stitched stream is returned to the application.

## Further Reading
- [Long Form Video Endpoint](/prebid-server/endpoints/openrtb2/pbs-endpoint-video.html)
