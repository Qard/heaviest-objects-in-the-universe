const filesize = require('filesize')
const ejs = require('ejs')

// NOTE: This must be inline for it to work with the bundler
const template = ejs.compile(`
# Overall package size

Self size: <%= filesize(totalFileSize) %>
Deduped: <%= filesize(totalDedupedSize) %>
No deduping: <%= filesize(totalSize) %>

# Dependency sizes

| dependency | self size | total size |
|------------|-----------|------------|
<% for (const dep of dependencySizes) {
  %>| <%= dep.name %>@<%= dep.version %> | <%= dep.totalFileSize %> | <%= dep.totalDedupedSize %> |
<% } %>

`, {
  filename: 'template.ejs'
})

module.exports = function markdown (data) {
  return template({
    ...data,
    filesize
  })
}

