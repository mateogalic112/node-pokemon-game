import pool from "config/database";
import bcrypt from "bcrypt";

const seedData = [
  {
    email: "mateo@gmail.com",
    password: "123456",
    name: "Mateo"
  }
];

async function createTables() {
  try {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS trainers (
          id SERIAL PRIMARY KEY,
          email VARCHAR(320) UNIQUE NOT NULL,
          password TEXT NOT NULL,
          name VARCHAR(100),
          pokeballs INTEGER DEFAULT 10
        );
      `);

    await pool.query(`
        CREATE TABLE IF NOT EXISTS pokemons (
          id SERIAL PRIMARY KEY,
          pokemon_id INTEGER UNIQUE NOT NULL,
          hp INTEGER DEFAULT 100,
          trainer_id INTEGER REFERENCES trainers(id) ON DELETE SET NULL
        );
      `);

    console.log("Tables created successfully");
  } catch (error) {
    console.error("Error creating tables:", error);
  }
}

async function seedDatabase() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    for (const { email, password, name } of seedData) {
      const hashedPassword = await bcrypt.hash(password, 10);
      await client.query(`INSERT INTO trainers (email, password, name) VALUES ($1, $2, $3)`, [
        email,
        hashedPassword,
        name
      ]);
    }
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

// Run the table creation and seeding process
export const initializeDatabase = async () => {
  try {
    await createTables();
    // await seedDatabase();
  } catch (error) {
    console.error("Database initialization failed:", error);
  }
};
