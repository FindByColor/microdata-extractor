![Find By Color Logo](img/logo.png "Find By Color Logo Logo")

**[↤ Developer Overview](../README.md)**

Developer Setup
===

You can download this project using the code below ( this assumes you have [SSH integrated with Github](https://help.github.com/articles/adding-a-new-ssh-key-to-your-github-account/) ):

```bash
git clone git@github.com:FindByColor/microdata-extractor.git
cd microdata-extractor
npm install -g
extract help
```

NPM Scripts
---

| command               | description                                 |
|-----------------------|---------------------------------------------|
| `npm run help`        | Generates List of NPM Scripts you can run   |
| `npm run build`       | Build & Compile Microdata Extractor         |
| `npm run test`        | Perform Unit Tests                          |
| `npm run lint`        | Tests Javascript Code against Linting Rules |
| `npm run dev`         | Watches for Code Changes and runs linter    |
| `npm run prepublish`  | Automatically Runs before: `npm publish`    |
| `npm run postinstall` | Automatically Runs after: `npm install`     |


#### See all scripts

```
npm run help
```


#### Filter scripts

```
npm run help [regex]
```
