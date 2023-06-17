import { Stepper, px, createStyles, Box, Text } from "@mantine/core";
import {
	IconDeviceMobileMessage,
	IconForms,
	IconUserSearch,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import CheckAlumni from "../component/SignUp/CheckAlumni";
import { TSignupData } from "../types/signup";
import { SignupContext } from "../context/signup";
import liff from "@line/liff";
import ProfileForm from "../component/SignUp/ProfileForm";
import OTP from "../component/SignUp/OTP";
import Result from "../component/SignUp/Result";
import { TResRequestOTP } from "../types";

function SignUp() {
	const { classes } = useStyles();
	const [signupData, setSignupData] = useState<TSignupData>({
		token_id: "",
		student_code: "",
		firstname: "",
		lastname: "",
		tel: "",
	});

	const [loading, setLoading] = useState<boolean>(false);
	const [inAlumni, setInAlumni] = useState<boolean>(false);
	const [otpData, setOTPData] = useState<TResRequestOTP & { pin: string }>({
		refno: "",
		token: "",
		pin: "",
	});

	const liffService = async () => {
		try {
			await liff.init({ liffId: import.meta.env.VITE_LIFF_ID });
			if (liff.isLoggedIn())
				setSignupData((prev) => ({
					...prev,
					token_id: liff.getIDToken() ?? "",
				}));
			else liff.login();
		} catch (e) {
			console.log(e);
		}
	};

	useEffect(() => {
		liffService();
		document.title = "QR Through | SignUp";
	}, []);

	const [active, setActive] = useState<number>(0);

	const nextStep = () =>
		setActive((current) => (current < 3 ? current + 1 : current));

	const prevStep = () =>
		setActive((current) => (current > 0 ? current - 1 : current));

	return (
		<SignupContext.Provider
			value={{
				signupData,
				setSignupData,
				nextStep,
				prevStep,
				loading,
				setLoading,
				inAlumni,
				setInAlumni,
				otpData,
				setOTPData,
			}}
		>
			<Box className={classes.bar}>
				<Text size={36} weight={500} color="white">
					สมัครสมาชิก
				</Text>
			</Box>
			<Box className={classes.container}>
				<Stepper
					mt="md"
					size="sm"
					color="#cd3a29"
					iconSize={px(32)}
					active={active}
					onStepClick={setActive}
					styles={{
						step: {
							flex: 1,
							flexDirection: "column",
							alignSelf: "flex-start",
							backgroundColor: "initial !important",
						},
						stepBody: {
							margin: 0,
						},
						stepDescription: {
							textAlign: "center",
						},
					}}
				>
					<Stepper.Step
						icon={<IconUserSearch size="1rem" />}
						description="ตรวจรหัสนักศึกษา"
						loading={loading}
						allowStepSelect={active > 0 && active <= 2}
					>
						<CheckAlumni />
					</Stepper.Step>
					<Stepper.Step
						icon={<IconForms size="1rem" />}
						description="กรอกข้อมูล"
						allowStepSelect={active > 1 && active <= 2}
					>
						<ProfileForm />
					</Stepper.Step>
					<Stepper.Step
						icon={<IconDeviceMobileMessage size="1rem" />}
						description="รับ OTP"
						allowStepSelect={false}
					>
						<OTP />
					</Stepper.Step>
					<Stepper.Completed>
						<Result />
					</Stepper.Completed>
				</Stepper>
			</Box>
		</SignupContext.Provider>
	);
}

const useStyles = createStyles(() => ({
	container: {
		height: "100vh",
		padding: "1rem",
	},
	bar: {
		padding: "1rem",
		backgroundColor: "#06C755",
	},
}));

export default SignUp;
