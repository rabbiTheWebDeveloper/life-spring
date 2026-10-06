/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		domains: [
			"cdn.lifespringint.com",
			"cdn-staging.lifespringint.com",
			"shukhee.s3.ap-southeast-1.amazonaws.com",
			"shukhee-public-bucket-dev.s3.ap-southeast-1.amazonaws.com",
			"example.com",
		],
		remotePatterns: [
			{
				hostname: "admin.shukhee.dev-polygontech.xyz",
			},
		],
	},

	output: "standalone",
};

export default nextConfig;
