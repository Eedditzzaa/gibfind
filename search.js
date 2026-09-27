const fs = require("fs");
const { createGibworkClient } = require("@gibwork/sdk/node");

const preferences = JSON.parse(
  fs.readFileSync("preferences.json", "utf8")
);

const privateKey = JSON.parse(
  fs.readFileSync("gibwork-keypair.json", "utf8")
);

const gibwork = createGibworkClient({
  privateKey,
  production: false,
});

function matchesBounty(bounty) {
  const text = [
    bounty.title || "",
    bounty.content || "",
    ...(bounty.tags || [])
  ].join(" ").toLowerCase();

  // Category matching
  const categoryMatch =
    preferences.categories.length === 0 ||
    preferences.categories.some(category =>
      (bounty.tags || []).some(tag =>
        tag.toLowerCase().includes(category.toLowerCase())
      )
    );

  // Payment matching
  const payment = Number(
    bounty.minSubmissionAmount || 0
  );

  const paymentMatch =
    payment >= preferences.minPayment;

  // Skill matching
  // Skills are searched inside title/content/tags.
  const skillMatch =
    preferences.skills.length === 0 ||
    preferences.skills.some(skill =>
      text.includes(skill.toLowerCase())
    );

  // Keyword matching
  const keywordMatch =
    preferences.keywords.length === 0 ||
    preferences.keywords.some(keyword =>
      text.includes(keyword.toLowerCase())
    );

  // Deadline matching
  let deadlineMatch = true;

  if (bounty.deadline && preferences.maxDeadlineDays !== null) {
    const deadline = new Date(bounty.deadline);
    const now = new Date();

    const daysUntilDeadline =
      (deadline - now) / (1000 * 60 * 60 * 24);

    deadlineMatch =
      daysUntilDeadline >= 0 &&
      daysUntilDeadline <= preferences.maxDeadlineDays;
  }

  return (
    categoryMatch &&
    paymentMatch &&
    skillMatch &&
    keywordMatch &&
    deadlineMatch
  );
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