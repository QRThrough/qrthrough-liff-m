import {
	Route,
	createBrowserRouter,
	createRoutesFromElements,
	RouterProvider,
	Navigate,
} from "react-router-dom";
import SignUp from "../page/SignUp";

const Router = () => {
	const router = createBrowserRouter(
		createRoutesFromElements(
			<Route>
				<Route index path="/" element={<SignUp />} />
				<Route path="*" element={<Navigate to={"/"} replace={true} />} />
			</Route>
		)
	);

	return <RouterProvider router={router} />;
};

export default Router;
