import { Router } from 'express';
import { z } from 'zod';
import { analyzeInteractions, analyzeFoodCompatibility } from '../services/analysis.js';

export const router = Router();

// Validation schemas
const medicationSchema = z.object({
  name: z.string(),
  dosage: z.string().optional(),
  frequency: z.string().optional(),
});

const interactionsRequestSchema = z.object({
  currentMedications: z.array(medicationSchema),
  newItem: z.object({
    type: z.enum(['medication', 'food']),
    name: z.string(),
    dosage: z.string().optional(),
    frequency: z.string().optional(),
  }),
});

const foodCompatibilityRequestSchema = z.object({
  currentMedications: z.array(medicationSchema),
  newItem: z.object({
    type: z.literal('food'),
    name: z.string(),
    quantity: z.string().optional(),
    timing: z.enum(['before_medication', 'with_medication', 'after_medication']).optional(),
  }),
});

router.post('/interactions', async (req, res) => {
  try {
    const data = interactionsRequestSchema.parse(req.body);
    const result = await analyzeInteractions(data);
    res.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid request data', details: error.errors });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

router.post('/food-compatibility', async (req, res) => {
  try {
    const data = foodCompatibilityRequestSchema.parse(req.body);
    const result = await analyzeFoodCompatibility(data);
    res.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid request data', details: error.errors });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});