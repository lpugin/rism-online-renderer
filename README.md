# RISM Online Renderer

TypeScript code for rendering JSON-LD pulled from RISM Online

See:
* https://lpugin.github.io/rism-online-renderer/test/index.html
* https://lpugin.github.io/rism-online-renderer/test/index-bulma.html

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