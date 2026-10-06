export enum UserType {
	admin = "Admin",
	agent = "Agent",
}

export interface Tokens {
	accessToken: string;
	refreshToken: string;
}

export enum AfterschoolStatus {
	active = "ACTIVE",
	inactive = "INACTIVE",
}

export interface UserCommonData {
	id: number;
	firstName: string;
	lastName: string;
	userName: string;
	officeId: string;
	mobile: string;
	role: string;
	email: string;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
	profilePic: string;
}

export interface Admin extends UserCommonData {}

export interface Agent extends UserCommonData {}

export interface LoggedInUser<T> extends Tokens {
	user: T;
}

export interface TokensWithId extends Tokens {
	id: number;
}
