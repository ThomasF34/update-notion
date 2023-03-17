"use strict";
const core = require("@actions/core");
const github = require("@actions/github");
const dayjs = require("dayjs");
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}
function extractGithubParams() {
    var _a, _b, _c;
    const pullRequest = github.context.payload.pull_request;
    const requiredPrefix = escapeRegExp(core.getInput("required-prefix", { required: false }) || "");
    const requiredSuffix = escapeRegExp(core.getInput("required-suffix", { required: false }) || "");
    const isDraft = (_a = github.context.payload.pull_request) === null || _a === void 0 ? void 0 : _a.draft;
    const isMerged = (_b = github.context.payload.pull_request) === null || _b === void 0 ? void 0 : _b.merged;
    const statusKey = isMerged
        ? "merged"
        : isDraft
            ? "draft"
            : github.context.payload.action;
    const status = core.getInput(statusKey, { required: false });
    const githubUrlProperty = core.getInput("github-url-property-name", { required: false }) ||
        "Github Url";
    const statusProperty = core.getInput("status-property-name", { required: false }) || "Status";
    return {
        metadata: {
            statusKey: statusKey,
        },
        pullRequest: {
            body: (_c = pullRequest.body) !== null && _c !== void 0 ? _c : "",
            href: pullRequest.html_url,
            status: status,
        },
        suffix: requiredSuffix,
        prefix: requiredPrefix,
        isMerged,
        notionProperties: {
            githubUrl: githubUrlProperty,
            status: statusProperty,
            mergedAt: dayjs().format(),
        },
    };
}
module.exports = { extractParams: extractGithubParams };
