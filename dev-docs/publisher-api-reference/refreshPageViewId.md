---
layout: api_prebidjs
title: pbjs.refreshPageViewId
description:
sidebarType: 1
---

Refreshes the previously generated page view ID. Can be used to instruct bidders that use page view ID to consider future auctions as part of a new page load.

```javascript
// Function to call when the URL changes
function onUrlChange() {
    pbjs.refreshPageViewId();
}

// Function to initialize the URL change listener
function initUrlChangeListener() {
    // Listen for changes to the history state
    window.addEventListener('popstate', onUrlChange);

    // Optionally, you might want to handle the initial load as well
    onUrlChange();
}

// Call the function to set up the listener
initUrlChangeListener();

```

<hr class="full-rule" />
