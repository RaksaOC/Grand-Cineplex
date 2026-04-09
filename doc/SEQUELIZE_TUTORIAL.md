# Sequelize ORM Tutorial

A friendly guide to using Sequelize ORM with TypeScript. This tutorial will help you understand the basics and some advanced features of Sequelize.

---

## What is Sequelize?

Sequelize is a **promise-based Node.js ORM** (Object-Relational Mapping) that makes it easy to work with databases using JavaScript/TypeScript. Think of it as a translator between your code and your database!

### Why Sequelize?

- **Type Safety** - Works great with TypeScript
- **Easy to Learn** - Familiar object-oriented approach
- **Powerful** - Handles complex queries and relationships
- **Database Agnostic** - Works with PostgreSQL, MySQL, SQLite, and more

---

## Getting Started

### Installation

```bash
npm install sequelize pg pg-hstore
npm install -D @types/sequelize
```

### Basic Setup

```typescript
import { Sequelize } from "sequelize";

const sequelize = new Sequelize({
  database: "myapp",
  username: "postgres",
  password: "password",
  host: "localhost",
  dialect: "postgres",
  logging: false, // Set to console.log to see SQL queries
});

// Test the connection
await sequelize.authenticate();
console.log("Database connected!");
```

---

## Creating Your First Model

### Basic Model Structure

```typescript
import { Model, DataTypes, Sequelize } from "sequelize";

class User extends Model {
  declare id: number;
  declare name: string;
  declare email: string;
  declare age: number;
  declare createdAt: Date;
  declare updatedAt: Date;
}

export const initUser = (sequelize: Sequelize) => {
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      age: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "users",
      timestamps: true, // Adds createdAt and updatedAt
      underscored: true, // Uses snake_case for column names
    }
  );
};

export default User;
```

### What's Happening Here?

- **`extends Model`** - Makes this a Sequelize model
- **`declare`** - TypeScript declarations for type safety
- **`DataTypes`** - Defines column types (STRING, INTEGER, etc.)
- **`timestamps`** - Automatically adds `created_at` and `updated_at` columns
- **`underscored`** - Uses snake_case for database columns

---

## Basic Queries

### Finding Records

```typescript
// Find all users
const allUsers = await User.findAll();

// Find one user by ID
const user = await User.findByPk(1);

// Find one user by condition
const john = await User.findOne({
  where: { name: "John" },
});

// Find all users with conditions
const adults = await User.findAll({
  where: { age: { [Op.gte]: 18 } },
});
```

### Creating Records

```typescript
// Create a single user
const newUser = await User.create({
  name: "Alice",
  email: "alice@example.com",
  age: 25,
});

// Create multiple users
const users = await User.bulkCreate([
  { name: "Bob", email: "bob@example.com", age: 30 },
  { name: "Charlie", email: "charlie@example.com", age: 35 },
]);
```

### Updating Records

```typescript
// Update a single record
const user = await User.findByPk(1);
user.age = 26;
await user.save();

// Update multiple records
await User.update({ age: 25 }, { where: { age: { [Op.lt]: 25 } } });
```

### Deleting Records

```typescript
// Delete a single record
const user = await User.findByPk(1);
await user.destroy();

// Delete multiple records
await User.destroy({
  where: { age: { [Op.lt]: 18 } },
});
```

---

## Associations (Relationships)

### One-to-Many Relationship

```typescript
// User has many Posts
class Post extends Model {
  declare id: number;
  declare title: string;
  declare content: string;
  declare userId: number;
}

// In your setup file:
User.hasMany(Post, { foreignKey: "userId" });
Post.belongsTo(User, { foreignKey: "userId" });
```

### Using Associations

```typescript
// Create a post for a user
const user = await User.findByPk(1);
const post = await user.createPost({
  title: "My First Post",
  content: "Hello World!",
});

// Get all posts for a user
const userPosts = await user.getPosts();

// Get the user who wrote a post
const post = await Post.findByPk(1);
const author = await post.getUser();

// Include related data in queries
const userWithPosts = await User.findByPk(1, {
  include: [{ model: Post }],
});
```

### Many-to-Many Relationship

