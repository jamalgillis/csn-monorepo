"use client";

import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useEffect } from "react";

export function DatabaseSeeder() {
  const seedDatabase = useMutation(api.seed.seedDatabase);

  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        await seedDatabase({});
      } catch (error) {
        console.error("Database seeding error:", error);
      }
    };

    initializeDatabase();
  }, [seedDatabase]);

  return null;
}