---
layout: page_v2
sidebarType: 5
title: Prebid Server | Features | Audio Support

---

# Prebid Server | Features | Audio Support

Support for the Audio format in Prebid Server is simple:

1. Bid adpaters supporting the audio format will see imp.audio objects. It is up to each adapter to pass this to their endpoint appropriately.
1. PBS does no validation on the audio object than enforcing that it's valid ORTB.
1. No audio podding support is currently available.


## Related Reading
- [Prebid Native Format](/formats/native.html)
