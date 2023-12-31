import type { Prisma } from "@prisma/client";
import { db } from "../db";

// Create a new contestant.
// Parameters:
// - data: The data for creating a new contestant.
export async function createContestant({ data }: Prisma.ContestantCreateArgs) {
  try {
    // Create a new contestant using the provided data.
    const newContestant = await db.contestant.create({
      data,
    });

    // Return the newly created contestant.
    return newContestant;
  } catch (error) {
    console.error("Error creating contestant", error);
    throw new Error("Failed to create contestant");
  }
}

// Retrieve contestants based on specified criteria.
// Parameters:
// - orderBy: Optional sorting criteria.
// - where: Optional filtering criteria.
// - take: Optional number of records to retrieve.
// - skip: Optional number of records to skip.
export async function getContestants({
  orderBy = {},
  where = {},
  take = undefined,
  skip = undefined,
}: Prisma.ContestantFindManyArgs = {}) {
  try {
    // Fetch contestants with the provided parameters.
    const contestants = await db.contestant.findMany({
      orderBy,
      where,
      take,
      skip,
    });

    // Return the retrieved contestants.
    return contestants;
  } catch (error) {
    console.error("Error fetching contestants", error);
    throw new Error("Failed to fetch contestants");
  }
}

// Toggle a contestant's 'enabled' field.
// Parameters:
// - contestantId: The ID of the contestant to toggle.
export async function toggleEnabled(contestantId: string) {
  try {
    // Find the contestant by ID in the database.
    const existingContestant = await db.contestant.findUnique({
      where: { id: contestantId },
    });

    if (!existingContestant) {
      throw new Error("Contestant not found");
    }

    // Toggle the 'enabled' field.
    const updatedContestant = await db.contestant.update({
      where: { id: contestantId },
      data: {
        enabled: !existingContestant.enabled,
      },
    });

    // Return the updated contestant.
    return updatedContestant;
  } catch (error) {
    console.error("Error toggling contestant enabled status", error);
    throw new Error("Failed to toggle contestant enabled status");
  }
}

// Toggle the 'enabled' field on all contestants.
export async function toggleAllEnabled() {
  try {
    // Find all contestants in the database.
    const allContestants = await db.contestant.findMany();

    if (!allContestants || allContestants.length === 0) {
      throw new Error("No contestants found");
    }

    // Get the IDs of all contestants to be updated.
    const contestantIds = allContestants.map((contestant) => contestant.id);

    // Determine the new 'enabled' value (toggled).
    const newEnabledValue = !allContestants[0].enabled; // Assuming all contestants have the same initial state

    // Perform a bulk update to toggle the 'enabled' field for all contestants.
    const updatedContestants = await db.contestant.updateMany({
      where: {
        id: {
          in: contestantIds,
        },
      },
      data: {
        enabled: newEnabledValue,
      },
    });

    // Return the updated contestants.
    return updatedContestants;
  } catch (error) {
    console.error("Error toggling enabled status for all contestants", error);
    throw new Error("Failed to toggle enabled status for all contestants");
  }
}
