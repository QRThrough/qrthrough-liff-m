import { createStyles, getStylesRef } from "@mantine/core";
import theme from "../style/theme";

type Props = {
	children: JSX.Element;
};

function MobileLayout({ children }: Props) {
	const { classes } = useStyles();
	return <div className={classes.mobileView}>{children}</div>;
}

const useStyles = createStyles((theme) => ({
	mobileView: {
		position: "relative",
		display: "flex",
		flexDirection: "column",
		flexGrow: 1,
		width: "100%",
		minHeight: "100vh",
		maxWidth: "540px",
		margin: "0 auto",
		overflow: "hidden",
		backgroundColor: "#F8F8FF",
		outline: "1px solid grey",
		[`input`]: {
			backgroundColor: "#FFF",
			height: "50px",
			fontSize: "1rem",
			fontWeight: 500,
		},
	},
}));

export default MobileLayout;
