"use client";
import { createContext, useContext, useEffect, useState } from "react";
import {rolePermissions} from "@/app/components/rolepermission/rolepermissionchecker";


const AuthContext = createContext<any>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState<any>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchUser = async () => {
		   try{
				 const response = await rolePermissions();
				 console.log("user response", response);
				 if(response?.success){
					 setUser(response?.data);
				 }
				 setLoading(false);
			 }
			catch (error){
				 console.log(error);
			}finally {
				 setLoading(false);
			 }
		};

		fetchUser();
	}, []);

	return (
		<AuthContext.Provider value={{ user, loading }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	return useContext(AuthContext);
};
