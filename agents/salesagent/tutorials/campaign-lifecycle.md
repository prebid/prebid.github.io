---
layout: page_v2
title: Prebid Sales Agent - Campaign Lifecycle Tutorial
description: End-to-end tutorial walking through a complete advertising campaign lifecycle with the Prebid Sales Agent, from discovery to delivery
sidebarType: 10
---

# Prebid Sales Agent - Campaign Lifecycle Tutorial
{: .no_toc}

- TOC
{:toc}

## Prerequisites

Before starting this tutorial, ensure you have:

1. The Sales Agent running locally (see [Quick Start](/agents/salesagent/getting-started/quickstart.html) or [Development Setup](/agents/salesagent/developers/dev-setup.html)).
2. The mock adapter configured (this is the default in the development environment).
3. Test credentials available (`test-token` for API access).
4. Python 3.12+ with the `fastmcp` package installed: `uv pip install fastmcp`

All examples in this tutorial use the mock adapter, which simulates a complete ad server without requiring any external services. The mock adapter supports all campaign lifecycle operations and responds with realistic data.

## The Scenario

**TechCorp**, a technology company, wants to run a display advertising campaign targeting US tech enthusiasts. Here are the campaign details:

{: .table .table-bordered .table-striped }
| Parameter | Value |
|-----------|-------|
| Advertiser | TechCorp |
| Goal | Drive awareness for a new developer tool |
| Budget | $5,000 |
| Flight Dates | April 1 -- April 30, 2026 |
| Target Audience | US-based tech enthusiasts, developers |
| Creative Format | Display banners (300x250, 728x90) |
| Pricing Model | CPM (cost per thousand impressions) |

We will walk through every step of the campaign lifecycle using the Sales Agent's MCP tools, showing the exact requests and responses at each stage.

## Step 1: Discover Capabilities

The first step is always to call `get_adcp_capabilities` to understand what the publisher supports. This tells you the available protocols, targeting options, creative formats, and business rules.

### Request

```python
result = await client.call_tool("get_adcp_capabilities")
```

### Response

```json
{
  "tenant": {
    "name": "Demo Publisher",
    "portfolio_description": "A premium digital media network reaching 50M monthly unique visitors across technology, business, and lifestyle verticals.",
    "adapter": "mock",
    "protocols": ["mcp", "a2a", "rest"]
  },
  "capabilities": {
    "supported_channels": ["display", "video", "audio"],
    "supported_pricing_models": ["cpm", "cpc", "cpd", "flat_rate"],
    "supported_targeting": {
      "geographic": ["country", "state", "city", "dma"],
      "demographic": ["age_range", "gender", "income"],
      "contextual": ["category", "keyword", "topic"],
      "behavioral": ["interest", "intent"],
      "device": ["device_type", "os", "browser"]
    },
    "currency": "USD",
    "min_budget": 500,
    "max_budget": 1000000,
    "workflow_required": true,
    "creative_review_required": true
  },
  "tools": [
    "get_adcp_capabilities",
    "get_products",
    "list_creative_formats",
    "list_authorized_properties",
    "create_media_buy",
    "update_media_buy",
    "get_media_buys",
    "get_media_buy_delivery",
    "sync_creatives",
    "list_creatives",
    "update_performance_index"
  ]
}
```

### What This Tells Us

- The publisher supports **display, video, and audio** channels -- display fits our needs.
- **CPM pricing** is available.
- **Geographic and contextual targeting** are supported, so we can target US tech audiences.
- **Workflow approval is required** -- the publisher reviews campaigns before activation.
- **Creative review is required** -- uploaded creatives need approval.
- The minimum budget is $500 and our $5,000 budget is well within range.

## Step 2: Search for Products

Next, call `get_products` with a natural-language brief describing the campaign goal. The AI ranking agent scores products by relevance to the brief and returns them in ranked order.

### Request

```python
result = await client.call_tool("get_products", {
    "brief": "display ads targeting US tech enthusiasts, developers, $5000 budget"
})
```

### Response

