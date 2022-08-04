![heaviest objects in the universe...node_modules](https://i.redd.it/tfugj4n3l6ez.png)

# heaviest-objects-in-the-universe

This project is a Node.js module, a CLI tool, and a GitHub Action all rolled into one. It measures the size of a module and all its dependencies.

## Node.js Module

```sh
npm install heaviest-objects-in-the-universe
```

```js
const getSizeTree = require('heaviest-objects-in-the-universe')

const tree = await getSizeTree('./', {
  // Include devDependencies of root module
  // Default: false
  withDev: true,
  // Set the root to resolve the base path from
  // Default: process.cwd()
  cwd: process.cwd(),
  // Ignore given filenames in size checks and recursion
  // Default: [ '.git', 'node_modules' ]
  ignore: [ '.git', 'node_modules' ]
})
```

For a reference describing the tree structure, see the [TypeScript types](./index.d.ts).

## CLI Tool

```sh
npm install --global heaviest-objects-in-the-universe
hoitu ./path/to/my/module
```

## GitHub Actions

```yml
uses: qard/heaviest-objects-in-the-universe@v1
with:
  # Required to provide issue comments
  github-token: ${{ secrets.GITHUB_TOKEN }}
```
