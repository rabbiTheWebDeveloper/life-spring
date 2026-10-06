export type Option = { value: string; label: string };

export type PaymentMethodOption = Option & { isActive: boolean };

// Every dropdown whose entries are DB/enum values. The labels are the ones the
// API sends -- the admin never re-maps them.
export type Options = {
	appointmentStatus: Option[];
	paymentStatus: Option[];
	appointmentType: Option[];
	criteria: Option[];
	createdByType: Option[];
	paymentMethod: PaymentMethodOption[];
};

// What every consumer starts with, and what getOptions() falls back to when the
// API is unreachable: empty lists, never a hard-coded copy of the real ones.
export const emptyOptions: Options = {
	appointmentStatus: [],
	paymentStatus: [],
	appointmentType: [],
	criteria: [],
	createdByType: [],
	paymentMethod: [],
};
