export interface SidebarMenu {
	name: string;
	link: string;
	logo: string;
	isOnlyForAdmin?: boolean;
	children?: {
		name: string;
		link: string;
		logo?: string;
		isOnlyForAdmin?: boolean;
		counter?: number;
	}[];
	counter?: number;
}
