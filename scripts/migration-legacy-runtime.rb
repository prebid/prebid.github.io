# Bounded template/YAML probe; consumes JSON on stdin, produces JSON on stdout.
# No filesystem mutation, external requests, or full Jekyll build.
require 'json'
require 'digest'
gem 'liquid', '= 4.0.4'
gem 'safe_yaml', '= 1.0.5'
require 'liquid'
require 'safe_yaml'

request = JSON.parse(STDIN.read)
raise 'Empty runtime probe' if request.fetch('pages', []).empty? && request.fetch('yaml_sources', []).empty?
runtime = {'ruby' => RUBY_VERSION, 'gems' => {}}
%w[liquid safe_yaml].each do |name|
  spec = Gem.loaded_specs.fetch(name)
  runtime['gems'][name] = {'version' => spec.version.to_s, 'archive_sha256' => Digest::SHA256.file(spec.cache_file).hexdigest}
end
yaml_results = request.fetch('yaml_sources', []).map do |entry|
  begin
    data = SafeYAML.load(entry.fetch('text'), safe: true)
    {'id' => entry.fetch('id'), 'data' => data, 'error' => nil}
  rescue StandardError => error
    {'id' => entry.fetch('id'), 'error' => error.class.to_s + ': ' + error.message}
  end
end
results = request.fetch('pages', []).map do |entry|
  context = entry.fetch('globals', {}).merge('page' => entry.fetch('page'))
  render = lambda do |text|
    Liquid::Template.parse(text, error_mode: :strict).render!(context, strict_filters: true)
  end
  {'id' => entry.fetch('id'), 'detail_html' => render.call(request.fetch('detail_template')),
   'csv_row' => render.call(request.fetch('csv_row_template'))}
end
STDOUT.write(JSON.generate({'runtime' => runtime, 'yaml_results' => yaml_results, 'results' => results}))
