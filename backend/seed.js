require("dotenv").config();
const mysql = require("mysql2/promise");
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");

async function seed() {
  // Buat koneksi tanpa database dulu untuk create DB
  const initPool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    waitForConnections: true,
    connectionLimit: 2,
    queueLimit: 0,
  });

  try {
    // Jalankan schema.sql
    const schema = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8");
    const statements = schema
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    for (const stmt of statements) {
      await initPool.query(stmt + ";");
    }
    console.log("✓ Tables created");
  } catch (err) {
    console.log("  (tables might already exist)");
  } finally {
    await initPool.end();
  }

  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 2,
    queueLimit: 0,
  });

  try {
    // Hapus data lama
    await pool.query("DELETE FROM orders");
    await pool.query("DELETE FROM showtimes");
    await pool.query("DELETE FROM movies");
    await pool.query("DELETE FROM users");

    // Reset auto increment
    await pool.query("ALTER TABLE users AUTO_INCREMENT = 1");
    await pool.query("ALTER TABLE movies AUTO_INCREMENT = 1");
    await pool.query("ALTER TABLE showtimes AUTO_INCREMENT = 1");
    await pool.query("ALTER TABLE orders AUTO_INCREMENT = 1");

    // Seed users
    const password = await bcrypt.hash("password123", 10);
    const [userResult] = await pool.query(
      "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)",
      ["ahmad", "ahmad@gmail.com", password, "admin"],
    );
    const userId = userResult.insertId;

    await pool.query(
      "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)",
      ["siti", "siti@gmail.com", password, "user"],
    );

    console.log("✓ Users seeded (admin: ahmad, user: siti)");

    // Seed movies
    const movies = [
      {
        movie_name: "Avengers: Endgame",
        genre: "Action",
        poster:
          "https://m.media-amazon.com/images/M/MV5BMTc5MDE2ODcwNV5BMl5BanBnXkFtZTgwMzI2NzQ2NzM@._V1_SX300.jpg",
        rating: 8.4,
        duration: "3h 1m",
        sinopsis:
          "After the devastating events of Infinity War, the Avengers assemble once more to reverse Thanos' actions and restore balance to the universe.",
        price: 38500,
      },
      {
        movie_name: "Spider-Man: No Way Home",
        genre: "Action",
        poster:
          "https://m.media-amazon.com/images/M/MV5BZWMyYzFjYTYtNTRjYi00OGExLWE2YzgtOGRmYjAxZTU3NDBiXkEyXkFqcGdeQXVyMzQ0MzA0NTM@._V1_SX300.jpg",
        rating: 8.2,
        duration: "2h 28m",
        sinopsis:
          "With Spider-Man's identity now revealed, Peter asks Doctor Strange for help. When a spell goes wrong, dangerous foes from other worlds start to appear.",
        price: 38500,
      },
      {
        movie_name: "The Batman",
        genre: "Action",
        poster:
          "https://m.media-amazon.com/images/M/MV5BMDdmMTBiNTYtMDIzNi00NGVlLWIzMDYtZTk3MTQ3NGQxZGEwXkEyXkFqcGdeQXVyMzMwOTU5MDk@._V1_SX300.jpg",
        rating: 7.8,
        duration: "2h 56m",
        sinopsis:
          "When a sadistic serial killer begins murdering key political figures in Gotham, Batman is forced to investigate the city's hidden corruption.",
        price: 38500,
      },
    ];

    for (const m of movies) {
      await pool.query(
        "INSERT INTO movies (movie_name, genre, poster, rating, duration, sinopsis, price) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [
          m.movie_name,
          m.genre,
          m.poster,
          m.rating,
          m.duration,
          m.sinopsis,
          m.price,
        ],
      );
    }
    console.log("✓ Movies seeded");

    // Seed showtimes (jam tayang standar untuk setiap film)
    const [movieRows] = await pool.query(
      "SELECT id FROM movies ORDER BY id ASC",
    );
    const showTimes = [
      "10:00:00",
      "13:00:00",
      "16:00:00",
      "19:00:00",
      "22:00:00",
    ];
    for (const movie of movieRows) {
      for (const time of showTimes) {
        await pool.query(
          "INSERT INTO showtimes (movie_id, show_time) VALUES (?, ?)",
          [movie.id, time],
        );
      }
    }
    console.log("✓ Showtimes seeded");

    // Seed orders (PRD: harga = 35000 + 10% pajak = 38500 per tiket)
    const orders = [
      {
        user_id: userId,
        movie_name: "Avengers: Endgame",
        watch_at: "2026-07-10 19:00:00",
        seat: "A5",
        ticket: 2,
        price: 77000,
        payment_proof: null,
      },
      {
        user_id: userId,
        movie_name: "Spider-Man: No Way Home",
        watch_at: "2026-07-11 14:00:00",
        seat: "B3",
        ticket: 1,
        price: 38500,
        payment_proof: null,
      },
      {
        user_id: userId,
        movie_name: "The Batman",
        watch_at: "2026-07-12 21:00:00",
        seat: "C7",
        ticket: 3,
        price: 115500,
        payment_proof: null,
      },
    ];

    for (const o of orders) {
      await pool.query(
        "INSERT INTO orders (user_id, movie_name, watch_at, seat, ticket, price, payment_proof) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [
          o.user_id,
          o.movie_name,
          o.watch_at,
          o.seat,
          o.ticket,
          o.price,
          o.payment_proof,
        ],
      );
    }

    console.log("✓ Orders seeded");
    console.log("\nAkun test:");
    console.log(
      "  [Admin] username: ahmad | email: ahmad@gmail.com | password: password123",
    );
    console.log(
      "  [User]  username: siti  | email: siti@gmail.com  | password: password123\n",
    );

    console.log("Sample orders for user 'ahmad' created.");
  } catch (err) {
    console.error("Seed failed:", err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seed();
