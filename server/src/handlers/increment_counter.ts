
import { db } from '../db';
import { countersTable } from '../db/schema';
import { type IncrementCounterInput, type Counter } from '../schema';
import { eq, sql } from 'drizzle-orm';

export const incrementCounter = async (input: IncrementCounterInput): Promise<Counter> => {
  try {
    // First, check if a counter exists
    const existingCounters = await db.select()
      .from(countersTable)
      .limit(1)
      .execute();

    let counter: Counter;

    if (existingCounters.length === 0) {
      // Create first counter with the increment amount
      const result = await db.insert(countersTable)
        .values({
          value: input.amount
        })
        .returning()
        .execute();

      counter = result[0];
    } else {
      // Update existing counter by incrementing its value
      const existingCounter = existingCounters[0];
      const result = await db.update(countersTable)
        .set({
          value: sql`${countersTable.value} + ${input.amount}`,
          updated_at: sql`now()`
        })
        .where(eq(countersTable.id, existingCounter.id))
        .returning()
        .execute();

      counter = result[0];
    }

    return counter;
  } catch (error) {
    console.error('Counter increment failed:', error);
    throw error;
  }
};
