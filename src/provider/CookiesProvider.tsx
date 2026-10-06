"use client";

import { CookiesProvider } from "next-client-cookies";

const ClientCookiesProvider: typeof CookiesProvider = (props) => <CookiesProvider {...props} />;

export default ClientCookiesProvider;
