# Emits the raw Markdown source of every content page/doc as a sibling
# static file at "<page-url>.md" (e.g. /dev-docs/foo.html -> /dev-docs/foo.html.md),
# so the Markdown behind any doc page can be fetched by appending ".md" to its URL.
#
# NOTE: this generator is NOT on the GitHub Pages safe-plugin whitelist, so it only
# runs when the site is built with plain `jekyll build` (see
# .github/workflows/pages-deploy.yml). It is silently skipped by GitHub's legacy
# "Deploy from a branch" Jekyll build.
module Jekyll
  class RawMarkdownPage < PageWithoutAFile
    def initialize(site, source_item, raw_content)
      target_path = source_item.url + ".md" # literal "append .md to the URL"

      super(site, site.source, File.dirname(target_path), File.basename(target_path))

      self.content = raw_content
      data["permalink"] = target_path
      data["sitemap"] = false # avoid duplicate-content entries next to the rendered page
    end

    # Skip Markdown->HTML conversion and layout rendering entirely: the output
    # IS the raw source content, verbatim.
    def render(_layouts, _site_payload)
      self.output = content
    end
  end

  class RawMarkdownGenerator < Generator
    safe true
    priority :low

    MARKDOWN_EXT = /\.(md|markdown)\z/i.freeze

    def generate(site)
      items = site.pages + site.collections.values.flat_map(&:docs)

      items.each do |item|
        next unless raw_markdown_source?(item)
        next if item.data["redirect_to"]
        next if item.data["published"] == false
        next if item.url.nil? || item.url.empty?

        site.pages << RawMarkdownPage.new(site, item, item.content)
      end
    end

    private

    def raw_markdown_source?(item)
      path = item.respond_to?(:relative_path) ? item.relative_path : item.path
      path.to_s =~ MARKDOWN_EXT
    end
  end
end
