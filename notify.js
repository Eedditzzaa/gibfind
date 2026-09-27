const { sendEmail } = require("./email");

async function notify(bounty) {
  console.log("\n🔔 ===============================");
  console.log("       NEW GIBWORK MATCH!");
  console.log("===============================");
  console.log(`Title: ${bounty.title}`);
  console.log(`Payment: ${bounty.minSubmissionAmount} USDC`);
  console.log(`Tags: ${(bounty.tags || []).join(", ")}`);
  console.log(`ID: ${bounty.id}`);
  console.log("===============================\n");

  try {
    await sendEmail(bounty);
  } catch (error) {
    console.error("📧 Email notification failed:", error.message);
  }
}

module.exports = { notify };