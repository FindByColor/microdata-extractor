![Find By Color Logo](img/logo.png "Find By Color Logo Logo")

**[↤ Developer Overview](../README.md)**

Development Scripts
===

NPM Scripts:

| command               | description                                          |
|-----------------------|------------------------------------------------------|
| `npm test`            | Perform Unit Tests                                   |
| `npm run test:single` | Perform Single Test                                  |
| `npm run build`       | Build & Compile Microdata Extractor                  |
| `npm run dev`         | Watches for Code Changes and re-runs `npm run build` |
| `npm run lint`        | Tests Javascript Code against Linting Rules          |
| `npm run postinstall` | Automatically Runs after: `npm install`              |
| `npm run prepublish`  | Automatically Runs before: `npm publish`             |
| `npm run help`        | Generates List of NPM Scripts you can run            |

#### Running Single Unit Tests:

You can run a Single Unit test with the following command:

```bash
npm run test:single -- test/basic-features.js
```

You can also update the expected output used for tests by passing in an `--update` flag on a single test:

```bash
npm run test:single -- test/basic-features.js --update
```

#### See all scripts

```bash
npm run help
```

#### Filter scripts

```bash
npm run help [regex]
```
