import { DoctorPaymentType } from "./Types";

export const PaymentOptions = {
	isBank: (option: string) => option === DoctorPaymentType.BANK,
	isMFS: (option: string) => option === DoctorPaymentType.MFS,
	isCash: (option: string) => option === DoctorPaymentType.CASH,
	isCard: (option: string) => option === DoctorPaymentType.CARD,
};
