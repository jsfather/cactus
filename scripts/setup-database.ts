import "dotenv/config";
import { setupDatabase } from "../lib/db/startup";

async function main() {
  await setupDatabase();
  console.log("Database migrations, admin bootstrap, and starter content completed.");
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
