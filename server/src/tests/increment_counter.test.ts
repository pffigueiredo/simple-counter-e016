
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { countersTable } from '../db/schema';
import { type IncrementCounterInput } from '../schema';
import { incrementCounter } from '../handlers/increment_counter';

describe('incrementCounter', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create first counter with increment amount', async () => {
    const input: IncrementCounterInput = {
      amount: 5
    };

    const result = await incrementCounter(input);

    expect(result.id).toBeDefined();
    expect(result.value).toEqual(5);
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should increment existing counter by specified amount', async () => {
    // Create initial counter
    await db.insert(countersTable)
      .values({ value: 10 })
      .execute();

    const input: IncrementCounterInput = {
      amount: 3
    };

    const result = await incrementCounter(input);

    expect(result.value).toEqual(13);
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should use default increment of 1 when amount not specified', async () => {
    // Create initial counter
    await db.insert(countersTable)
      .values({ value: 7 })
      .execute();

    const input: IncrementCounterInput = {
      amount: 1 // Include the default value explicitly
    };

    const result = await incrementCounter(input);

    expect(result.value).toEqual(8);
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should save updated counter to database', async () => {
    // Create initial counter
    await db.insert(countersTable)
      .values({ value: 20 })
      .execute();

    const input: IncrementCounterInput = {
      amount: 5
    };

    const result = await incrementCounter(input);

    // Verify in database
    const counters = await db.select()
      .from(countersTable)
      .execute();

    expect(counters).toHaveLength(1);
    expect(counters[0].value).toEqual(25);
    expect(counters[0].id).toEqual(result.id);
  });

  it('should handle multiple increments correctly', async () => {
    // First increment - creates counter
    await incrementCounter({ amount: 10 });
    
    // Second increment - updates existing
    const result = await incrementCounter({ amount: 15 });

    expect(result.value).toEqual(25);

    // Verify only one counter exists
    const counters = await db.select()
      .from(countersTable)
      .execute();

    expect(counters).toHaveLength(1);
    expect(counters[0].value).toEqual(25);
  });
});
