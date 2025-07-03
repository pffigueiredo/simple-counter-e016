
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { countersTable } from '../db/schema';
import { getCounter } from '../handlers/get_counter';

describe('getCounter', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create and return a counter with value 0 when no counter exists', async () => {
    const result = await getCounter();

    // Basic field validation
    expect(result.id).toBeDefined();
    expect(result.value).toEqual(0);
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should save counter to database when creating new counter', async () => {
    const result = await getCounter();

    // Verify counter was saved to database
    const counters = await db.select()
      .from(countersTable)
      .execute();

    expect(counters).toHaveLength(1);
    expect(counters[0].id).toEqual(result.id);
    expect(counters[0].value).toEqual(0);
    expect(counters[0].updated_at).toBeInstanceOf(Date);
  });

  it('should return existing counter when one already exists', async () => {
    // Create a counter with a specific value
    await db.insert(countersTable)
      .values({
        value: 42
      })
      .execute();

    const result = await getCounter();

    // Should return the existing counter, not create a new one
    expect(result.value).toEqual(42);
    expect(result.id).toBeDefined();
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should not create duplicate counters', async () => {
    // Call getCounter twice
    const result1 = await getCounter();
    const result2 = await getCounter();

    // Should return the same counter
    expect(result1.id).toEqual(result2.id);
    expect(result1.value).toEqual(result2.value);

    // Verify only one counter exists in database
    const counters = await db.select()
      .from(countersTable)
      .execute();

    expect(counters).toHaveLength(1);
  });
});
