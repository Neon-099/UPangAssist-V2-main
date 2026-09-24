const fs = require("fs");
const path = require("path");

function getKnowledgeBase() {
  const filePath = path.join(__dirname, "../../data/knowledgeBase.json");
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

module.exports = {
  getKnowledgeBase
};