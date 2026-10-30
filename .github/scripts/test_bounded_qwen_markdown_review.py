import importlib.util
import pathlib
import unittest

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


INLINE = "@@ -0,0 +1,3 @@\n+See [Configuration]({frag}) for options.\n+\n+## Configuration"
INLINE_FINDING = {
    **FINDING,
    "line": 1,
    "quote": "See [Configuration](#configuraton) for options.",
    "fix": "See [Configuration](#configuration) for options.",
}

if __name__ == "__main__":
    unittest.main()
