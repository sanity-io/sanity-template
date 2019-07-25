# Sanity template manifest specification (v0)

Sanity template repositories must contain a file called `sanity-template.json`, and follow this specification.

- [Top-level fields](#top-level-fields)
- [Common types](#common-types)

## Top-level fields

### `version: 0`

The `version` key must be included in the manifest, and be set to `0`:

```json
{
  "version": 0
}
```

### `dataArchive?: string`

```json
{
  "dataArchive": "./data/production.tar.gz"
}
```

### `title: string`

The `title` field is used to give the template a title that should make it distinguishable from other templates. E.g.:

```json
{
  "title": "Blog with Gatsby"
}
```

### `description: string`

The `description` field should contain a text that describes the purpose and important attributes of the template. E.g.:

```json
{
  "description": "The de facto blog template for Sanity and Elm."
}
```

### `deployments: DeploymentDeclaration[]`

See [`DeploymentDeclaration`](#deploymentdeclaration) for type definition.

### `previewMedia: Media`

The `previewMedia` field is used to refer to a media file (either a URL or a relative path to file in the repository) that is used to render a preview at the template’s landing page at `https://www.sanity.io/create?template=<repo-id>`, as well as for share media.

See [`Media`](#media) for type definition.

### `technologies?: Technology[]`

The `technologies` field should contain an array of the most important technologies employed by the template project. E.g.:

```json
{
  "technologies": [
    {
      "id": "gatsby",
      "name": "Gatsby",
      "url": "https://www.gatsbyjs.org/"
    },
    {
      "id": "netlify",
      "name": "Netlify",
      "url": "https://www.netlify.com/"
    }
  ]
}
```

See [`Technology`](#technology) for type definition.

## Common types

### `DeploymentDeclaration`

```ts
interface DeploymentDeclaration {
  id: string;
  type: "studio" | "web";
  title: string;
  description: string;
  dir: string;
  provider: {
    name: "netlify";
    config: {
      base?: string;
      dir?: string;
      cmd?: string;
    };
  };
  // optional fields
  previewMedia?: Media;
  requiredCorsOrigins?: SanityCorsOriginDeclaration[];
  requiredTokens?: SanityTokenDeclaration[];
}
```

### `Image`

```ts
interface Image {
  type: "image";
  src: string;
  alt: string;
}
```

### `Media`

```ts
type Media = Image;
```

### `SanityCorsOriginDeclaration`

```ts
interface SanityCorsOriginDeclaration {
  origin: string
  allowCredentials: boolean
}
```

### `SanityTokenDeclaration`

```ts
interface SanityTokenDeclaration {
  role: "deploy-studio" | "read" | "write";
  label: string;
}
```

### `Technology`

```ts
interface Technology {
  id: string;
  name: string;
  url: string;
}
```