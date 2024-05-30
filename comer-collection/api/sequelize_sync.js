import "dotenv/config.js";
import db from "./sequelize.js";

await db.sequelize.sync({ alter: true });
process.exit();
