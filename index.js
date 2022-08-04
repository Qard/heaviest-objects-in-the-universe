const { context, getOctokit } = require('@actions/github')
const { getInput, setFailed } = require('@actions/core')

try {
  // Dump context for now, for debugging
  console.log(context)

  const token = getInput('github-token')

  const body = 'Hi there! 👋🏻'
  console.log(body)

  if (context.eventName === 'pull_request') {
    const { rest } = getOctokit(token)

    const {
      owner,
      repo,
      issue: issue_number
    } = context.issue

    rest.issues.createComment({
      owner,
      repo,
      issue_number,
      body,
    })
  }
} catch (err) {
  setFailed(err.message)
}