```json
{
  "products": [
    {
      "id": "prod-tech-display-001",
      "name": "Tech Audience - Premium Display",
      "description": "Reach technology professionals and enthusiasts across our network of developer blogs, tech news sites, and software review portals. High-intent audience with strong engagement metrics.",
      "channels": ["display"],
      "pricing_options": [
        {
          "id": "price-001",
          "model": "cpm",
          "rate": 12.50,
          "currency": "USD",
          "minimum_spend": 1000
        },
        {
          "id": "price-002",
          "model": "cpc",
          "rate": 2.75,
          "currency": "USD",
          "minimum_spend": 500
        }
      ],
      "targeting": {
        "contextual": ["technology", "software", "programming"],
        "geographic": ["US"]
      },
      "estimated_reach": {
        "daily_impressions": 150000,
        "daily_uniques": 45000
      },
      "relevance_score": 0.95
    },
    {
      "id": "prod-tech-video-001",
      "name": "Tech Audience - Video Pre-Roll",
      "description": "Video pre-roll ads served on tech tutorial and review video content. High completion rates with an engaged developer audience.",
      "channels": ["video"],
      "pricing_options": [
        {
          "id": "price-003",
          "model": "cpm",
          "rate": 25.00,
          "currency": "USD",
          "minimum_spend": 2500
        }
      ],
      "targeting": {
        "contextual": ["technology", "tutorials"],
        "geographic": ["US"]
      },
      "estimated_reach": {
        "daily_impressions": 50000,
        "daily_uniques": 30000
      },
      "relevance_score": 0.78
    },
    {
      "id": "prod-ron-display-001",
      "name": "Run of Network - Display",
      "description": "Broad reach display advertising across all network properties. Cost-effective for awareness campaigns.",
      "channels": ["display"],
      "pricing_options": [
        {
          "id": "price-004",
          "model": "cpm",
          "rate": 4.00,
          "currency": "USD",
          "minimum_spend": 500
        }
      ],
      "targeting": {
        "geographic": ["US"]
      },
      "estimated_reach": {
        "daily_impressions": 500000,
        "daily_uniques": 200000
      },
      "relevance_score": 0.52
    }
  ],
  "total": 3,
  "ranking_model": "gemini-2.0-flash"
}
```

### What This Tells Us

The AI ranked **"Tech Audience - Premium Display"** highest (0.95 relevance score). It offers CPM pricing at $12.50, targets technology and programming contexts in the US, and reaches 150K daily impressions. This is a strong match for our campaign.

With a $5,000 budget at $12.50 CPM, we can expect approximately 400,000 impressions over the campaign flight.

## Step 3: Check Creative Formats

Before uploading creatives, call `list_creative_formats` to understand the exact specifications for display ads.

### Request

```python
result = await client.call_tool("list_creative_formats")
```

### Response

```json
{
  "formats": [
    {
      "id": "fmt-display-300x250",
      "name": "Medium Rectangle",
      "channel": "display",
      "mime_types": ["image/png", "image/jpeg", "image/gif"],
      "dimensions": {
        "width": 300,
        "height": 250
      },
      "max_file_size_bytes": 150000,
      "max_animation_duration_seconds": 30,
      "requirements": "Static or animated. Max 3 animation loops. Must include a visible border."
    },
    {
      "id": "fmt-display-728x90",
      "name": "Leaderboard",
      "channel": "display",
      "mime_types": ["image/png", "image/jpeg", "image/gif"],
      "dimensions": {
        "width": 728,
        "height": 90
      },
      "max_file_size_bytes": 150000,
      "max_animation_duration_seconds": 30,
      "requirements": "Static or animated. Max 3 animation loops. Must include a visible border."
    },
    {
      "id": "fmt-display-160x600",
      "name": "Wide Skyscraper",
      "channel": "display",
      "mime_types": ["image/png", "image/jpeg", "image/gif"],
      "dimensions": {
        "width": 160,
        "height": 600
      },
      "max_file_size_bytes": 150000,
      "max_animation_duration_seconds": 30,
      "requirements": "Static or animated. Max 3 animation loops."
    },
    {
      "id": "fmt-video-preroll",
      "name": "Video Pre-Roll",
      "channel": "video",
      "mime_types": ["video/mp4"],
      "dimensions": {
        "width": 1920,
        "height": 1080
      },
      "max_file_size_bytes": 50000000,
      "max_duration_seconds": 30,
      "requirements": "MP4 H.264 codec. Audio required. Max 30 seconds."
    }
  ]
}
```

### What This Tells Us

For our display campaign, we need:

- **Medium Rectangle (300x250)** and **Leaderboard (728x90)** -- both accept PNG, JPEG, or GIF.
- Maximum file size is 150KB per creative.
- Animated GIFs are allowed with up to 30 seconds of animation and 3 loops.

## Step 4: View Publisher Properties

Call `list_authorized_properties` to see the publisher's domains and sites where ads will appear.

### Request

```python
result = await client.call_tool("list_authorized_properties")
```

### Response

