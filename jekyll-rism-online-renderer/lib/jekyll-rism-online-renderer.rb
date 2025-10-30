# frozen_string_literal: true

require "jekyll"

module Jekyll
  module RISMOnlineRenderer
    class Generator < Jekyll::Generator
      safe true
      priority :lowest

      def generate(site)
        copy_static_assets(site, "assets")
        copy_includes(site, "_includes")
      end

      private

      def copy_static_assets(site, subdir)
        src_dir = File.expand_path("../../#{subdir}", __FILE__)
        return unless Dir.exist?(src_dir)

        Dir[File.join(src_dir, "**", "*")].each do |path|
          next if File.directory?(path)
          rel_path = path.sub(src_dir + "/", "")
          site.static_files << Jekyll::StaticFile.new(site, src_dir, File.dirname(rel_path), File.basename(rel_path))
        end
      end

      def copy_includes(site, subdir)
        src_dir = File.expand_path("../../#{subdir}", __FILE__)
        return unless Dir.exist?(src_dir)

        site.includes_load_paths << src_dir
        Jekyll.logger.info "jekyll-rism-online-renderer:", "added includes from #{src_dir}"
      end
    end
  end
end

# frozen_string_literal: true
require "jekyll"

Jekyll::Hooks.register :site, :after_init do |site|
  sass_dir = File.expand_path("../../_sass", __FILE__)
  next unless Dir.exist?(sass_dir)

  site.config["sass"] ||= {}
  site.config["sass"]["load_paths"] ||= []
  unless site.config["sass"]["load_paths"].include?(sass_dir)
    site.config["sass"]["load_paths"] << sass_dir
    Jekyll.logger.info "jekyll-rism-online-renderer:", "added #{sass_dir} to sass.load_paths"
  end
end
