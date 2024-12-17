const filesize = require('filesize')
const ejs = require('ejs')

// NOTE: This must be inline for it to work with the bundler
const template = ejs.compile(`
# Overall package size

Self size: <%= filesize(totalFileSize) %>
Deduped: <%= filesize(totalDedupedSize) %>
No deduping: <%= filesize(totalSize) %>

<details><summary>Dependency sizes</summary>

| name | version | self size | total size |
|------|---------|-----------|------------|
<%
const sorted = dependencySizes.sort((a, b) => {
  return b.totalDedupedSize - a.totalDedupedSize
})

for (const dep of sorted) {
  %>| <%= dep.name %> | <%= dep.version %> | <%= filesize(dep.totalFileSize) %> | <%= filesize(dep.totalDedupedSize) %> |
<% } %>

</details>

`, {
  filename: 'template.ejs'
})

module.exports = function markdown (data) {
  return template({
    ...data,
    filesize
  })
}

