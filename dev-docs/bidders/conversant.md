+---
+layout: bidder
+title: Conversant Media
+description: Prebid Conversant Media Bidder Adaptor 
 
+top_nav_section: dev_docs
+nav_section: reference
+
+hide: true
+
+biddercode: conversant
+
+biddercode_longer_than_12: false
+
+---
+
+
+### bid params
+
+{: .table .table-bordered .table-striped }
+| Name | Scope | Description | Example |
+| :--- | :---- | :---------- | :------ |
+| `site_id` | required | Site ID registered in Conversant system | `123` |
+| `secure` | required | Whether to load HTTPS ad code | `1` |
+| `bidFloor` | optional | Minimum bid amount | `2.00` |
