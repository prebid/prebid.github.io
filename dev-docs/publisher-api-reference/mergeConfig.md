---
layout: api_prebidjs
title: pbjs.mergeConfig(options)
description:
---

This is the same as [`setConfig(options)`](/dev-docs/publisher-api-reference/setConfig.html) except that it merges the supplied config into the structure rather than replacing it.

This is a convenience function, particularly useful to real time data modules, so one doesn't have to read the
config structure, update it, then call setConfig.
