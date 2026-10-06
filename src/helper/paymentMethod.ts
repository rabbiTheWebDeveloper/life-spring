// Cash-type methods are seeded as "Cash in Hand- Revenue Collection - <branch> #";
// the leading word is the only stable signal.
export function isCashMethod(name: string): boolean {
	return /^cash/i.test(name.trim());
}
