# Google OAuth App Disclosure

Use this text as a short disclosure/reference when configuring or reviewing the Google OAuth app for Tabs Session Saver.

## App Name

Tabs Session Saver Cloud Sync

## App Purpose

Tabs Session Saver uses Google Sign-In only to authenticate users who choose to enable optional Cloud Sync. Cloud Sync lets users synchronize saved browser tab sessions across their own devices.

## Requested Scopes

- `openid`
- `email`
- `profile`

## Why These Scopes Are Needed

Tabs Session Saver uses these scopes to identify the user's sync account and display the signed-in account in the Extension.

The Extension does not use these scopes to access Google Drive, Gmail, Calendar, Contacts, or any other Google product data.

## User Data Processed by Cloud Sync

If Cloud Sync is enabled, Tabs Session Saver may sync:

- saved tab URLs and titles;
- browser window structure;
- Chrome tab group names, colors, and tab membership;
- session names and timestamps;
- sync metadata such as revision numbers and device identifiers.

Cloud Sync is optional. Users can keep all session data local by not enabling Cloud Sync.

## Recommended App Domain URLs

Homepage:

```text
https://tabsessionsaver.paoloronco.it/
```

Privacy Policy:

```text
https://tabsessionsaver.paoloronco.it/privacy
```

Terms of Service:

```text
https://tabsessionsaver.paoloronco.it/terms
```

Data Deletion:

```text
https://tabsessionsaver.paoloronco.it/data-deletion
```
