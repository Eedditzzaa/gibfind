#!/usr/bin/env node

const command = process.argv[2];

if (command === "search") {
  require("../search.js");

} else if (command === "watch") {
  require("../watch.js");

} else if (command === "config") {
  const fs = require("fs");

  const file = "preferences.json";

  if (!fs.existsSync(file)) {
    console.log("preferences.json not found.");
    process.exit(1);
  }

  const preferences = JSON.parse(
    fs.readFileSync(file, "utf8")
  );

  console.log("\n=== Gibfind Preferences ===\n");

  console.log(
    `Categories: ${
      preferences.categories.length
        ? preferences.categories.join(", ")
        : "Any"
    }`
  );

  console.log(`Minimum payment: ${preferences.minPayment}`);

  console.log(
    `Skills: ${
      preferences.skills.length
        ? preferences.skills.join(", ")
        : "Any"
    }`
  );

  console.log(
    `Max deadline: ${
      preferences.maxDeadlineDays
    } days`
  );

  console.log(
    `Keywords: ${
      preferences.keywords.length
        ? preferences.keywords.join(", ")
        : "Any"
    }`
  );

} else {
  console.log(`
Gibfind - Gibwork Bounty Matcher

Usage:
  gibfind search
  gibfind watch
  gibfind config

Commands:
  search    Find bounties matching your preferences
  watch     Monitor for new matching bounties
  config    Show current matching preferences
`);
}