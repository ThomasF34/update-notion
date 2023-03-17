"use strict";
var _a;
const core = require("@actions/core");
const github = require("@actions/github");
const { Client } = require("@notionhq/client");
const { extractParams } = require("./githubParams");
const URL_REGEX = "(https)://([\\w_-]+(?:(?:.[\\w_-]+)+))([\\w.,@?^=%&:/~+#-]*[\\w@?^=%&/~+#-])?";
const params = extractParams();
const enhancedRegex = `${params.prefix}${URL_REGEX}${params.suffix}`;
const urls = (_a = params.pullRequest.body.match(enhancedRegex)) !== null && _a !== void 0 ? _a : [];
core.info(JSON.stringify(params.pullRequest.body, null, 2));
const urlFound = urls.find((url) => url.match("notion.so"));
if (urlFound) {
    const notionUrlParts = urlFound
        .match(URL_REGEX)
        .map((url) => {
        try {
            const u = new URL(url);
            return `${u.origin}${u.pathname}`;
        }
        catch (error) {
            return url;
        }
    })
        .find((url) => url.match("notion.so"))
        .split("/");
    core.info(JSON.stringify(notionUrlParts, null, 2));
    const taskName = notionUrlParts[notionUrlParts.length - 1];
    const taskParts = taskName.split("-");
    const pageId = taskParts[taskParts.length - 1];
    const notion = new Client({
        auth: process.env.NOTION_BOT_SECRET_KEY,
    });
    notion.pages
        .update({
        page_id: pageId,
        properties: {
            ...(params.pullRequest.status
                ? {
                    [params.notionProperties.status]: {
                        name: params.pullRequest.status,
                    },
                }
                : {}),
            [params.notionProperties.githubUrl]: params.pullRequest.href,
        },
    })
        .then(() => {
        if (!params.pullRequest.status) {
            core.info(`The status ${params.metadata.statusKey} is not mapped with a value in the action definition. Hence, the task update body does not contain a status update`);
        }
        core.info("Notion task updated!");
    })
        .catch((err) => {
        core.setFailed(err);
    });
}
else {
    core.warning("No notion task found in the PR body.");
}
