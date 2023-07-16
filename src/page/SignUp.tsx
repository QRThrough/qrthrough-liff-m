import {
	Stepper,
	px,
	createStyles,
	Box,
	Text,
	rem,
	Image,
	Flex,
	Group,
} from "@mantine/core";
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
import OneTimePassword from "../component/SignUp/OneTimePassword";
import Result from "../component/SignUp/Result";
import { TResRequestOTP } from "../types";

const initialSignupData = {
	token_id: "",
	student_code: "",
	firstname: "",
	lastname: "",
	tel: "",
};

export const initialOTPData = {
	refno: "",
	token: "",
	pin: "",
};

function SignUp() {
	const { classes } = useStyles();
	const [signupData, setSignupData] = useState<TSignupData>(initialSignupData);

	const [loading, setLoading] = useState<boolean>(false);
	const [inAlumni, setInAlumni] = useState<boolean>(false);
	const [otpData, setOTPData] = useState<TResRequestOTP & { pin: string }>(
		initialOTPData
	);

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
		document.title = "QR Through | สมัครสมาชิก";
	}, []);

	const [active, setActive] = useState<number>(0);

	const nextStep = () => {
		setActive((current) => (current < 3 ? current + 1 : current));
	};

	const prevStep = () => {
		switch (active) {
			case 1:
				setSignupData(initialSignupData);
				break;
			case 2:
				setOTPData(initialOTPData);
			default:
				break;
		}
		setActive((current) => (current > 0 ? current - 1 : current));
	};

	const initialStep = () => {
		setSignupData(initialSignupData);
		setOTPData(initialOTPData);
		setActive((current) => (current === 3 ? 0 : current));
	};

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
				initialStep,
			}}
		>
			<Flex align="center" px="lg" py="xs" bg="white" justify="space-between">
				<Box w="4rem" style={{ flex: 1 }}>
					<Image src="/qr-through-icon.svg" />
				</Box>
				<Text
					size="32px"
					weight="500"
					color="#59151E"
					lh="40px"
					align="center"
					style={{ flex: 5 }}
				>
					สมัครสมาชิก
				</Text>
				<Box style={{ flex: 1 }}></Box>
			</Flex>
			<Box className={classes.container}>
				<Stepper
					size="sm"
					color="#E1897F"
					iconSize={32}
					active={active}
					styles={{
						steps: {
							padding: "1rem",
							backgroundImage: "linear-gradient(93deg,#93515A,#59151E)",
						},
						step: {
							flex: 1,
							flexDirection: "column",
							alignSelf: "flex-start",
						},
						stepBody: {
							margin: 0,
						},
						stepIcon: {
							backgroundColor: "#FFF",
						},
						stepDescription: {
							color: "#FFF",
							textAlign: "center",
						},
					}}
				>
					<Stepper.Step
						icon={<IconUserSearch size="1rem" />}
						description="ตรวจรหัสนักศึกษา"
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
						<OneTimePassword />
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
	container: {},
}));

export default SignUp;
