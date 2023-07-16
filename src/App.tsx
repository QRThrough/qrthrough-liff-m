import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import AppLayout from "./layout/AppLayout";
import MobileLayout from "./layout/MobileLayout";
import Router from "./router";
import { CustomFonts } from "./style/CustomFonts";
import theme from "./style/theme";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<MantineProvider theme={theme}>
				{/* <CustomFonts /> */}
				<Notifications />
				<AppLayout>
					<MobileLayout>
						<Router />
					</MobileLayout>
				</AppLayout>
			</MantineProvider>
		</QueryClientProvider>
	);
}

export default App;
