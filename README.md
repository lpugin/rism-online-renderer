# RISM Online Renderer

TypeScript code for rendering JSON-LD pulled from RISM Online

See:
* https://lpugin.github.io/rism-online-renderer/test/index.html
* https://lpugin.github.io/rism-online-renderer/test/index-bulma.html

## Using it

```html
<script src="../rism-online-renderer.js"></script>
<script>
  const renderer = new RISMOnline.Renderer( 'https://rism.online/sources/453012854', 'json-ld-container' );
  renderer.render( 'en' );
</script>
```

Where `json-ld-container` is the `@id` of a `div` to include the rendering.

The CSS generated from `rism.scss` should be included.

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
sass rism.scss > test/rism.css
```

Building the renderer wrapper with:
```shell
npm install
npn run build
```
