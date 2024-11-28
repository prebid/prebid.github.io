---
layout: bidder
title: BeOp
description: BeOp Bidder Adaptor
pbjs: true
pbs: false
media_types: banner
biddercode: beop
tcfeu_supported: true
gvl_id: 666
usp_supported: false
floors_supported: true
schain_supported: true
sidebarType: 1
---

### Disclosure

The BeOp bidder adaptor needs an account id that you can find as a publisher, a reseller or a media group directly in your BeOp platform access. We also need to approve your account to be available for BeOp demand, so don't hesitate to reach your account manager or <publishers@beop.io> for more information.

### Bid Params

{: .table .table-bordered .table-striped }
| Name | Scope | Description | Example | Type |
|---------------|----------|-------------|---------|----------|
| `accountId` or `networkId` | required | Your BeOp account ID | `'5a8af500c9e77c00017e4cad'` | `string` |
| `networkPartnerId` | optional | Your own partner ID if you are a network | `'MY-WEBSITE-123'` | `string` |
| `currency` | optional | Your currency | `'EUR'` (default) or `'USD'` | `string` |

## Why BeOp Requires Storage Access in Prebid.js

At BeOp, we prioritize transparency and respect for user privacy. Here’s why we request storage access:

### 1. Usage of First-Party Cookies

We use the first-party cookie beopid exclusively. This allows us to manage session and user preferences without relying on third-party cookies, ensuring compliance with privacy standards like GDPR.

### 2. Capping Features for Publishers

Storage access helps us enforce capping mechanisms directly on the publisher’s domain, ensuring a better user experience by limiting the frequency of ad displays.

### 3. Enhanced User Interaction

We provide engaging voting experiences on BeOp formats. By using storage, we enable features such as resuming a voting session where the user last left off, making the interaction seamless and user-friendly.

### 4. Revenue Optimization in Compliance with GDPR

Storage access helps us improve bidding performance by aligning with GDPR consents. This ensures that external bidders can leverage compliant data to drive better revenue outcomes for publishers.

By granting storage access, publishers empower us to provide these features while respecting user privacy and enhancing the overall experience.
