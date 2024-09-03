---
layout: api_prebidjs
title: pbjs.clearAllAuctions
description:
sidebarType: 1
---


Utility to clear all ad units of bids. This is useful for testing or to clear caches in a single page application.

```javascript
// Function to call when the URL changes
function onUrlChange() {
    pbjs.clearAllAuctions();
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
