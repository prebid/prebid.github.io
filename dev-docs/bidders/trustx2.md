---
layout: bidder
title: TRUSTX 2.0
description: Prebid TRUSTX 2.0 Bidder Adapter
pbjs: true
pbs: true
biddercode: trustx2
media_types: banner, video
multiformat_supported: will-bid-on-any
tcfeu_supported: true
usp_supported: true
gpp_supported: true
schain_supported: true
floors_supported: true
userIds: all
tcf2_supported: true
coppa_supported: true
fpd_supported: true
sidebarType: 1

---

### Integration

Approval from the TRUSTX team is required for the TRUSTX 2.0 Header Bidding adapter.
For additional information, please reach out to <prebid@trustx.org>.

### Bid Params

{: .table .table-bordered .table-striped }
| Name | Scope    | Description        | Example     | Type      |
|------|----------|--------------------|-------------|-----------|
| `publisher_id` | required | Publisher ID | `'0000'` | `string`  |
| `placement_id` | required | Placement ID | `'11111'` | `string`  |
| `bidfloor` | optional | Bid Floor | `2.3` | `float` |
| `bidfloorcur` | optional | Bid Floor Currency | `'USD'` | `string` |


<a name="trustx2-bidder-config"></a>

### Bidder Config

You can allow writing in localStorage using `pbjs.setBidderConfig` for the bidder `trustx2`

```javascript
pbjs.setBidderConfig({
    bidders: ["trustx2"],
    config: {
        localStorageWriteAllowed: true
    }
})
```

This allows the TRUSTX 2.0 Bid Adapter to write userId in first party localStorage, which facilitates user identification and ensures data privacy management.

<a name="trustx2-first-party"></a>

### First Party Data

Publishers should use the `ortb2` method of setting [First Party Data](https://docs.prebid.org/features/firstPartyData.html).

Global site or user data using `setConfig()`, or Bidder-specific using `setBidderConfig()` is supported.

<a name="trustx2-site-data"></a>

#### Site Data Fields

TRUSTX 2.0 adapter supports the following standard OpenRTB 2.5 site fields:

{: .table .table-bordered .table-striped }
| Field       | Description                                                              | Example                                     | Type             |
|-------------|--------------------------------------------------------------------------|---------------------------------------------|------------------|
| `name`      | Site name                                                                | `'Publisher Site'`                          | `string`         |
| `domain`    | Domain of the site (e.g., "example.com")                                 | `'example.com'`                             | `string`         |
| `page`      | URL of the page where the impression will be shown                       | `'https://example.com/article'`             | `string`         |
| `ref`       | Referrer URL that caused navigation to the current page                  | `'https://google.com'`                      | `string`         |
| `search`    | Search string that caused navigation to the current page                 | `'news article example'`                    | `string`         |
| `keywords`  | Comma-separated list of keywords relevant to the current page            | `'news,politics,current events'`            | `string`         |
| `cat`       | Array of IAB content categories for the current site                     | `['IAB1', 'IAB2-1']`                        | `string array`   |
| `pagecat`   | Array of IAB content categories for the current page                     | `['IAB1-2', 'IAB3-1']`                      | `string array`   |

Example configuration:

```javascript
pbjs.setConfig({
  ortb2: {
    site: {
      name: "Publisher Site",
      domain: "example.com",
      page: "https://example.com/article",
      cat: ["IAB1", "IAB2"],
      keywords: "news,politics,current events"
    }
  }
});
```

<a name="x2-content-data"></a>

#### Content Data Fields

The adapter supports these content-specific fields:

{: .table .table-bordered .table-striped }
| Field      | Description                                                   | Example                      | Type           |
|------------|---------------------------------------------------------------|-----------------------------|----------------|
| `id`       | Content identifier                                            | `'article-12345'`           | `string`       |
| `title`    | Content title                                                 | `'Breaking News Article'`   | `string`       |
| `series`   | Content series                                                | `'World News'`              | `string`       |
| `season`   | Content season                                                | `'2023'`                    | `string`       |
| `episode`  | Content episode                                               | `'15'`                      | `string`       |
| `genre`    | Genre of the content                                          | `'news'`                    | `string`       |
| `data`     | Array of content segment objects following the data object format | See example below        | `object array` |

Example configuration with content:

```javascript
pbjs.setConfig({
  ortb2: {
    site: {
      content: {
        id: "article-12345",
        title: "Breaking News Article",
        series: "World News",
        season: "2023",
        episode: "15",
        genre: "news",
        data: [{
          name: "content-classification",
          segment: [
            { id: "segment1", value: "news" },
            { id: "segment2", value: "politics" }
          ]
        }]
      }
    }
  }
});
```

<a name="x2-user-data"></a>

#### User Data

The adapter supports user data fields:

{: .table .table-bordered .table-striped }
| Field      | Description                                                       | Example                            | Type           |
|------------|-------------------------------------------------------------------|-----------------------------------|----------------|
| `data`     | Array of user data segment objects with name and segment fields   | See example below                  | `object array` |
| `ext.eids` | External user identifiers (from Prebid.js User ID modules)        | Automatically included when available | `object array` |
| `ext.device` | Device-specific information                                     | `{ type: "mobile", os: "iOS" }`    | `object`       |

Example configuration with user data:

```javascript
pbjs.setConfig({
  ortb2: {
    user: {
      data: [{
        name: "demographic",
        segment: [
          { id: "segment1", value: "age_group_25-34" }
        ]
      }],
      ext: {
        device: {
          type: "mobile",
          os: "iOS"
        }
      }
    }
  }
});
```

<a name="x2-extensions"></a>

#### Site and User Extensions

The adapter also supports site.ext and user.ext for custom extensions:

```javascript
pbjs.setConfig({
  ortb2: {
    site: {
      ext: {
        custom_site_field: "custom_value",
        amp: 1,
        premium: true
      }
    },
    user: {
      ext: {
        custom_user_field: "custom_value"
      }
    }
  }
});
```

<a name="x2-gdpr-usp-gpp"></a>

### GDPR, USP and GPP Support

The TRUSTX 2.0 adapter supports GDPR, US Privacy (CCPA), and Global Privacy Platform (GPP) consent signals.

The adapter will:
- Pass GDPR consent information to bid requests when available
- Pass US Privacy/CCPA consent strings when available
- Support GPP signals when provided
- Handle user data deletion requests according to privacy regulations
