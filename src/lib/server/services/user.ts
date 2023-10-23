import type { Prisma } from '@prisma/client';
import { db } from '../db';

// Create a new user or return an existing user based on their IP address.
// Parameters:
// - data: The data for creating a new user.
export async function createUser({ data }: Prisma.UserCreateArgs) {
	try {
		// Check if a user with the same IP address already exists.
		const existingUser = await getUserByIPAddress(data.ipAddress);

		// If an existing user is found, return the existing user.
		if (existingUser) {
			console.log(
				`User with IP address ${data.ipAddress} already exists. Returning the existing user.`
			);
			return existingUser;
		}

		// If no existing user is found, create a new user.
		const newUser = await db.user.create({ data });
		return newUser;
	} catch (error) {
		console.error('Error creating user', error);
		throw new Error('Failed to create user');
	}
}

// Retrieve a user by their IP address.
// Parameters:
// - ipAddress: The IP address to search for.
export async function getUserByIPAddress(ipAddress: string) {
	try {
		// Find a user with the specified IP address.
		const user = await db.user.findUnique({
			where: { ipAddress }
		});

		// Return the found user, if any.
		return user;
	} catch (error) {
		console.error('Error fetching user by IP address', error);
		throw new Error('Failed to fetch user by IP address');
	}
}
