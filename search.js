const fs = require("fs");
const { createGibworkClient } = require("@gibwork/sdk/node");

console.log("SEARCH.JS STARTED");

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

  return matchCount >= preferences.minimumMatches;
}

async function main() {
  console.log("Fetching Gibwork bounties...");

  const response = await gibwork.tasks.listAvailable({
    page: 1,
    limit: 100,
  });

  const matches = response.results.filter(matchesBounty);

  console.log("\n=== Gibwork Bounty Matcher ===\n");
  console.log(`Found ${response.results.length} available bounties.`);
  console.log(`Matching bounties: ${matches.length}\n`);

  for (const bounty of matches) {
    const payment =
      Number(bounty.minSubmissionAmount || 0);

    const symbol =
      bounty.asset?.symbol || "USDC";

    console.log("--------------------------------");
    console.log(`Title: ${bounty.title}`);
    console.log(`Payment: ${payment} ${symbol}`);
    console.log(`Tags: ${(bounty.tags || []).join(", ")}`);
    console.log(`Deadline: ${bounty.deadline || "No deadline"}`);
    console.log(`ID: ${bounty.id}`);
  }

  if (matches.length === 0) {
    console.log("No bounties match your preferences.");
  }
}

main().catch(error => {
  console.error("Matcher failed:", error.message);
  process.exit(1);
});