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

class MarkdownReviewTests(unittest.TestCase):
    def test_diff_lines(self):
        self.assertEqual(review.added_lines(BUG)[3], FINDING["quote"])

    def test_valid_corrected_anchor(self):
        self.assertTrue(review.validate(FINDING, review.added_lines(BUG)))

    def test_no_op(self):
        self.assertFalse(review.validate({**FINDING, "fix": FINDING["quote"]}, review.added_lines(BUG)))

    def test_wrong_destination(self):
        self.assertFalse(review.validate({**FINDING, "fix": "[Configuration](#different)"}, review.added_lines(BUG)))

    def test_clean_control(self):
        self.assertFalse(review.validate({**FINDING, "quote": "[Configuration](#configuration)"},
                                         review.added_lines(CLEAN)))

    def test_unadded_anchor(self):
        self.assertFalse(review.validate(FINDING, {3: FINDING["quote"]}))

    def test_reject_wrong_line(self):
        self.assertFalse(review.validate({**FINDING, "line": 77}, review.added_lines(BUG)))

    def test_reject_changed_link_label(self):
        self.assertFalse(review.validate({**FINDING, "fix": "[Else](#configuration)"}, review.added_lines(BUG)))

    def test_filter_markdown_extensions(self):
        self.assertEqual(review.EXTENSIONS, (".md", ".markdown"))

if __name__ == "__main__":
    unittest.main()
