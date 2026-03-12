import express from "express";

const router = express.Router();

/**
 * GET /api/autocomplete?input=athens
 * XE autocomplete API
 */
router.get("/autocomplete", async (req, res) => {
  const { input } = req.query;

  if (!input || input.length < 3) {
    return res.status(400).json({
      error: "Input must be at least 3 characters",
    });
  }

  try {
    const response = await fetch(
      `https://oapaiqtgkr6wfbum252tswprwa0ausnb.lambda-url.eu-central-1.on.aws/?input=${encodeURIComponent(input)}`,
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return res.json(data);
  } catch (err) {
    console.error("Autocomplete error:", err.message);
    return res.status(500).json({
      error: "Failed to fetch autocomplete results",
    });
  }
});



export default router;