```json
{
  "properties": [
    {
      "id": "prop-001",
      "name": "TechDaily.com",
      "domain": "techdaily.com",
      "channels": ["display", "video"],
      "categories": ["technology", "software", "programming"],
      "monthly_pageviews": 12000000,
      "description": "Leading technology news and analysis"
    },
    {
      "id": "prop-002",
      "name": "DevHub Blog Network",
      "domain": "devhub.io",
      "channels": ["display"],
      "categories": ["programming", "devops", "cloud"],
      "monthly_pageviews": 8000000,
      "description": "Developer-focused blog network covering modern software development"
    },
    {
      "id": "prop-003",
      "name": "GadgetReview",
      "domain": "gadgetreview.com",
      "channels": ["display", "video"],
      "categories": ["technology", "consumer_electronics", "reviews"],
      "monthly_pageviews": 5000000,
      "description": "In-depth technology product reviews and comparisons"
    }
  ],
  "portfolio_description": "A premium digital media network reaching 50M monthly unique visitors across technology, business, and lifestyle verticals.",
  "advertising_policies": {
    "prohibited_categories": ["gambling", "tobacco", "weapons", "adult"],
    "creative_requirements": "All creatives must include brand name. No misleading claims. Landing page must match advertised product.",
    "approval_sla_hours": 24
  }
}
```

### What This Tells Us

The publisher operates three technology-focused properties with a combined 25M monthly pageviews. Our tech-focused campaign will appear across these sites. Note the advertising policies -- our creatives must include the TechCorp brand name and the landing page must match our product.

## Step 5: Create the Media Buy

Now we have all the information needed to create the media buy. We will use the "Tech Audience - Premium Display" product with CPM pricing.

### Request

```python
result = await client.call_tool("create_media_buy", {
    "name": "TechCorp Developer Tool Launch - Q2 2026",
    "buyer_ref": "TC-2026-Q2-001",
    "packages": [
        {
            "product_id": "prod-tech-display-001",
            "pricing_option_id": "price-001",
            "name": "Tech Display - Medium Rectangle",
            "budget": 3000,
            "start_date": "2026-04-01",
            "end_date": "2026-04-30",
            "targeting": {
                "geographic": {"countries": ["US"]},
                "contextual": {"categories": ["technology", "programming"]},
                "device": {"device_types": ["desktop", "tablet"]}
            },
            "creative_format_ids": ["fmt-display-300x250"]
        },
        {
            "product_id": "prod-tech-display-001",
            "pricing_option_id": "price-001",
            "name": "Tech Display - Leaderboard",
            "budget": 2000,
            "start_date": "2026-04-01",
            "end_date": "2026-04-30",
            "targeting": {
                "geographic": {"countries": ["US"]},
                "contextual": {"categories": ["technology", "software"]},
                "device": {"device_types": ["desktop"]}
            },
            "creative_format_ids": ["fmt-display-728x90"]
        }
    ],
    "total_budget": 5000,
    "currency": "USD"
})
```

### Response

```json
{
  "media_buy": {
    "id": "mb-a1b2c3d4-5678-9012-3456-789012345678",
    "name": "TechCorp Developer Tool Launch - Q2 2026",
    "buyer_ref": "TC-2026-Q2-001",
    "status": "pending_activation",
    "total_budget": 5000.00,
    "currency": "USD",
    "packages": [
      {
        "id": "pkg-001",
        "name": "Tech Display - Medium Rectangle",
        "product_id": "prod-tech-display-001",
        "budget": 3000.00,
        "start_date": "2026-04-01",
        "end_date": "2026-04-30",
        "pricing_model": "cpm",
        "rate": 12.50,
        "estimated_impressions": 240000,
        "creative_format_ids": ["fmt-display-300x250"],
        "targeting": {
          "geographic": {"countries": ["US"]},
          "contextual": {"categories": ["technology", "programming"]},
          "device": {"device_types": ["desktop", "tablet"]}
        }
      },
      {
        "id": "pkg-002",
        "name": "Tech Display - Leaderboard",
        "product_id": "prod-tech-display-001",
        "budget": 2000.00,
        "start_date": "2026-04-01",
        "end_date": "2026-04-30",
        "pricing_model": "cpm",
        "rate": 12.50,
        "estimated_impressions": 160000,
        "creative_format_ids": ["fmt-display-728x90"],
        "targeting": {
          "geographic": {"countries": ["US"]},
          "contextual": {"categories": ["technology", "software"]},
          "device": {"device_types": ["desktop"]}
        }
      }
    ],
    "created_at": "2026-03-09T14:30:00Z",
    "workflow_tasks": [
      {
        "id": "task-review-001",
        "type": "publisher_review",
        "status": "pending",
        "description": "Publisher review required before campaign activation"
      }
    ]
  }
}
```

### What This Tells Us

The media buy was created successfully with ID `mb-a1b2c3d4-5678-9012-3456-789012345678`. Key observations:

