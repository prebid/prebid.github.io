---
layout: page_v2
sidebarType: 5
title: Prebid Server | Developers | Module Analytics Tags Conventions

---

# Prebid Server - Module Analytics Tags Conventions
{: .no_toc}

* TOC
{:toc }

## Overview

Analytics Tags (aka ‘ATags’) are a log mechanism provided by PBS-core to modules
to allow them to inform analytics adapters about what happened in the request.
Use of the Analytics Tag structure is completely optional, for when there are application or reporting reasons for sharing the results.
See the [Prebid Server module overview](/prebid-server/developers/add-a-module.html) for background information.

This document defines a convention aimed at allowing module developers to create
consistent ATags that can be easily read by analytics adapters.

![Prebid Server ATags](/assets/images/prebid-server/module-atags.png){:class="pb-xlg-img"}

1. Modules may return a data structure containing ATags to PBS-Core.
2. PBS-Core adds any ATags to the 'invocation context' data structure.
3. Analytics modules have access to the invocation context.

## Analytics Tag Conventions



## Designing Analytics Tags

## Parsing the Invocation Context

## Further Reading

- [PBS Module Overview](/prebid-server/developers/add-a-module.html)
