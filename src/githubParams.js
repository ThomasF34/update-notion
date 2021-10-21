const core = require("@actions/core");
const github = require("@actions/github");

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}

function extractGithubParams() {
  const pullRequest = github.context.payload.pull_request;

  const requiredPrefix = escapeRegExp(
    core.getInput("required-prefix", { required: false }) || ""
  );

  const requiredSuffix = escapeRegExp(
    core.getInput("required-suffix", { required: false }) || ""
  );

  const isDraft = github.context.payload.pull_request?.draft
  const isMerged = github.context.payload.pull_request?.merged
  const statusKey = isMerged ? 'merged' : isDraft ? 'draft' : github.context.payload.action
  const status = core.getInput(statusKey, { required: false });

  const githubUrlProperty = core.getInput("github-url-property-name", { required: false }) ||
    "Github Url";

  const statusProperty = core.getInput("status-property-name", { required: false }) || "Status";

  return {
    metadata: {
      statusKey: statusKey
    },
    pullRequest: {
      body: pullRequest.body ?? '',
      href: pullRequest.html_url,
      status: status
    },
    suffix: requiredSuffix,
    prefix: requiredPrefix,
    notionProperties: {
      githubUrl: githubUrlProperty,
      status: statusProperty
    }
  }
}

module.exports = { extractParams: extractGithubParams }