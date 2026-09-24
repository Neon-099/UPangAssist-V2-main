const {
  findRelevantReferences,
  findSpecificBuildingReference,
  findUnverifiedBuildingName,
  formatReferences,
  streamAnswerWithOllama,
  generateAnswerWithOllama
} = require("../services/chatService");
const { getKnowledgeBase } = require("../services/knowledgeBaseService");

async function answerQuestion(req, res, next) {
  try {
    const question =
      typeof req.body?.question === "string"
        ? req.body.question.trim()
        : "";

    const wantStream =
      req.body?.stream === true ||
      req.query?.stream === "true";

    if (!question) {
      return res.status(400).json({
        error: "Question is required"
      });
    }

    if (question.length > 1000) {
      return res.status(400).json({
        error: "Question must not exceed 1000 characters"
      });
    }

    const unverifiedBuilding = findUnverifiedBuildingName(question);
    if (unverifiedBuilding) {
      const message = `I do not have a verified UPang reference for the ${unverifiedBuilding} Building location. Please contact Campus Administration or the relevant college office for the current location.`;

      if (wantStream) {
        res.setHeader("Content-Type", "text/plain; charset=utf-8");
        return res.end(message);
      }

      return res.status(200).json({
        text: message,
        provider: "verified_reference_check"
      });
    }

    const specificBuilding = findSpecificBuildingReference(question);
    if (specificBuilding) {
      const text = `${specificBuilding.answer}\n\n*Source: ${specificBuilding.source || "UPang Campus Directory"} (${specificBuilding.page || "Campus Map"})*`;

      if (wantStream) {
        res.setHeader("Content-Type", "text/plain; charset=utf-8");
        return res.end(text);
      }

      return res.status(200).json({
        text,
        provider: "instant_knowledge_base"
      });
    }

    let result = findRelevantReferences(question);

    try {
      const semanticReferences = await findSemanticReferences(
        question,
        getKnowledgeBase()
      );

      if (semanticReferences.length > 0) {
        result = semanticReferences;
      }
    } catch (error) {
      console.warn(
        "Semantic search unavailable; using keyword search:",
        error.message
      );
    }

    const referenceContext = formatReferences(result);

    if (wantStream) {
      return streamAnswerWithOllama(
        question,
        referenceContext,
        res
      );
    }

    try {
      const text = await generateAnswerWithOllama(
        question,
        referenceContext
      );

      if (!text) {
        throw new Error("Chatbot returned an empty answer");
      }

      return res.status(200).json({ text, provider: "ollama" });
    } catch (error) {
      console.error("Chat provider error:", error.message);

      if (result.length > 0) {
        const top = result[0];
        return res.status(200).json({
          text: `${top.answer}\n\n*Office: ${top.office || "Official Office"} | Source: ${top.source || "Official UPang Guidelines"}*`,
          provider: "verified_reference_fallback",
          fallback: true
        });
      }

      return res.status(200).json({
        text: "I couldn't find a verified UPang answer for that question right now. Please contact the appropriate official UPang office for assistance.",
        provider: "unavailable_fallback",
        fallback: true
      });
    }
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  answerQuestion
};