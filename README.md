# heaviest-objects-in-the-universe

GitHub Action to measure the size of a module and all its dependencies.

## Inputs

## `github-token`

**Required** The GitHub token to post PR comments.

## Example usage

uses: qard/heaviest-objects-in-the-universe@v1
with:
  github-token: ${{ secrets.GITHUB_TOKEN }}
