const fs = require("fs");
const { notify } = require("./notify");

const preferences = JSON.parse(
  fs.readFileSync("preferences.json", "utf8")
);

const bounty = JSON.parse(
  fs.readFileSync("test-bounty.json", "utf8")
);

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

  const paymentMatch =
    Number(bounty.minSubmissionAmount || 0) >=
    preferences.minPayment;

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

  return (
    categoryMatch &&
    paymentMatch &&
    skillMatch &&
    keywordMatch
  );
}

console.log("Testing automatic match detection...");

if (matchesBounty(bounty)) {
  console.log("Match detected!");
  notify(bounty);
} else {
  console.log("Test bounty did not match preferences.");
}