import express from "express";
import { db } from "../database.js";

const router = express.Router();

/**
 * POST /api/ads
 * Creates a new property ad
 */
router.post("/ads", (req, res) => {
  const { title, type, areaName, placeId, price, description } = req.body;

  // Validate required fields
  const requiredFields = ["title", "type", "areaName", "placeId", "price"];
  if (!requiredFields.every((field) => req.body[field])) {
    return res.status(400).json({
      error: "Missing required fields",
    });
  }

  try {
    const statement = db.prepare(`
      INSERT INTO ads (title, type, area_name, place_id, price, description)
      VALUES (@title, @type, @areaName, @placeId, @price, @description)
    `);

    const result = statement.run({
      title,
      type,
      areaName,
      placeId,
      price: Number(price),
      description: description || null,
    });

    return res.status(201).json({
      message: "Ad created successfully",
      id: result.lastInsertRowid,
    });
  } catch (err) {
    console.error("Error creating ad:", err.message);
    return res.status(500).json({
      error: "Failed to create ad",
    });
  }
});

export default router;