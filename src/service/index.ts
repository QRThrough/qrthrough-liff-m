import axios from "axios";

const fetchPrivate = (() => {
	// 	const getAuthToken = async () => {
	//     try {
	//         return "Bearer " + await auth.currentUser?.getIdToken();
	//     } catch (err) {
	//         console.log("getAuthToken", err);
	//     };
	// };

	const instance = axios.create({
		baseURL: import.meta.env.VITE_API_URL,
	});

	// instance.interceptors.request.use(async (config) => {
	//     config.headers.Authorization = await getAuthToken();
	//     return config;
	// });

	return instance;
})();

export const fetchPublic = (() => {
	const instance = axios.create({
		baseURL: import.meta.env.VITE_API_URL,
	});

	return instance;
})();
