export async function register() {
  const isProductionBuild =
    process.env.NEXT_PHASE === "phase-production-build";

  if (
    process.env.NEXT_RUNTIME === "nodejs" &&
    !isProductionBuild &&
    process.env.RUN_MIGRATIONS === "true"
  ) {
    const { setupDatabase } = await import("./lib/db/startup");
    await setupDatabase();
  }
}