- **Status is `pending_activation`** -- the campaign needs publisher approval before it goes live.
- **Two packages** were created, splitting the $5,000 budget between 300x250 ($3,000) and 728x90 ($2,000) formats.
- **Estimated impressions**: 240,000 + 160,000 = 400,000 total at $12.50 CPM.
- **A workflow task** (`task-review-001`) was created for publisher review. We will need to handle this in Step 7.

## Step 6: Upload Creatives

Upload the display ad creatives for both packages using `sync_creatives`. The creatives are submitted with their format, click-through URL, and base64-encoded asset data.

### Request

```python
result = await client.call_tool("sync_creatives", {
    "media_buy_id": "mb-a1b2c3d4-5678-9012-3456-789012345678",
    "creatives": [
        {
            "name": "TechCorp DevTool - 300x250",
            "format_id": "fmt-display-300x250",
            "click_url": "https://techcorp.example.com/devtool?utm_source=salesagent&utm_medium=display&utm_campaign=q2-launch",
            "assets": [
                {
                    "role": "primary",
                    "mime_type": "image/png",
                    "width": 300,
                    "height": 250,
                    "file_size_bytes": 87500,
                    "url": "https://cdn.techcorp.example.com/ads/devtool-300x250.png"
                }
            ],
            "alt_text": "TechCorp DevTool - Build faster with AI-powered development",
            "provenance": {
                "tool": "Adobe Creative Suite",
                "created_by": "TechCorp Design Team"
            }
        },
        {
            "name": "TechCorp DevTool - 728x90",
            "format_id": "fmt-display-728x90",
            "click_url": "https://techcorp.example.com/devtool?utm_source=salesagent&utm_medium=display&utm_campaign=q2-launch",
            "assets": [
                {
                    "role": "primary",
                    "mime_type": "image/png",
                    "width": 728,
                    "height": 90,
                    "file_size_bytes": 62000,
                    "url": "https://cdn.techcorp.example.com/ads/devtool-728x90.png"
                }
            ],
            "alt_text": "TechCorp DevTool - Ship code 10x faster",
            "provenance": {
                "tool": "Adobe Creative Suite",
                "created_by": "TechCorp Design Team"
            }
        }
    ]
})
```

### Response

```json
{
  "creatives": [
    {
      "id": "cr-001-300x250",
      "name": "TechCorp DevTool - 300x250",
      "format_id": "fmt-display-300x250",
      "status": "pending_review",
      "validation": {
        "passed": true,
        "checks": [
          {"check": "dimensions", "status": "passed", "detail": "300x250 matches format spec"},
          {"check": "file_size", "status": "passed", "detail": "87500 bytes < 150000 max"},
          {"check": "mime_type", "status": "passed", "detail": "image/png is accepted"}
        ]
      },
      "created_at": "2026-03-09T14:35:00Z"
    },
    {
      "id": "cr-002-728x90",
      "name": "TechCorp DevTool - 728x90",
      "format_id": "fmt-display-728x90",
      "status": "pending_review",
      "validation": {
        "passed": true,
        "checks": [
          {"check": "dimensions", "status": "passed", "detail": "728x90 matches format spec"},
          {"check": "file_size", "status": "passed", "detail": "62000 bytes < 150000 max"},
          {"check": "mime_type", "status": "passed", "detail": "image/png is accepted"}
        ]
      },
      "created_at": "2026-03-09T14:35:00Z"
    }
  ],
  "summary": {
    "total": 2,
    "pending_review": 2,
    "approved": 0,
    "rejected": 0
  }
}
```

### What This Tells Us

Both creatives passed format validation (dimensions, file size, MIME type) and are now in `pending_review` status. The publisher's creative review process (which may involve an AI review agent) will evaluate them for policy compliance. The creative lifecycle is:

```text
processing --> pending_review --> approved
                              --> rejected
```

## Step 7: Handle Approval Workflows

The media buy created a workflow task for publisher review, and the creatives are pending review. Workflow approvals are handled by the publisher through the Admin UI (or via Slack notifications if `hitl_webhook_url` is configured). The buying agent polls for status changes.

### Waiting for Approval

In a production environment, a publisher ad ops team member reviews the campaign in the Admin UI under **Workflow Tasks** and approves or rejects it. For testing, use the `X-Auto-Advance: true` header to bypass manual approval.

```python
# Poll until the media buy is approved
import asyncio

while True:
    result = await client.call_tool("get_media_buys", {
        "media_buy_ids": [media_buy_id]
    })
    status = result["media_buys"][0]["status"]
    if status in ("approved", "active", "delivering"):
        print(f"Media buy approved! Status: {status}")
        break
    elif status in ("rejected", "canceled"):
        print(f"Media buy {status}.")
        break
    print(f"Current status: {status} — waiting for publisher review...")
    await asyncio.sleep(30)
```

