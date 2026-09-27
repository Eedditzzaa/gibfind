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
  production: false,
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

  const categoryMatch =
    preferences.categories.length === 0 ||
    preferences.categories.some(category =>
      (bounty.tags || []).some(tag =>
        tag.toLowerCase().includes(category.toLowerCase())
      )
    );

  const payment =
    Number(bounty.minSubmissionAmount || 0);

  const paymentMatch =
    payment >= preferences.minPayment;

  const skillMatch =
    preferences.skills.length === 0 ||
    preferences.skills.some(skill =>
      text.includes(skill.toLowerCase())
    );

  const keywordMatch =
    preferences.keywords.length === 0 ||
    preferences.keywords.some(keyword =>
      text.includes(keyword.toLowerCase())
    );

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

      notify(bounty);


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