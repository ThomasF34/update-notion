# Github Action - Update Notion

## Inputs

### `status-property-name`

Name of the status property that will receive a new tag based on the triggered
action

### `url-property-name`

Name of the url property that will receive the url of the PR

### `<name-of-possible-action>`

If you want a different status than the name of the triggered action, you can
input a mapping value with this input

## Example usage

```
uses: actions/update-notion@v1
env:
  NOTION_BOT_SECRET_KEY: ${{ secrets.NOTION_BOT_SECRET_KEY }}
with:
    - status-property-name: 'Status'
    - url-property-name: 'Github URL'
    - opened: 'In progresss'
    - edited: 'In progress'
    - closed: 'Done'
    - reopened: 'In progress'
    - ready_for_review: 'In review'
    - review_requested: 'In review'
```

## Possible action

- assigned
- unassigned
- labeled
- unlabeled
- opened
- edited
- closed
- reopened
- synchronize
- ready_for_review
- locked
- unlocked
- review_requested
- review_request_removed
