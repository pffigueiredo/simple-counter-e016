
import { z } from 'zod';

// Counter schema
export const counterSchema = z.object({
  id: z.number(),
  value: z.number().int(),
  updated_at: z.coerce.date()
});

export type Counter = z.infer<typeof counterSchema>;

// Input schema for incrementing counter
export const incrementCounterInputSchema = z.object({
  amount: z.number().int().positive().optional().default(1) // Default increment by 1
});

export type IncrementCounterInput = z.infer<typeof incrementCounterInputSchema>;
