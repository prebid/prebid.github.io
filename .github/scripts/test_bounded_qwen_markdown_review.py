import contextlib
import importlib.util
import io
import json
import os
import pathlib
import tempfile
import unittest
from unittest import mock

target = pathlib.Path(__file__).with_name("bounded_qwen_markdown_review.py")
spec = importlib.util.spec_from_file_location("bounded_qwen_markdown_review", target)
review = importlib.util.module_from_spec(spec)
spec.loader.exec_module(review)

BUG = "@@ -0,0 +1,5 @@\n+# Setup\n+\n+[Configuration](#configuraton)\n+\n+## Configuration"
CLEAN = BUG.replace("#configuraton", "#configuration")
FINDING = {
    "line": 3,
    "quote": "[Configuration](#configuraton)",
    "problem": "The in-page link points to a misspelled fragment instead of the Configuration heading.",
    "failure_case": "Clicking Configuration fails to jump to the Configuration heading on this page.",
    "fix": "[Configuration](#configuration)",
}

def document(patch):
    return "\n".join(review.added_lines(patch).values())

class MarkdownReviewTests(unittest.TestCase):
    def test_diff_lines(self):
        self.assertEqual(review.added_lines(BUG)[3], FINDING["quote"])

    def test_valid_corrected_anchor(self):
        self.assertTrue(review.validate(FINDING, review.added_lines(BUG), document(BUG)))

    def test_no_op(self):
        self.assertFalse(review.validate({**FINDING, "fix": FINDING["quote"]}, review.added_lines(BUG), document(BUG)))

    def test_wrong_destination(self):
        self.assertFalse(review.validate({**FINDING, "fix": "[Configuration](#different)"}, review.added_lines(BUG), document(BUG)))

    def test_clean_control(self):
        self.assertFalse(review.validate({**FINDING, "quote": "[Configuration](#configuration)"},
                                         review.added_lines(CLEAN), document(CLEAN)))

    def test_unadded_anchor(self):
        self.assertFalse(review.validate(FINDING, {4: "## Configuration"}, document(BUG)))

    def test_reject_wrong_line(self):
        self.assertFalse(review.validate({**FINDING, "line": 77}, review.added_lines(BUG), document(BUG)))

    def test_reject_changed_link_label(self):
        self.assertFalse(review.validate({**FINDING, "fix": "[Else](#configuration)"}, review.added_lines(BUG), document(BUG)))


    def test_plus_prefix_in_diff(self):
        patch = "@@ -0,0 +1,4 @@\n+++\n+# Heading\n+\n+[Heading](#heding)"
        self.assertEqual(review.added_lines(patch)[4], "[Heading](#heding)")

    def test_repeated_spaces_and_underscores_abstain(self):
        self.assertIsNone(review.heading_anchor("## Foo  Bar"))
        self.assertIsNone(review.heading_anchor("## foo_bar"))

    def test_fenced_heading_not_visible(self):
        source = "[Configuration](#configuraton)\n" + "```md\n## Configuration\n```"
        self.assertNotIn("#configuration", review.markdown_evidence(source)[0])

    def test_fence_started_before_added_lines(self):
        source = "```markdown\n## Configuration\n```\n[Configuration](#configuraton)"
        self.assertFalse(review.validate(FINDING, review.added_lines(BUG), source))

    def test_avoid_untrusted_model_prose(self):
        malicious = {**FINDING, "problem": "@everybody https://malicious.example"}
        comment = review.build_comment(malicious, "a" * 64)
        self.assertNotIn("@everybody", comment)
        self.assertNotIn("malicious.example", comment)

    def test_duplicate_headings_abstain(self):
        source = "[Configuration](#configuraton)\n## Configuration\n## Configuration"
        self.assertNotIn("#configuration", review.markdown_evidence(source)[0])

    def test_filter_markdown_extensions(self):
        self.assertEqual(review.EXTENSIONS, (".md", ".markdown"))

    def test_inline_link_in_prose(self):
        patch = INLINE.replace("{frag}", "#configuraton")
        self.assertTrue(review.validate(INLINE_FINDING, review.added_lines(patch), document(patch)))

    def test_inline_comment_names_fragments(self):
        comment = review.build_comment(INLINE_FINDING, "a" * 64)
        self.assertIn("`#configuraton`", comment)
        self.assertIn("`#configuration`", comment)

    def test_reject_inline_fix_that_rewrites_prose(self):
        patch = INLINE.replace("{frag}", "#configuraton")
        finding = {**INLINE_FINDING, "fix": "Read [Configuration](#configuration) first."}
        self.assertFalse(review.validate(finding, review.added_lines(patch), document(patch)))

    def test_reject_link_inside_code_span(self):
        patch = "@@ -0,0 +1,3 @@\n+Write `[Configuration](#configuraton)` like this.\n+\n+## Configuration"
        finding = {**INLINE_FINDING, "quote": "Write `[Configuration](#configuraton)` like this.",
                   "fix": "Write `[Configuration](#configuration)` like this."}
        self.assertFalse(review.validate(finding, review.added_lines(patch), document(patch)))

    def test_html_anchor_target_is_not_broken(self):
        patch = INLINE.replace("{frag}", "#configuraton") + '\n+<a name="configuraton"></a>'
        self.assertFalse(review.validate(INLINE_FINDING, review.added_lines(patch), document(patch)))

    def test_reject_non_typo_retarget(self):
        patch = "@@ -0,0 +1,3 @@\n+See [Configuration](#bidder-params) for options.\n+\n+## Configuration"
        finding = {**INLINE_FINDING, "quote": "See [Configuration](#bidder-params) for options.",
                   "fix": "See [Configuration](#configuration) for options."}
        self.assertFalse(review.validate(finding, review.added_lines(patch), document(patch)))

    def test_only_one_of_several_links_changes(self):
        line = "See [Setup](#setup) and [Configuration](#configuraton)."
        self.assertEqual(review.changed_link(line, line.replace("#configuraton", "#configuration")),
                         ("#configuraton", "#configuration"))
        self.assertIsNone(review.changed_link(line, line.replace("#configuraton", "#configuration")
                                              .replace("#setup", "#set-up")))

    def test_image_links_ignored(self):
        self.assertEqual(review.in_page_links("![Logo](#logo)"), [])

    def test_normalize_copied_plus_and_miscounted_line(self):
        # Fork smoke: Qwen quoted "+..." and said line 10 for line 12.
        patch = INLINE.replace("{frag}", "#configuraton")
        raw = {**INLINE_FINDING, "line": 7, "quote": "+" + INLINE_FINDING["quote"],
               "fix": "+" + INLINE_FINDING["fix"]}
        lines = review.added_lines(patch)
        self.assertFalse(review.validate(raw, lines, document(patch)))
        normalized = review.normalize_finding(raw, lines)
        self.assertEqual((normalized["line"], normalized["quote"]), (1, INLINE_FINDING["quote"]))
        self.assertTrue(review.validate(normalized, lines, document(patch)))

    def test_normalize_keeps_model_line_when_quote_is_ambiguous(self):
        patch = "@@ -0,0 +1,3 @@\n+See [A](#configuraton).\n+See [A](#configuraton).\n+## Configuration"
        raw = {**INLINE_FINDING, "line": 9, "quote": "See [A](#configuraton).",
               "fix": "See [A](#configuration)."}
        self.assertEqual(review.normalize_finding(raw, review.added_lines(patch))["line"], 9)

    def test_truncated_json_leaves_file_unreviewed_without_failing(self):
        patch_text = INLINE.replace("{frag}", "#configuraton")
        file = {"filename": "dev-docs/example.md", "status": "added", "patch": patch_text}
        raw = {"message": {"content": '{"findings": [{"line": 1, "problem": "cut off'},
               "eval_count": 650}
        with tempfile.TemporaryDirectory() as directory, mock.patch.dict(os.environ, {
            "GITHUB_REPOSITORY": "prebid/prebid.github.io", "PR_NUMBER": "1",
            "PR_HEAD_SHA": "a" * 40, "GITHUB_TOKEN": "test-only", "RUNNER_TEMP": directory,
            "GITHUB_STEP_SUMMARY": "",
        }), mock.patch.object(review, "paged", side_effect=lambda repo, number, token, endpoint: (
            [file] if endpoint == "files" else []
        )), mock.patch.object(review, "api", return_value=raw):
            with contextlib.redirect_stdout(io.StringIO()):  # its ::warning:: would annotate the real run
                review.main()
            report = json.loads((pathlib.Path(directory) / "bounded-qwen-result.json").read_text())
        self.assertEqual(report["errors"], [])
        self.assertEqual((report["reviewed"], report["skipped"]), (0, 1))
        self.assertEqual(report["files"][0]["outcome"], "unparseable_response")
        self.assertEqual(report["files"][0]["raw_response"], raw)

    def general(self, patch, line, quote, fix, source=None):
        finding = {**FINDING, "line": line, "quote": quote, "fix": fix,
                   "problem": "The example does not match the documented API.",
                   "failure_case": "A reader who copies this line gets an error."}
        lines = review.added_lines(patch)
        source = document(patch) if source is None else source
        return review.validate(finding, lines, source, review.replaced_lines(patch, line))

    def test_code_example_fix_accepted(self):
        patch = "@@ -0,0 +1,5 @@\n+## Example\n+\n+```javascript\n+pbjs.setConfig({ debug: true };\n+```"
        self.assertTrue(self.general(patch, 4, "pbjs.setConfig({ debug: true };",
                                     "pbjs.setConfig({ debug: true });"))

    def test_prose_fix_rejected(self):
        patch = "@@ -0,0 +1,1 @@\n+Set the timeout to 300 ms."
        self.assertFalse(self.general(patch, 1, "Set the timeout to 300 ms.", "Set the timeout to 3000 ms."))

    def test_table_row_fix_accepted(self):
        patch = ("@@ -0,0 +1,3 @@\n+| Name | Scope | Type |\n+|------|-------|------|\n"
                 "+| `bidfloor` | optional | string |")
        self.assertTrue(self.general(patch, 3, "| `bidfloor` | optional | string |",
                                     "| `bidfloor` | optional | number |"))

    def test_table_formatting_only_rejected(self):
        patch = "@@ -0,0 +1,2 @@\n+| Name | Type |\n+| bidfloor | number |"
        self.assertFalse(self.general(patch, 2, "| bidfloor | number |", "| `bidfloor` | **number** |"))

    def test_front_matter_rejected(self):
        patch = "@@ -0,0 +1,4 @@\n+---\n+biddercode: foo\n+gvl_id: 12\n+---"
        self.assertFalse(self.general(patch, 3, "gvl_id: 12", "gvl_id: 21"))

    def test_revert_of_replaced_line_rejected(self):
        patch = ("@@ -1,3 +1,3 @@\n ```js\n-pbjs.setConfig({ debug: false });\n"
                 "+pbjs.setConfig({ debug: true });\n ```")
        source = "```js\npbjs.setConfig({ debug: true });\n```"
        self.assertFalse(self.general(patch, 2, "pbjs.setConfig({ debug: true });",
                                      "pbjs.setConfig({ debug: false });", source))

    def test_fix_breaking_out_of_suggestion_rejected(self):
        patch = "@@ -0,0 +1,3 @@\n+```js\n+foo(1;\n+```"
        self.assertFalse(self.general(patch, 2, "foo(1;", "foo(1); ``` @someone"))

    def test_general_comment_is_sanitized_suggestion(self):
        finding = {**FINDING, "quote": "  foo(1;", "fix": "foo(1);",
                   "problem": "See https://evil.example and ping @everyone <!-- bounded-qwen:x -->",
                   "failure_case": "Copying the line throws a SyntaxError."}
        comment = review.build_comment(finding, "a" * 64, "  foo(1;")
        self.assertIn("```suggestion\n  foo(1);\n```", comment)
        self.assertNotIn("evil.example", comment)
        self.assertNotIn("@everyone", comment)
        self.assertNotIn("<!-- bounded-qwen:x", comment)

    def test_normalize_keeps_literal_plus_line(self):
        lines = {1: "+1 see [Configuration](#configuraton)"}
        raw = {**INLINE_FINDING, "line": 1, "quote": lines[1],
               "fix": "+1 see [Configuration](#configuration)"}
        self.assertEqual(review.normalize_finding(raw, lines)["quote"], lines[1])


INLINE = "@@ -0,0 +1,3 @@\n+See [Configuration]({frag}) for options.\n+\n+## Configuration"
INLINE_FINDING = {
    **FINDING,
    "line": 1,
    "quote": "See [Configuration](#configuraton) for options.",
    "fix": "See [Configuration](#configuration) for options.",
}

if __name__ == "__main__":
    unittest.main()
