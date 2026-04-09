# Drizzle ORM Tutorial

A simple guide to using Drizzle ORM in our cinema management system.

## Basic Setup

1. **Database Connection**

```typescript
// src/db/index.ts
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });
```

2. **Using the Database**

```typescript
import { db } from "../db";
import { movies, customers } from "../db/schema";
import { eq, and, or } from "drizzle-orm";

// Query examples
const allMovies = await db.select().from(movies);
const movieById = await db.select().from(movies).where(eq(movies.id, 1));
const activeCustomers = await db
  .select()
  .from(customers)
  .where(eq(customers.isActive, true));
```

## Common Operations

### 1. Select Data

```typescript
// Get all records
const allMovies = await db.select().from(movies);

// Get with conditions
const actionMovies = await db
  .select()
  .from(movies)
  .where(eq(movies.genre, "Action"));

// Get with relations
const movieWithScreenings = await db
  .select()
  .from(movies)
  .leftJoin(screenings, eq(movies.id, screenings.movieId));
```

### 2. Insert Data

```typescript
// Insert single record
const newMovie = await db
  .insert(movies)
  .values({
    title: "New Movie",
    duration: 120,
    genre: "Action",
  })
  .returning();

// Insert multiple records
const newMovies = await db
  .insert(movies)
  .values([
    { title: "Movie 1", duration: 120 },
    { title: "Movie 2", duration: 90 },
  ])
  .returning();
```

### 3. Update Data

```typescript
// Update single record
const updatedMovie = await db
  .update(movies)
  .set({ title: "Updated Title" })
  .where(eq(movies.id, 1))
  .returning();

// Update multiple records
const updatedMovies = await db
  .update(movies)
  .set({ price: 15.99 })
  .where(eq(movies.genre, "Action"))
  .returning();
```

### 4. Delete Data

```typescript
// Delete single record
const deletedMovie = await db
  .delete(movies)
  .where(eq(movies.id, 1))
  .returning();

// Delete multiple records
const deletedMovies = await db
  .delete(movies)
  .where(eq(movies.genre, "Horror"))
  .returning();
```

## Transactions

```typescript
// Using transactions
const result = await db.transaction(async (tx) => {
  const newBooking = await tx
    .insert(bookings)
    .values({ customerId: 1, screeningId: 1 })
    .returning();

  const newTicket = await tx
    .insert(tickets)
    .values({ bookingId: newBooking[0].id, seatId: 1 })
    .returning();

  return { booking: newBooking[0], ticket: newTicket[0] };
});
```

## Best Practices

1. **Always use TypeScript**

   - Drizzle provides excellent type safety
   - Use the generated types for your queries

2. **Use Prepared Statements**

   - Drizzle automatically handles SQL injection protection
   - Always use the query builder instead of raw SQL

3. **Handle Relations Properly**

   - Use joins when you need related data
   - Consider using separate queries for complex relations

4. **Error Handling**

```typescript
try {
  const result = await db.select().from(movies);
} catch (error) {
  console.error("Database error:", error);
  throw new Error("Failed to fetch movies");
}
```

## Useful Resources

- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
