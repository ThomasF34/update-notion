var _a;
const core = require("@actions/core");
const github = require("@actions/github");
const fetch = require("node-fetch");
const pullRequest = github.context.payload.pull_request;
const PRBody = pullRequest.body;
const PRHref = pullRequest.html_url;
const urlRegex = /(https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?/g;
const urls = (_a = PRBody.match(urlRegex)) !== null && _a !== void 0 ? _a : [];
const notionUrl = urls.find((url) => url.match("notion.so"));
const status = core.getInput(github.context.payload.action, {
    required: false,
});
const githubUrlProperty = core.getInput("github-url-property-name", { required: false }) ||
    "Github Url";
const statusProperty = core.getInput("status-property-name", { required: false }) || "Status";
if (notionUrl) {
    const urlParts = notionUrl.split("/");
    const taskName = urlParts[urlParts.length - 1];
    const taskParts = taskName.split("-");
    const pageId = taskParts[taskParts.length - 1];
    fetch(`https://api.notion.com/v1/pages/${pageId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NOTION_BOT_SECRET_KEY}`,
        },
        body: JSON.stringify({
            properties: {
                ...(status
                    ? {
                        [statusProperty]: {
                            name: status,
                        },
                    }
                    : {}),
                [githubUrlProperty]: PRHref,
            },
        }),
    })
        .then((res) => {
        if (!res.ok) {
            res.json().then((json) => {
                throw json;
            });
        }
        if (!status) {
            core.info(`The status ${github.context.payload.action} is not mapped with a value in the action definition. Hence, the task update body does not contain a status update`);
        }
        core.info("Notion task updated!");
    })
        .catch((error) => {
        core.setFailed(error);
    });
}
else {
    core.warning("No notion task found in the PR body.");
}