```typescript
// Users can have many Tags, Tags can have many Users
class Tag extends Model {
  declare id: number;
  declare name: string;
}

// Junction table will be created automatically
User.belongsToMany(Tag, { through: "UserTags" });
Tag.belongsToMany(User, { through: "UserTags" });

// Using many-to-many
const user = await User.findByPk(1);
const tag = await Tag.create({ name: "javascript" });

await user.addTag(tag);
const userTags = await user.getTags();
```

---

## Custom Methods

### Instance Methods (on individual records)

```typescript
class User extends Model {
  // ... other properties

  // Method that runs on a single user
  isAdult(): boolean {
    return this.age >= 18;
  }

  async celebrateBirthday() {
    this.age += 1;
    await this.save();
    return `Happy ${this.age}th birthday, ${this.name}!`;
  }
}

// Usage
const user = await User.findByPk(1);
if (user.isAdult()) {
  console.log("User is an adult");
}
const message = await user.celebrateBirthday();
```

### Static Methods (on the model class)

```typescript
class User extends Model {
  // ... other properties

  // Method that runs on the User class
  static async findAdults() {
    return this.findAll({
      where: { age: { [Op.gte]: 18 } },
    });
  }

  static async findByName(name: string) {
    return this.findOne({
      where: { name: { [Op.iLike]: `%${name}%` } },
    });
  }
}

// Usage
const adults = await User.findAdults();
const john = await User.findByName("john");
```

---

## Advanced Queries

### Complex Where Clauses

```typescript
import { Op } from "sequelize";

// Multiple conditions
const users = await User.findAll({
  where: {
    age: { [Op.gte]: 18 },
    email: { [Op.like]: "%@gmail.com" },
    name: { [Op.in]: ["John", "Jane", "Bob"] },
  },
});
```

### Ordering and Pagination

```typescript
const users = await User.findAll({
  order: [
    ["name", "ASC"],
    ["age", "DESC"],
  ],
  limit: 10,
  offset: 20, // Skip first 20 records
});
```

### Selecting Specific Columns

```typescript
const users = await User.findAll({
  attributes: ["id", "name", "email"], // Only get these columns
  where: { age: { [Op.gte]: 18 } },
});
```

### Aggregations

```typescript
// Count users
const userCount = await User.count();

// Average age
const avgAge = await User.findOne({
  attributes: [[sequelize.fn("AVG", sequelize.col("age")), "averageAge"]],
});

// Group by age
const ageGroups = await User.findAll({
  attributes: ["age", [sequelize.fn("COUNT", sequelize.col("id")), "count"]],
  group: ["age"],
});
```

---

## Best Practices

### 1. Use TypeScript Declarations

```typescript
class User extends Model {
  declare id: number;
  declare name: string;
  // Always declare your properties for type safety
}
```

### 2. Create Custom Methods for Business Logic

```typescript
// Instead of this in your controller:
const user = await User.findByPk(1);
if (user.age >= 18 && user.email.includes("@gmail.com")) {
  // do something
}

// Do this:
const user = await User.findByPk(1);
if (user.isEligibleForPromotion()) {
  // do something
}
```

### 3. Use Associations Instead of Manual Joins

```typescript
// Good - using associations
const userWithPosts = await User.findByPk(1, {
  include: [{ model: Post }],
});

// Avoid - manual joins
const userWithPosts = await sequelize.query(`
  SELECT u.*, p.* FROM users u 
  LEFT JOIN posts p ON u.id = p.user_id 
  WHERE u.id = 1
`);
```

### 4. Handle Errors Gracefully

```typescript
try {
  const user = await User.create({
    name: "John",
    email: "john@example.com",
  });
} catch (error) {
  if (error.name === "SequelizeUniqueConstraintError") {
    console.log("User with this email already exists!");
  }
}
```

---

## You're Ready!

You now know the basics of Sequelize! Here's what you can do:

- Create models and define relationships
- Perform basic CRUD operations
- Use associations to work with related data
- Create custom methods for business logic
- Write complex queries with conditions and aggregations

### Next Steps:

1. **Practice** - Try creating your own models and relationships
2. **Explore** - Check out the [Sequelize documentation](https://sequelize.org/)
3. **Build** - Start using Sequelize in your projects!

---

**Happy coding!**
