import { createStyles, getStylesRef } from "@mantine/core";
import React from "react";

type Props = {
	children: JSX.Element;
};

function AppLayout({ children }: Props) {
	const { classes } = useStyles();
	return <div className={classes.appLayout}>{children}</div>;
}

const useStyles = createStyles(() => ({
	appLayout: {
		display: "flex",
		position: "relative",
		margin: "0 auto",
		width: "100%",
		minHeight: "100vh",
	},
}));

export default AppLayout;
