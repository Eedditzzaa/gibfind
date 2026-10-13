const fs = require("fs");
const { createGibworkClient } = require("@gibwork/sdk/node");
const { notify } = require("./notify");

const preferences = JSON.parse(
  fs.readFileSync("preferences.json", "utf8")
);

const privateKey = JSON.parse(
  fs.readFileSync("gibwork-keypair.json", "utf8")
);

const gibwork = createGibworkClient({
  privateKey,
  production: true,
});

const SEEN_FILE = "seen.json";

function loadSeen() {
  if (!fs.existsSync(SEEN_FILE)) {
    return [];
  }

  return JSON.parse(
    fs.readFileSync(SEEN_FILE, "utf8")
  );
}

function saveSeen(seen) {
  fs.writeFileSync(
    SEEN_FILE,
    JSON.stringify(seen, null, 2)
  );
}

function matchesBounty(bounty) {
  const text = [
    bounty.title || "",
    bounty.content || "",
    ...(bounty.tags || [])
  ].join(" ").toLowerCase();

  let matchCount = 0;

  // Category
  if (preferences.categories.length > 0) {
    const categoryMatch = preferences.categories.some(category =>
      (bounty.tags || []).some(tag =>
        tag.toLowerCase().includes(category.toLowerCase())
      )
    );

    if (categoryMatch) {
      matchCount++;
    }
  }

  // Minimum payment
  if (preferences.minPayment !== null) {
    const payment = Number(bounty.minSubmissionAmount || 0);

    if (payment >= preferences.minPayment) {
      matchCount++;
    }
  }

  // Skills
  if (preferences.skills.length > 0) {
    const skillMatch = preferences.skills.some(skill =>
      text.includes(skill.toLowerCase())
    );

    if (skillMatch) {
      matchCount++;
    }
  }

  // Keywords
  if (preferences.keywords.length > 0) {
    const keywordMatch = preferences.keywords.some(keyword =>
      text.includes(keyword.toLowerCase())
    );

    if (keywordMatch) {
      matchCount++;
    }
  }

  // Deadline
  if (
    bounty.deadline &&
    preferences.maxDeadlineDays !== null
  ) {
    const deadline = new Date(bounty.deadline);
    const now = new Date();

    const daysUntilDeadline =
      (deadline - now) / (1000 * 60 * 60 * 24);

    if (
      daysUntilDeadline >= 0 &&
      daysUntilDeadline <= preferences.maxDeadlineDays
    ) {
      matchCount++;
    }
  }

  // At least the configured number of filters must match
  return matchCount >= preferences.minimumMatches;
}

async function checkBounties() {
  try {
    console.log(
      `\n[${new Date().toLocaleTimeString()}] Checking Gibwork...`
    );

    const response = await gibwork.tasks.listAvailable({
      page: 1,
      limit: 100,
    });

    const seen = loadSeen();

    const matches = response.results.filter(matchesBounty);

    console.log(
      `Found ${response.results.length} bounties, ${matches.length} matching.`
    );

    for (const bounty of matches) {
      if (seen.includes(bounty.id)) {
        continue;
      }

      await notify(bounty);

      seen.push(bounty.id);
    }

    saveSeen(seen);

  } catch (error) {
    console.error("Watch error:", error.message);
  }
}

console.log("=== Gibwork Bounty Watcher ===");
console.log("Watcher started.");
console.log("Checking every 60 seconds.");
console.log("Press Ctrl+C to stop.");

checkBounties();

setInterval(checkBounties, 60 * 1000);
