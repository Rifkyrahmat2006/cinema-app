require("dotenv").config();

const app = require("./src/app");
const db = require("./src/config/database");

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {

        const connection = await db.getConnection();

        console.log("✅ MySQL Connected");

        connection.release();

        app.listen(PORT, () => {
            console.log(`🚀 Server running at http://localhost:${PORT}`);
        });

    } catch (err) {

        console.error("❌ Database Connection Failed");
        console.error(err.message);

        process.exit(1);

    }
}

startServer();