---
redirect_to: https://github.com/prebid/Prebid.js/blob/master/CONTRIBUTING.md
layout: page_v2
title: Testing Prebid.js
description: How to write tests for the Prebid.js library
pid: 199
top_nav_section: dev_docs
---

<div class="bs-docs-section" markdown="1">

# Testing  Prebid.js

{: .no_toc}

Starting on 21 June 2016, all pull requests to the Prebid.js library will need to include tests with greater than 80% code coverage for any changed/added code before they can be merged into master.

For more information, see Prebid.js issue [#421](https://github.com/prebid/Prebid.js/issues/421).

This page describes how to test code in the Prebid.js repository to help prepare your pull request.

* TOC
{:toc}

## Writing tests

When you are adding code to Prebid.js, or modifying code that isn't covered by an existing test, test the code according to these guidelines:

* If the module you are working on is already partially tested by a file within the `test` directory, add tests to that file
* If the module does not have any tests, create a new test file
* Group tests in a `describe` block
* Test individual units of code within an `it` block
** Within an `it` block, it may be helpful to use the "Arrange-Act-Assert" pattern
  * _Arrange_: set up necessary preconditions and inputs
    * e.g., creating objects, spies, etc.
  * _Act_: call or act on the unit under test
    * e.g., call the function you are testing with the parameters you set up
  * _Assert_: check that the expected results have occurred
    * e.g., use Chai assertions to check that the expected output is equal to the actual output
* Test the public interface, not the internal implementation
* If using global `pbjs` data structures in your test, take care to not completely overwrite them with your own data as that may affect other tests relying on those structures, e.g.:
  * **OK**: `pbjs._bidsRequested.push(bidderRequestObject);`
  * **NOT OK**: `pbjs._bidsRequested = [bidderRequestObject];`
* If you need to check `adloader.loadScript` in a test, use a `stub` rather than a `spy`. `spy`s trigger a network call which can result in a `script error` and cause unrelated unit tests to fail. `stub`s will let you gather information about the `adloader.loadScript` call without affecting external resources
* When writing tests you may use ES2015 syntax if desired

## Running tests

The tests run under [Vitest](https://vitest.dev/guide/browser/) in a real browser. After checking out the Prebid.js repository and installing dev dependencies with `npm ci`, install a browser once with `npx playwright install chromium`, then use the following commands as you are working on code:

* `npx gulp test-only --file test/spec/modules/exampleBidAdapter_spec.js` runs one spec file
* `npx gulp test-only` runs the whole suite once, as CI does
* `npx gulp serve-and-test` re-runs the tests that import a file whenever a source file changes
* `--browsers chrome,firefox,safari,edge` picks the browsers (Chromium by default). Install Firefox with `npx playwright install firefox`; `safari` drives the installed Safari on macOS (once: `sudo safaridriver --enable`).
* `VITEST_PARALLEL=0 npx gulp test-only ...` runs one spec file at a time. Spec files otherwise run in several pages at once, which share cookies and storage, so try it when a test fails only alongside others.

CI also runs the suite in Firefox, Safari, Edge, an old Chrome, and Safari on a real iPhone, whose test page is served from `http://bs-local.com` rather than `localhost` and isn't a secure context. The [Prebid.js test README](https://github.com/prebid/Prebid.js/blob/master/test/vitest/README.md) describes the setup.

## Checking results and code coverage

Check the test results using these guidelines:

* Look at the total number of tests run, passed, and failed, shown at the end of the run. In a pull request, a failing test is also annotated on its line in the spec file.
* If all tests are passing, great.
* Otherwise look for errors printed in the console for a description of the failing test.
* You may need to iterate on your code or tests until all tests are passing.
* Make sure existing tests still pass.
* `npx gulp test-coverage --file <spec>` writes an lcov coverage report to `build/coverage/chunks/1/lcov.info`. Its paths are the source files, so you can open it with any lcov viewer or editor plugin to see which lines your tests cover.
* In a pull request, CI compares the coverage of the whole suite with the base branch's.
* The code you have added or modified must have greater than 80% coverage to be accepted.

## Examples

Prebid.js already has lots of tests. Read them to see how Prebid.js is tested, and for inspiration:

* Look in `test/spec` and its subdirectories
* Tests for bid adapters and other modules are located in `test/spec/modules`

A test module might have the following general structure:

```javascript

// Import or require modules necessary for the test, e.g.:
import { expect } from 'chai';  // may prefer 'assert' in place of 'expect'
import adapter from 'src/adapters/[adapter]';

describe('[Adapter]', () => {

  it('[description of unit or feature being tested]', () => {
    // Arrange - set up preconditions and inputs
    // Act - call or act on the code under test
    // Assert - use chai to check that expected results have occurred
  });

  // Add other `describe` or `it` blocks as necessary

});

```

## Resources

The Prebid.js testing stack contains some of the following tools. It may be helpful to consult their documentation during the testing process.

* [Mocha - test framework](https://mochajs.org/)
* [Chai - BDD/TDD assertion library](https://chaijs.com/)
* [Sinon - spy, stub, and mock library](https://sinonjs.org/)
* [Vitest Browser Mode - test runner](https://vitest.dev/guide/browser/)

</div>
