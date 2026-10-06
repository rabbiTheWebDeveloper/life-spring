import AuthManager from "@/services/AuthManager";
import ProfileUpdate from "./components/ProfileUpdate";

const page = async () => {
	const user: any = await AuthManager.getLoggedUser();
	console.log(user);

	return <ProfileUpdate user={user?.data} />;
};

export default page;