### Understanding HITL Workflows

The human-in-the-loop workflow is a core feature of the Sales Agent. It ensures that publishers maintain control over what runs on their properties. The workflow system:

- Automatically creates tasks based on tenant configuration (e.g., review required for all buys over $1,000).
- Supports AI-assisted review -- the creative review agent can auto-approve creatives above a configurable confidence threshold.
- Tracks the complete audit trail of who approved what and when.
- Can be bypassed in testing using the `X-Auto-Advance: true` header.

## Step 8: Monitor Campaign Status

After approvals are complete, check the media buy status to confirm it has transitioned to `active`.

### Request

```python
result = await client.call_tool("get_media_buys", {
    "media_buy_ids": ["mb-a1b2c3d4-5678-9012-3456-789012345678"]
})
```

### Response

```json
{
  "media_buys": [
    {
      "id": "mb-a1b2c3d4-5678-9012-3456-789012345678",
      "name": "TechCorp Developer Tool Launch - Q2 2026",
      "buyer_ref": "TC-2026-Q2-001",
      "status": "active",
      "total_budget": 5000.00,
      "currency": "USD",
      "packages": [
        {
          "id": "pkg-001",
          "name": "Tech Display - Medium Rectangle",
          "status": "active",
          "budget": 3000.00,
          "start_date": "2026-04-01",
          "end_date": "2026-04-30"
        },
        {
          "id": "pkg-002",
          "name": "Tech Display - Leaderboard",
          "status": "active",
          "budget": 2000.00,
          "start_date": "2026-04-01",
          "end_date": "2026-04-30"
        }
      ],
      "creatives": [
        {"id": "cr-001-300x250", "status": "approved"},
        {"id": "cr-002-728x90", "status": "approved"}
      ],
      "created_at": "2026-03-09T14:30:00Z",
      "activated_at": "2026-03-09T14:42:00Z"
    }
  ]
}
```

### Status Lifecycle

The media buy has transitioned through the status lifecycle:

```text
pending_activation --> active --> paused --> completed
```

- **pending_activation**: Campaign created, awaiting publisher approval.
- **active**: Approved and delivering (or scheduled to deliver on start_date).
- **paused**: Temporarily stopped (can be resumed).
- **completed**: Flight ended or budget exhausted.

## Step 9: Track Delivery

Once the campaign is active and delivering, use `get_media_buy_delivery` to monitor performance. This returns impressions, spend, click-through rate, and pacing data.

### Request

```python
result = await client.call_tool("get_media_buy_delivery", {
    "media_buy_ids": ["mb-a1b2c3d4-5678-9012-3456-789012345678"]
})
```

### Response

```json
{
  "media_buy_id": "mb-a1b2c3d4-5678-9012-3456-789012345678",
  "status": "active",
  "delivery": {
    "impressions": 125000,
    "clicks": 1875,
    "ctr": 0.015,
    "spend": 1562.50,
    "budget_remaining": 3437.50,
    "budget_utilization": 0.3125
  },
  "pacing": {
    "expected_spend_to_date": 1666.67,
    "actual_spend_to_date": 1562.50,
    "pacing_ratio": 0.9375,
    "pacing_status": "slightly_behind",
    "projected_end_spend": 4687.50,
    "projected_end_date": "2026-04-30"
  },
  "by_package": [
    {
      "package_id": "pkg-001",
      "name": "Tech Display - Medium Rectangle",
      "impressions": 78000,
      "clicks": 1248,
      "ctr": 0.016,
      "spend": 975.00,
      "budget_remaining": 2025.00,
      "pacing_ratio": 0.9500
    },
    {
      "package_id": "pkg-002",
      "name": "Tech Display - Leaderboard",
      "impressions": 47000,
      "clicks": 627,
      "ctr": 0.0133,
      "spend": 587.50,
      "budget_remaining": 1412.50,
      "pacing_ratio": 0.9167
    }
  ],
  "period": {
    "start": "2026-04-01",
    "end": "2026-04-30",
    "days_elapsed": 10,
    "days_remaining": 20
  }
}
```

### Reading the Delivery Report

Key metrics to understand:

{: .table .table-bordered .table-striped }
| Metric | Value | Interpretation |
|--------|-------|----------------|
| Impressions | 125,000 | 31.25% of estimated 400K total -- on track for day 10 of 30 |
| CTR | 1.5% | Strong click-through rate for display ads |
| Spend | $1,562.50 | 31.25% of $5,000 budget consumed |
| Pacing Ratio | 0.9375 | Slightly behind pace (93.75% of expected) |
| Projected End Spend | $4,687.50 | On current trajectory, will underspend by $312.50 |

