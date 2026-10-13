# Gibfind — Gibwork Bounty Matcher

**Gibfind helps you find Gibwork bounties that match your interests.**

Instead of checking every bounty manually, you can set your preferences and let Gibfind find relevant opportunities for you.

Gibfind uses the **Gibwork SDK** to fetch bounties, filters them using your preferences, and can send you an email when a new matching bounty is found.

## 1. What can Gibfind do?

- Find bounties by category, such as Development or Research.
- Filter by minimum payment.
- Match skills such as Python or AI.
- Filter by deadline.
- Search for specific keywords.
- Choose how many filter categories must match.
- Send email notifications for new matching bounties.
- Avoid sending duplicate notifications for the same bounty.

Gibfind runs in your terminal. It does not need a website or dashboard.

## 2. How does it work?

```text
Gibwork
   |
   v
Fetch Bounties Using SDK
   |
   v
Check Your Preferences
   |
   v
Find Matching Bounties
   |
   v
Check for Duplicates
   |
   v
Send Email Notification
```

## 3. What do you need?

Before starting, install these tools:

1. **Node.js and npm** — to run the project. Download them from https://nodejs.org/
2. **Git** — to download the project. Download it from https://git-scm.com/
3. **Gibwork credentials** — needed to fetch bounties using the SDK.
4. **Gmail account** — optional, but required if you want email notifications.

If you are new to coding, complete the following steps in order.

## 4. Download and install Gibfind

Open Command Prompt or a terminal.

### Step 1: Download the project

Run:

```bash
git clone https://github.com/Eedditzzaa/gibfind.git
```

Move into the project folder:

```bash
cd gibfind
```

### Step 2: Install dependencies

Run:

```bash
npm install
```

This installs the libraries Gibfind needs to work.

### Step 3: Enable the Gibfind command

Run:

```bash
npm link
```

This makes the `gibfind` command available in your local development environment.

If you are using Windows and a command is not recognized, close and reopen your terminal and try again.

## 5. Set up your Gibwork credentials

Gibfind uses the Gibwork SDK to retrieve available bounties.

Place your valid Gibwork keypair JSON file in the project folder and name it:

```text
gibwork-keypair.json
```

The file must contain a valid keypair in the format expected by the SDK.

**Important:** Never share your private key or upload `gibwork-keypair.json` to GitHub. Use your own credentials and keep this file private.

## 6. Choose your bounty preferences

Open `preferences.json` in a text editor.

You will see settings similar to these:

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

You can change these values to suit your interests.

| Setting | What it means |
|---|---|
| `categories` | The bounty categories you want |
| `minPayment` | The minimum payment you accept |
| `skills` | Skills or terms you want to find |
| `maxDeadlineDays` | The maximum number of days until a deadline |
| `keywords` | Words you want to search for |
| `minimumMatches` | The minimum number of filter categories that must match |

### What does `minimumMatches` mean?

For example, if you set:

```json
"minimumMatches": 1
```

A bounty can match when at least one of your configured filter categories matches.

If you set it to:

```json
"minimumMatches": 2
```

At least two filter categories must match.

You can edit these settings whenever your interests change. Save the file after editing it.

## 7. Set up email notifications (optional)

If you want to receive email alerts, create a file named `.env` in the project folder.

Add these lines:

```env
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-gmail-app-password
NOTIFY_TO=recipient-email@gmail.com
```

Replace the example values with your own email settings.

- `GMAIL_USER` is the Gmail account used to send notifications.
- `GMAIL_APP_PASSWORD` is the Gmail App Password used for authentication.
- `NOTIFY_TO` is the email address that receives notifications.

Use a Gmail App Password rather than your regular Gmail password. Gmail App Passwords require the appropriate Google Account security setup.

**Keep `.env` private. Never upload your email credentials to GitHub.**

## 8. Run Gibfind

Once the setup is complete, open your terminal inside the project folder.

### Command 1: View your preferences

```bash
gibfind config
```

This displays your saved configuration.

### Command 2: Find matching bounties

```bash
gibfind search
```

Gibfind fetches available bounties and checks them against your preferences.

Example output:

```text
=== Gibwork Bounty Matcher ===

Found 10 available bounties.
Matching bounties: 2
```

The actual number of bounties depends on the live data and your preferences.

### Command 3: Watch for new matches

```bash
gibfind watch
```

Gibfind checks for matching bounties every 60 seconds.

When it finds a matching bounty that has not been processed before, it attempts to send an email notification and records the bounty ID to prevent duplicate notifications.

To stop the watcher, press:

```text
Ctrl + C
```

## 9. Test the project

You do not need to wait for a new real bounty to test the sample notification workflow.

The project includes a sample bounty in `test-bounty.json` and a test runner called `watch-test.js`.

Run:

```bash
node watch-test.js
```

The test uses sample bounty data to demonstrate matching and notification behavior.

If email settings are configured correctly, the test should also send an email.

You can then test against real Gibwork data by running:

```bash
gibfind search
```

**Note:** The sample test does not create a real bounty on Gibwork. It only tests the local workflow.

## 10. Project files explained

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
├── .env
└── gibwork-keypair.json
```

Here is what the main files do:

- `bin/gibfind.js` — handles the CLI commands.
- `search.js` — fetches and filters bounties.
- `watch.js` — checks for matching bounties repeatedly.
- `notify.js` — handles match notifications.
- `email.js` — sends email notifications.
- `preferences.json` — stores your filtering preferences.
- `test-bounty.json` — contains sample bounty data.
- `watch-test.js` — tests the sample notification workflow.
- `.env` — stores local email settings.
- `gibwork-keypair.json` — stores local Gibwork credentials.

The `.env` and `gibwork-keypair.json` files are private local files and must never be uploaded to GitHub.

## 11. Troubleshooting

**Problem: `gibfind` is not recognized**

Run `npm link` from the project folder. If necessary, reopen your terminal.

**Problem: Gibwork credential error**

Check that your keypair file exists, is valid, and is configured correctly for the SDK.

**Problem: No bounties match**

Check your `preferences.json` settings. Try relaxing the filters or lowering `minimumMatches`.

**Problem: Email notification fails**

Check your Gmail settings, App Password, and `.env` file. Make sure the required environment variables are present.

## 12. Gibwork integration

Gibfind uses the `@gibwork/sdk` package to fetch available bounties. Its own matching logic filters those results based on user preferences.

The CLI provides a simple way to search, configure preferences, and monitor opportunities without using a web dashboard.

## 13. Security

Never commit private credentials or passwords.

Make sure `.gitignore` excludes at least:

```gitignore
node_modules/
.env
gibwork-keypair.json
private-key.txt
seen.json
```

Before pushing changes to GitHub, check that no secrets are included.

## 14. Future improvements

- More filtering options.
- Additional notification methods.
- Better bounty ranking.
- Optional MCP integration for AI assistants.

## License

MIT
