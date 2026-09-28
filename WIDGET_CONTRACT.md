# Semantic widget contract

Each widget is a local package containing:

```text
widget-name/
├── widget.yml
├── provider.py
└── renderer.py
```

`widget.yml` declares stable identity, version, presentation metadata, default
and minimum pixel size, configuration fields, and explicit data requirements. Configuration
fields use Home Assistant selector schemas and are rendered by `ha-form`.

The provider understands Home Assistant APIs and returns plain normalized data.
It aggregates identical sources before resolution so several widget instances
do not repeat the same data fetch.

The renderer is a deterministic Python function:

```text
config + normalized data + pixel box + display context
                            ↓
                 list of ODL elements
```

It must not access Home Assistant, storage, the network, or frontend state. The
backend composes all widget output and raw primitives into one ordered ODL list,
then renders the complete screen once.

The POC includes one package, `temperature`, and keeps this contract deliberately
small so future imported widgets can use the same runtime boundary.
