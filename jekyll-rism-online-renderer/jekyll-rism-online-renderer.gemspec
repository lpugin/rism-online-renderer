# coding: utf-8
lib = File.expand_path("../lib", __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require "jekyll-rism-online-renderer/version"
Gem::Specification.new do |spec|
  spec.name          = "jekyll-rism-online-renderer"
  spec.summary       = "JS renderer for RISM Online data"
  spec.version       = Jekyll::RISMOnlineRenderer::VERSION
  spec.authors       = ["Laurent Pugin"]
  spec.email         = ["laurent.pugin@rism.digital"]
  spec.homepage      = "https://github.com/rism-digital/rism-online-renderer"
  spec.licenses      = ["MIT"]
  spec.require_paths = ["lib"]
  spec.add_dependency "jekyll", "~> 4.1"

    # Files to include in the gem package
  spec.files = Dir.chdir(__dir__) do
    Dir[
      "lib/**/*",
      "assets/**/*",
      "_includes/**/*",
      "_sass/**/*",
      "README.md"
    ]
  end

  # Optional: specify Sass runtime if you want to ensure SCSS compilation
  spec.add_runtime_dependency "sass-embedded", ">= 1.68"
end