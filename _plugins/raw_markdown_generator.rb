# Copies the exact raw Markdown source of every page/doc as a static asset 
# at "<page-url>.md" without applying layouts or Liquid transformations.
module Jekyll
  class RawMarkdownFile < StaticFile
    def initialize(site, source_item)
      rel_path = source_item.respond_to?(:relative_path) ? source_item.relative_path : source_item.path
      dir = File.dirname(rel_path)
      name = File.basename(rel_path)

      super(site, site.source, dir, name)

      url = source_item.url
      @custom_url = url.end_with?("/") ? "#{url}index.html.md" : "#{url}.md"
    end

    def url
      @custom_url
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

        site.static_files << RawMarkdownFile.new(site, item)
      end
    end

    private

    def raw_markdown_source?(item)
      path = item.respond_to?(:relative_path) ? item.relative_path : item.path
      path.to_s =~ MARKDOWN_EXT
    end
  end
end