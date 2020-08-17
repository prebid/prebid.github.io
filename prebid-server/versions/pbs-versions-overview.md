---
layout: page_v2
sidebarType: 5
title: Prebid Server | Versions | Overview

---

# Prebid Server Code Bases

Prebid Server has two code bases: Go and Java. The original version of Prebid Server was the Go-Lang version. Rubicon Project ported it to Java because they had more engineers who knew Java than Go.

- [Prebid Server - Go](/prebid-server/versions/pbs-versions-go.html)
- [Prebid Server - Java](/prebid-server/versions/pbs-versions-java.html)

Both versions are live in production, and they are kept identical in external APIs and reasonably close in functionality.

For demand partners, we recommend building new bid adapters in Go - the team will port it to Java for you within a couple of months.

For those looking to host a Prebid Server, here's some guidance on selecting which version to use:

- If you plan to use long-form video, we recommend the Go version of the server.
- Look over the [features in each version](/prebid-server/features/pbs-feature-idx.html) and see if there are any available in only one version that are important to you.
- Otherwise, just choose the language your engineering team is most comfortable with inspecting and enhancing.
