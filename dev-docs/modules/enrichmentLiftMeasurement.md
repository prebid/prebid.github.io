---
layout: page_v2
title: Enrichment Lift Measurement Module
display_name: Enrichment Lift Measurement Module
description: Enrichment Lift Measurement Module
page_type: module
module_code: enrichmentLiftMeasurement
enable_download: true
vendor_specific: true
sidebarType: 1
---

# Enrichment Lift Measurement

The **Enrichment Lift Measurement Module** allows publishers to evaluate the performance of User ID submodules by configuring and executing A/B tests. It offers several configuration options that enable publishers to:

- Route traffic to selected User ID submodules.
- Control where the A/B test configuration is stored.
- Specify how User ID submodules should be disabled.

Additionally, the module attaches the A/B group configuration to analytics labels for tracking and reporting.

## How It Works

1. The publisher initializes the module using `config.setConfig`.
2. When a user loads the page, the module determines which User ID submodules should participate in the test based on the configured percentages.
3. Submodules not selected for the test are disabled via activity controls, either during submodule initialization or at the enrichment level.
4. The A/B group configuration (enabled/disabled submodules) is saved in either `localStorage` or `sessionStorage`. (In `memory` mode, this step is skipped, and the configuration is recalculated on each page load.)
5. The A/B configuration is attached to analytics labels to enable performance tracking and analysis.

## Configuration

{: .table .table-bordered .table-striped }

| Parameter               | Description                                                      | Allowed Values                            | Default |
|-------------------------|------------------------------------------------------------------|--------------------------------------------|---------|
| `storeSplits`           | Defines where to store the A/B group configuration               | `memory`, `sessionStorage`, `localStorage` | -       |
| `suppression`           | Determines how to disable User ID submodules                     | `submodules`, `eids`                       | `eids`  |
| `modules[].name`        | Name of the User ID submodule                                    | *(string)*                                 | -       |
| `modules[].percentage`  | Percentage of users for whom the module is enabled               | *(number between 0 and 1)*                 | -       |
| `testRun`               | A label used for storing and reporting test configuration status | *(string)*                                 | -       |

## Configuration Example

```javascript
pbjs.setConfig({
  enrichmentLiftMeasurement: {
    modules: [
      { name: 'idSharedSystem', percentage: 1.0 },     // Enabled for 100% of users
      { name: '33acrossIdSystem', percentage: 0.5 }    // Enabled for ~50% of users
    ],
    storeSplits: 'memory', // Configuration is not stored; recalculated on each page load
    suppression: 'submodules',
    testRun: 'JulyTest'
  }
});
```

The following object will be attached to [analytics labels](/dev-docs/integrate-with-the-prebid-analytics-api.html#analytics-labels) based on the configuration above:

```javascript
{
  JulyTest: [
    { name: 'idSharedSystem', percentage: 1.0, enabled: true },
    { name: '33acrossIdSystem', percentage: 0.5, enabled: false } // May be true or false depending on random selection
  ]
}
```

### Analytics Labels

The module adds one analytics label whose key matches the configured `testRun` value. The value is an array that lists every User ID submodule participating in the experiment along with its configured percentage and whether it was enabled for the current page view. Analytics adapters can use that label to segment reporting by experiment group.

- `name`: The User ID submodule name.
- `percentage`: The configured rollout percentage, which is useful for validating traffic splits.
- `enabled`: Indicates whether the submodule ran for the current user; this is the randomized value that identifies the treatment/control groups.

See the [Analytics labels](/dev-docs/integrate-with-the-prebid-analytics-api.html#analytics-labels) section for guidance on how analytics adapters consume this metadata.
