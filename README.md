# Gibfind — Gibwork Bounty Matcher

Gibfind is a command-line tool that helps users discover Gibwork bounties that match their preferences.

Instead of manually checking every available bounty, users can filter bounties by category, minimum payment, skills, deadline, and keywords. Gibfind fetches available bounties using the Gibwork SDK, applies custom matching rules, and can monitor for new matches.

When a new matching bounty is detected, Gibfind can send an email notification.

## Why Gibfind?

Gibwork can have multiple bounties available at different times. Users may only be interested in particular types of work, payment ranges, skills, or keywords.

Gibfind reduces manual searching by automatically filtering available bounties and notifying users when relevant opportunities appear.

## Core Workflow

```text
Gibwork
   |
   v
Gibwork SDK
   |
   v
Fetch Available Bounties
   |
   v
Preference Matcher
   |
   +---- No Match ----> Ignore
   |
   +---- Match
          |
          v
     Duplicate Check
          |
          v
     Email Notification
          |
          v
        Gmail
```

## Features

- Fetch available bounties using the Gibwork SDK.
- Filter bounties by category, minimum payment, skills, deadline, and keywords.
- Configure how many selected filter categories must match.
- Search for matching bounties from the terminal.
- Monitor bounties periodically in watch mode.
- Send email notifications for new matching bounties.
- Track previously notified bounty IDs to prevent duplicate notifications.
- Test notification behavior using a sample bounty.

## Requirements

Before running Gibfind, install or prepare:

- Node.js and npm.
- A Gibwork account and the credentials required to access available bounties through the SDK.
- A Gmail account if you want email notifications.
- A Gmail App Password for SMTP authentication.

## Installation

Clone the repository and enter the project directory:

```bash
git clone https://github.com/Eedditzzaa/gibfind.git
cd gibfind
```

Install dependencies:

```bash
npm install
```

Register the local CLI command:

```bash
npm link
```

Check that the command is available:

```bash
gibfind config
```

## Configuration

### 1. Gibwork credentials

Gibfind uses the Gibwork SDK to retrieve available bounties.

Place your valid Gibwork keypair JSON file in the project directory using the filename:

```text
gibwork-keypair.json
```

Use your own valid credentials and follow Gibwork's credential setup instructions. Never share your private key or commit the keypair file to GitHub.

### 2. Bounty preferences

Edit `preferences.json` to configure your matching rules.

Example:

```json
{
  "categories": ["Development", "Research"],
  "minPayment": 5,
  "skills": ["Python", "AI"],
  "maxDeadlineDays": 7,
  "keywords": ["automation"],
  "minimumMatches": 1
}
```

Configuration fields:

| Field | Description |
|---|---|
| `categories` | Categories to look for |
| `minPayment` | Minimum acceptable submission payment |
| `skills` | Skills or related terms to match |
| `maxDeadlineDays` | Maximum number of days until the deadline |
| `keywords` | Keywords to search for in bounty information |
| `minimumMatches` | Minimum number of selected filter categories that must match |

With `minimumMatches` set to `1`, a bounty can match when at least one configured filter category matches. Increase it to `2` or more to require multiple filter categories to match.

Set unused list filters to `[]` and unused numeric filters to `null` if you do not want to apply them. Set `maxDeadlineDays` to `null` to disable the deadline filter.

## Email Notification Setup

Create a `.env` file in the project directory:

```env
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-gmail-app-password
NOTIFY_TO=recipient-email@gmail.com
```

Replace the example values with your own settings.

Use a Gmail App Password rather than your normal Gmail password. Keep `.env` private and never upload it to GitHub.

Email notifications require valid Gmail SMTP credentials. You can still use the search command without configuring email.

## Usage

### Show configuration

```bash
gibfind config
```

Displays the saved bounty preferences.

### Search for matching bounties

```bash
gibfind search
```

Gibfind fetches available bounties, applies the configured matching rules, and prints the matching results.

Example output:

```text
=== Gibwork Bounty Matcher ===

Found 10 available bounties.
Matching bounties: 2

--------------------------------
Title: Example Development Bounty
Payment: 25 USDC
Tags: Development
Deadline: No deadline
ID: example-bounty-id
```

The bounty titles, amounts, and number of matches depend on the live data and your preferences.

### Monitor for new matching bounties

```bash
gibfind watch
```

Watch mode checks for matching bounties every 60 seconds. When a matching bounty has not been processed before, Gibfind sends an email notification and records its ID in `seen.json`.

Stop watch mode with `Ctrl+C`.

## Testing

### Test matching and email notification

The repository includes a sample bounty in `test-bounty.json` and a test runner in `watch-test.js`.

Run:

```bash
node watch-test.js
```

This test is intended to demonstrate matching and notification behavior using sample data, without waiting for a new live bounty to appear.

A successful run should report a detected match and attempt to send the email notification. Make sure your `.env` email settings are configured before testing email delivery.

### Test against live Gibwork data

Run:

```bash
gibfind search
```

Confirm that Gibfind fetches available bounties and displays results based on your preferences.

To test continuous monitoring, run:

```bash
gibfind watch
```

You can stop the watcher with `Ctrl+C`. A new live matching bounty is not guaranteed to appear during a short test.

## Project Structure

```text
gibfind/
├── bin/
│   └── gibfind.js
├── search.js
├── watch.js
├── notify.js
├── email.js
├── preferences.json
├── test-bounty.json
├── watch-test.js
├── package.json
├── package-lock.json
├── README.md
├── .env                  # Local only; do not commit
└── gibwork-keypair.json  # Local only; do not commit
```

## Gibwork Integration

Gibfind uses `@gibwork/sdk` as a core part of its implementation to fetch available bounties. The matching engine then evaluates the fetched data against user-defined preferences.

The CLI provides the user interface, while the matcher, duplicate tracking, and email notification workflow provide the automation.

## Security

Never commit credentials or private configuration files. Ensure `.env`, `gibwork-keypair.json`, `private-key.txt`, and `seen.json` are excluded by `.gitignore`.

Do not include actual credentials in screenshots, demo videos, logs, or documentation.

## Current Status

Gibfind has been tested with live Gibwork bounty data, configurable matching preferences, CLI commands, and email notification delivery. The sample-bounty test supports demonstrating the notification workflow without waiting for a new live match.

## Future Improvements

- Additional filtering options.
- More notification channels.
- Improved matching and ranking.
- Optional MCP integration for AI assistant workflows.

## License

MIT