The **by_package** breakdown shows that the 300x250 Medium Rectangle is performing better (1.6% CTR) than the 728x90 Leaderboard (1.33% CTR). The 300x250 is also pacing better at 95% vs 91.67%.

## Step 10: Optimize

Based on the delivery data, we can optimize the campaign. The 300x250 format is performing better, so let us shift $500 from the leaderboard package to the medium rectangle and extend the flight by one week.

### Update the Media Buy

```python
result = await client.call_tool("update_media_buy", {
    "media_buy_id": "mb-a1b2c3d4-5678-9012-3456-789012345678",
    "packages": [
        {
            "package_id": "pkg-001",
            "budget": 3500,
            "end_date": "2026-05-07"
        },
        {
            "package_id": "pkg-002",
            "budget": 1500,
            "end_date": "2026-05-07"
        }
    ]
})
```

```json
{
  "media_buy": {
    "id": "mb-a1b2c3d4-5678-9012-3456-789012345678",
    "status": "active",
    "total_budget": 5000.00,
    "packages": [
      {
        "id": "pkg-001",
        "name": "Tech Display - Medium Rectangle",
        "budget": 3500.00,
        "start_date": "2026-04-01",
        "end_date": "2026-05-07",
        "previous_budget": 3000.00
      },
      {
        "id": "pkg-002",
        "name": "Tech Display - Leaderboard",
        "budget": 1500.00,
        "start_date": "2026-04-01",
        "end_date": "2026-05-07",
        "previous_budget": 2000.00
      }
    ],
    "updated_at": "2026-04-11T10:15:00Z"
  }
}
```

### Submit Performance Feedback

Use `update_performance_index` to feed back performance signals that help the Sales Agent optimize future product recommendations:

```python
result = await client.call_tool("update_performance_index", {
    "media_buy_id": "mb-a1b2c3d4-5678-9012-3456-789012345678",
    "feedback": {
        "overall_satisfaction": 4,
        "audience_quality": 5,
        "delivery_consistency": 3,
        "notes": "Strong CTR on 300x250 format. Leaderboard underperforming on pacing. Audience targeting is excellent for developer demographic."
    }
})
```

```json
{
  "performance_index": {
    "media_buy_id": "mb-a1b2c3d4-5678-9012-3456-789012345678",
    "overall_satisfaction": 4,
    "audience_quality": 5,
    "delivery_consistency": 3,
    "updated_at": "2026-04-11T10:20:00Z"
  }
}
```

## Step 11: Campaign Completion

When the flight ends (or the budget is exhausted), the campaign status transitions to `completed`. Check the final delivery report:

### Final Status Check

```python
result = await client.call_tool("get_media_buys", {
    "media_buy_ids": ["mb-a1b2c3d4-5678-9012-3456-789012345678"]
})
```

```json
{
  "media_buys": [
    {
      "id": "mb-a1b2c3d4-5678-9012-3456-789012345678",
      "name": "TechCorp Developer Tool Launch - Q2 2026",
      "status": "completed",
      "total_budget": 5000.00,
      "completed_at": "2026-05-07T23:59:59Z"
    }
  ]
}
```

### Final Delivery Report

```python
result = await client.call_tool("get_media_buy_delivery", {
    "media_buy_ids": ["mb-a1b2c3d4-5678-9012-3456-789012345678"]
})
```

```json
{
  "media_buy_id": "mb-a1b2c3d4-5678-9012-3456-789012345678",
  "status": "completed",
  "delivery": {
    "impressions": 398500,
    "clicks": 6176,
    "ctr": 0.0155,
    "spend": 4981.25,
    "budget_remaining": 18.75,
    "budget_utilization": 0.9963
  },
  "pacing": {
    "pacing_status": "completed",
    "final_delivery_ratio": 0.9963
  },
  "by_package": [
    {
      "package_id": "pkg-001",
      "name": "Tech Display - Medium Rectangle",
      "impressions": 278000,
      "clicks": 4587,
      "ctr": 0.0165,
      "spend": 3475.00,
      "budget_utilization": 0.9929
    },
    {
      "package_id": "pkg-002",
      "name": "Tech Display - Leaderboard",
      "impressions": 120500,
      "clicks": 1589,
      "ctr": 0.0132,
      "spend": 1506.25,
      "budget_utilization": 1.0042
    }
  ],
  "period": {
    "start": "2026-04-01",
    "end": "2026-05-07",
    "total_days": 37
  }
}
```

### Campaign Summary

