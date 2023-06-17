import {
	Route,
	Navigate,
	createBrowserRouter,
	createRoutesFromElements,
	RouterProvider,
	Outlet,
} from "react-router-dom";
import SignUp from "../page/SignUp";

interface ICustomRoute {
	user?: any;
	redirectPath: string;
	children: JSX.Element;
}

const ProtectRoute = ({ user, redirectPath, children }: ICustomRoute) => {
	if (user) {
		return children;
	}
	return <Navigate to={redirectPath} replace />;
};

const AuthRoute = ({ user, redirectPath, children }: ICustomRoute) => {
	if (!user) {
		return children;
	}
	return <Navigate to={redirectPath} replace />;
};

const Router = () => {
	const router = createBrowserRouter(
		createRoutesFromElements(
			<Route>
				<Route
					index
					path="/"
					element={
						// <AuthRoute user={user} redirectPath="/dashboard">
						// 	<SignInPage />
						// </AuthRoute>
						<SignUp />
					}
				/>
			</Route>
		)
	);

	return <RouterProvider router={router} />;
};

export default Router;
