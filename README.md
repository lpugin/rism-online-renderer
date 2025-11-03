# RISM Online Renderer

TypeScript code for rendering JSON-LD pulled from RISM Online

See:
* https://rism-digital.github.io/rism-online-renderer/test/index.html

## Using it

```html
<script src="../rism-online-renderer.js"></script>
<script>
  const renderer = new RISMOnline.Renderer( 'https://rism.online/sources/453012854', 'json-ld-container' );
  renderer.render( 'en' );
</script>
```

Where `json-ld-container` is the `@id` of a `div` to include the rendering.

The CSS generated from `rism-online-renderer.scss` should be included.

### Jekyll GEM

The renderer can be used as a Jekyll GEM with

```ruby
group :jekyll_plugins do
  gem "jekyll-rism-online-renderer", git: 'https://github.com/rism-digital/rism-online-renderer'
end
```

You also need to add in `_config.yml`:
```yml
plugins:
  - jekyll-rism-online-renderer
```

## Building

Processing TypeScript with:

```shell
tsc
```
or
```shell
tsc --watch
```

Building some CSS with (for example):
```shell
sass rism-online-renderer.scss > test/rism.css
```

Building the renderer wrapper with:
```shell
npm install
npn run build
```

Building the JSON schema with:
```
npm run build:schemas
```

Validating examples:
```shell
python3 validate_json_from_uri.py --url https://rism.online/sources/1001014328 --schema ./schemas/source.schema.json 
python3 validate_json_from_uri.py --url https://rism.online/sources/1001014328 --schema ./schemas/source.schema-no-extra.json 
python3 validate_json_from_uri.py --url https://rism.online/works/32486 --schema ./schemas/work.schema.json
python3 validate_json_from_uri.py --url https://rism.online/works/32486 --schema ./schemas/work.schema-no-extra.json
```

