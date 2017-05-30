---
layout: page
title: Creative setup
description: Creative setup
pid: 0
top_nav_section: prebid-mobile
nav_section: prebid-mobile-adops
---

<div class="bs-docs-section" markdown="1">

# Creative setup
{:.no_toc}

Add the following code snippets to your creative in your line items.

### For DFP

```
<script type="text/javascript" src = "//acdn.adnxs.com/mobile/prebid/mbpb.js"></script>
<script type="text/javascript">
    apntag.showAdFromCacheId({
        admCacheID : '%%PATTERN:pb_cache_id%%'
    });
</script>
```

### For MoPub

```
<script type="text/javascript" src = "//acdn.adnxs.com/mobile/prebid/mbpb.js"></script>
<script type="text/javascript">
    apntag.showAdFromCacheId({
        admCacheID: '%%KEYWORD:pb_cache_id%%’  
    });
</script>
```

</div>