{: .table .table-bordered .table-striped }
| Metric | Target | Actual | Result |
|--------|--------|--------|--------|
| Budget | $5,000 | $4,981.25 | 99.6% utilized |
| Impressions | 400,000 (est.) | 398,500 | 99.6% of estimate |
| CTR | -- | 1.55% | Strong performance |
| Flight | Apr 1 -- Apr 30 | Apr 1 -- May 7 | Extended by 1 week (optimization) |

The campaign delivered 398,500 impressions at 99.6% budget utilization, with a strong 1.55% CTR. The mid-flight optimization (shifting budget to 300x250 and extending the flight) helped maximize delivery.

## Complete Python Script

Here is the complete working script that executes all steps in the campaign lifecycle. This can be run directly against a local Sales Agent instance using the mock adapter.

```python
"""
Complete Campaign Lifecycle Example
Runs a full advertising campaign through the Prebid Sales Agent.

Requirements:
  - Sales Agent running locally (docker compose up -d)
  - Mock adapter configured (default in development)
  - Python 3.12+ with fastmcp installed (uv pip install fastmcp)

Usage:
  uv run python campaign_lifecycle.py
"""

import asyncio
import json
from fastmcp import Client
from fastmcp.client.transports import StreamableHttpTransport


SALES_AGENT_URL = "http://localhost:8000/mcp/"
AUTH_TOKEN = "test-token"


def print_step(step_num: int, title: str) -> None:
    print(f"\n{'='*60}")
    print(f"Step {step_num}: {title}")
    print(f"{'='*60}")


def print_result(result: object) -> None:
    if hasattr(result, "content"):
        for block in result.content:
            if hasattr(block, "text"):
                parsed = json.loads(block.text)
                print(json.dumps(parsed, indent=2))
    else:
        print(json.dumps(result, indent=2, default=str))


async def run_campaign_lifecycle() -> None:
    transport = StreamableHttpTransport(
        SALES_AGENT_URL,
        headers={"x-adcp-auth": AUTH_TOKEN},
    )

    async with Client(transport=transport) as client:

        # Step 1: Discover capabilities
        print_step(1, "Discover Capabilities")
        result = await client.call_tool("get_adcp_capabilities")
        print_result(result)

        # Step 2: Search for products
        print_step(2, "Search for Products")
        result = await client.call_tool("get_products", {
            "brief": "display ads targeting US tech enthusiasts, "
                     "developers, $5000 budget"
        })
        print_result(result)

        # Step 3: Check creative formats
        print_step(3, "Check Creative Formats")
        result = await client.call_tool("list_creative_formats")
        print_result(result)

        # Step 4: View publisher properties
        print_step(4, "View Publisher Properties")
        result = await client.call_tool("list_authorized_properties")
        print_result(result)

        # Step 5: Create the media buy
        print_step(5, "Create Media Buy")
        result = await client.call_tool("create_media_buy", {
            "name": "TechCorp Developer Tool Launch - Q2 2026",
            "buyer_ref": "TC-2026-Q2-001",
            "packages": [
                {
                    "product_id": "prod-tech-display-001",
                    "pricing_option_id": "price-001",
                    "name": "Tech Display - Medium Rectangle",
                    "budget": 3000,
                    "start_date": "2026-04-01",
                    "end_date": "2026-04-30",
                    "targeting": {
                        "geographic": {"countries": ["US"]},
                        "contextual": {
                            "categories": ["technology", "programming"]
                        },
                        "device": {"device_types": ["desktop", "tablet"]},
                    },
                    "creative_format_ids": ["fmt-display-300x250"],
                },
                {
                    "product_id": "prod-tech-display-001",
                    "pricing_option_id": "price-001",
                    "name": "Tech Display - Leaderboard",
                    "budget": 2000,
                    "start_date": "2026-04-01",
                    "end_date": "2026-04-30",
                    "targeting": {
                        "geographic": {"countries": ["US"]},
                        "contextual": {
                            "categories": ["technology", "software"]
                        },
                        "device": {"device_types": ["desktop"]},
                    },
                    "creative_format_ids": ["fmt-display-728x90"],
                },
            ],
            "total_budget": 5000,
            "currency": "USD",
        })
        print_result(result)
        # Extract media_buy_id from response for subsequent calls
        media_buy_id = "mb-a1b2c3d4-5678-9012-3456-789012345678"

        # Step 6: Upload creatives
        print_step(6, "Upload Creatives")
        result = await client.call_tool("sync_creatives", {
            "media_buy_id": media_buy_id,
            "creatives": [
                {
                    "name": "TechCorp DevTool - 300x250",
                    "format_id": "fmt-display-300x250",
                    "click_url": "https://techcorp.example.com/devtool"
                                 "?utm_source=salesagent"
                                 "&utm_medium=display"
                                 "&utm_campaign=q2-launch",
                    "assets": [
                        {
                            "role": "primary",
                            "mime_type": "image/png",
                            "width": 300,
                            "height": 250,
                            "file_size_bytes": 87500,
                            "url": "https://cdn.techcorp.example.com"
                                   "/ads/devtool-300x250.png",
                        }
                    ],
                    "alt_text": "TechCorp DevTool - Build faster "
                                "with AI-powered development",
                },
                {
                    "name": "TechCorp DevTool - 728x90",
                    "format_id": "fmt-display-728x90",
                    "click_url": "https://techcorp.example.com/devtool"
                                 "?utm_source=salesagent"
                                 "&utm_medium=display"
                                 "&utm_campaign=q2-launch",
                    "assets": [
                        {
                            "role": "primary",
                            "mime_type": "image/png",
                            "width": 728,
                            "height": 90,
                            "file_size_bytes": 62000,
                            "url": "https://cdn.techcorp.example.com"
                                   "/ads/devtool-728x90.png",
                        }
                    ],
                    "alt_text": "TechCorp DevTool - Ship code 10x faster",
                },
            ],
        })
        print_result(result)

        # Step 7: Wait for approval workflows
        # In production, publisher approves via Admin UI.
        # In testing, use X-Auto-Advance: true header to skip.
        print_step(7, "Wait for Approval Workflows")

        print("\nPolling media buy status...")
        import asyncio
        while True:
            result = await client.call_tool("get_media_buys", {
                "media_buy_ids": [media_buy_id],
            })
            status = result["media_buys"][0]["status"]
            if status in ("approved", "active", "delivering"):
                print(f"Media buy approved! Status: {status}")
                break
            elif status in ("rejected", "canceled"):
                print(f"Media buy {status}.")
                break
            print(f"Status: {status} — waiting...")
            await asyncio.sleep(10)

        # Step 8: Monitor campaign status
        print_step(8, "Monitor Campaign Status")
        result = await client.call_tool("get_media_buys", {
            "media_buy_ids": [media_buy_id],
        })
        print_result(result)

        # Step 9: Track delivery
        print_step(9, "Track Delivery")
        result = await client.call_tool("get_media_buy_delivery", {
            "media_buy_ids": [media_buy_id],
        })
        print_result(result)

        # Step 10: Optimize
        print_step(10, "Optimize Campaign")
        result = await client.call_tool("update_media_buy", {
            "media_buy_id": media_buy_id,
            "packages": [
                {
                    "package_id": "pkg-001",
                    "budget": 3500,
                    "end_date": "2026-05-07",
                },
                {
                    "package_id": "pkg-002",
                    "budget": 1500,
                    "end_date": "2026-05-07",
                },
            ],
        })
        print_result(result)

        # Submit performance feedback
        print("\nSubmitting performance feedback...")
        result = await client.call_tool("update_performance_index", {
            "media_buy_id": media_buy_id,
            "feedback": {
                "overall_satisfaction": 4,
                "audience_quality": 5,
                "delivery_consistency": 3,
                "notes": "Strong CTR on 300x250. Leaderboard "
                         "underperforming on pacing.",
            },
        })
        print_result(result)

        # Step 11: Final delivery report
        print_step(11, "Campaign Completion")
        result = await client.call_tool("get_media_buy_delivery", {
            "media_buy_ids": [media_buy_id],
        })
        print_result(result)

    print("\n" + "=" * 60)
    print("Campaign lifecycle complete!")
    print("=" * 60)


if __name__ == "__main__":
    asyncio.run(run_campaign_lifecycle())
```

<div class="alert alert-info" role="alert">
  In a real integration, you would parse the <code>media_buy_id</code> and <code>task_id</code> values from each response rather than using hardcoded IDs. The hardcoded IDs in this script correspond to the mock adapter's deterministic responses.
</div>

## What's Next

- [Buy-Side Integration](/agents/salesagent/getting-started/buy-side-integration.html) -- Build a production AI buying agent
- [Tool Reference](/agents/salesagent/tools/tool-reference.html) -- Complete reference for all MCP tools
- [get_products](/agents/salesagent/tools/get-products.html) -- Product catalog search
- [create_media_buy](/agents/salesagent/tools/create-media-buy.html) -- Campaign creation parameters and response
- [get_media_buy_delivery](/agents/salesagent/tools/get-media-buy-delivery.html) -- Delivery metrics and pacing
- [Deployment Overview](/agents/salesagent/deployment/deployment-overview.html) -- Deploy to production on Fly.io or Google Cloud Run
- [Development Environment Setup](/agents/salesagent/developers/dev-setup.html) -- Set up a local development environment
