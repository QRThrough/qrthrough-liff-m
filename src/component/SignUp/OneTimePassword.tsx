import {
	Box,
	Button,
	Card,
	Flex,
	Text,
	createStyles,
	rem,
} from "@mantine/core";
import OtpInput from "react-otp-input";
import { useSignupContext } from "../../context/signup";
import { IconRefresh } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { useMutation } from "react-query";
import { requestOTPService, verifyOTPService } from "../../service/otp";
import { useState, useEffect } from "react";
import { initialOTPData } from "../../page/SignUp";

function OneTimePassword() {
	const {
		signupData,
		nextStep,
		otpData,
		setOTPData,
		setLoading,
		loading,
		prevStep,
	} = useSignupContext();
	const { classes } = useStyles();

	const [minutes, setMinutes] = useState(5);
	const [seconds, setSeconds] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			if (seconds > 0) {
				setSeconds(seconds - 1);
			}

			if (seconds === 0) {
				if (minutes === 0) {
					clearInterval(interval);
				} else {
					setSeconds(59);
					setMinutes(minutes - 1);
				}
			}
		}, 1000);

		return () => {
			clearInterval(interval);
		};
	}, [seconds]);

	const { mutateAsync, reset } = useMutation(verifyOTPService, {
		onSuccess({ data }) {
			console.log(data);

			if (data.result === "success") nextStep();
		},
		onError(error: any) {
			if (error.response) {
				notifications.show({
					title: "แจ้งเตือน",
					message: error.response.data.message,
					color: "red",
				});
			} else {
				notifications.show({
					title: "แจ้งเตือน",
					message: "เกิดข้อผิดพลาดระหว่างการตรวจสอบ OTP",
					color: "red",
				});
			}

			setOTPData((prev) => ({ ...prev, pin: "" }));
		},
		onSettled() {
			setLoading(false);
		},
	});

	const handleSubmit = async () => {
		setLoading(true);
		if (otpData.pin.length === 4)
			await mutateAsync({ token: otpData.token, pin: otpData.pin });
		else {
			notifications.show({
				title: "แจ้งเตือน",
				message: "โปรดกรอกรหัส OTP ให้ครบ 4 หลัก",
				color: "yellow",
			});
			setLoading(false);
		}
	};

	const { mutateAsync: mutateRefresh, reset: resetRefresh } = useMutation(
		requestOTPService,
		{
			onSuccess({ data }) {
				const { refno, token } = data.result;
				setOTPData((prev) => ({
					...prev,
					refno: refno,
					token: token,
				}));
				setMinutes(5);
				setSeconds(0);
			},
			onError() {
				notifications.show({
					title: "แจ้งเตือน",
					message: "เกิดข้อผิดพลาดระหว่างการขอ OTP",
					color: "red",
				});
			},
			onSettled() {
				setLoading(false);
			},
		}
	);

	const handleRefreshOTP = async () => {
		if (seconds > 0 || minutes > 0) return;
		setLoading(true);
		setOTPData(initialOTPData);
		await mutateRefresh({ tel: signupData.tel });
	};

	return (
		<Box w="100%" px="sm">
			<Card
				bg="white"
				px="sm"
				pt="sm"
				pb="2rem"
				shadow="sm"
				radius="md"
				withBorder
			>
				<Box my="lg" pb="1rem" style={{ borderBottom: "1px solid #D6D6D7" }}>
					<Text size="20px" weight="500">
						กรุณากรอกรหัส OTP เพื่อยืนยันเบอร์โทรศัพท์
					</Text>
				</Box>
				<Flex justify="space-between" py=".5rem">
					<Text size="1.1rem" weight="400" color="#999B9D">
						รหัสนักศึกษา
					</Text>
					<Text size="18px" weight="500">
						{signupData.student_code}
					</Text>
				</Flex>
				<Flex justify="space-between" py=".5rem">
					<Text size="1.1rem" weight="400" color="#999B9D">
						ชื่อ
					</Text>
					<Text size="18px" weight="500">
						{signupData.firstname}
					</Text>
				</Flex>
				<Flex justify="space-between" py=".5rem">
					<Text size="1.1rem" weight="400" color="#999B9D">
						นามสกุล
					</Text>
					<Text size="18px" weight="500">
						{signupData.lastname}
					</Text>
				</Flex>
				<Flex justify="space-between" py=".5rem">
					<Text size="1.1rem" weight="400" color="#999B9D">
						เบอร์โทรศัพท์
					</Text>
					<Text size="18px" weight="500">
						{signupData.tel}
					</Text>
				</Flex>
				<Text w="100%" size={16} px="2rem" my="1rem" align="center">
					กรุณกรอก OTP ที่คุณได้รับทาง SMS
				</Text>
				<OtpInput
					value={otpData.pin}
					onChange={(v) => setOTPData((prev) => ({ ...prev, pin: v }))}
					numInputs={4}
					inputType="number"
					renderSeparator={<span>-</span>}
					containerStyle={classes.containerInput}
					renderInput={(props) => (
						<input {...props} className={classes.eachInput} />
					)}
				/>
				<Text w="100%" size={16} px="2rem" mt="1rem" align="center">
					(ref: {otpData.refno})
				</Text>
				<Flex w="100%" align="center" justify="center">
					<IconRefresh
						size="1.2rem"
						onClick={handleRefreshOTP}
						color={seconds > 0 || minutes > 0 ? "gray" : "#e2590b"}
						cursor={seconds > 0 || minutes > 0 ? "normal" : "pointer"}
						style={
							seconds > 0 || minutes > 0
								? {}
								: {
										animationName: "spin",
										animationDuration: "5000ms",
										animationIterationCount: "infinite",
										animationTimingFunction: "linear",
								  }
						}
					/>

					<Text size={12} weight={300} align="center" ml="xs">
						{seconds > 0 || minutes > 0 ? (
							<span>
								สามารถส่ง OTP อีกครั้งใน{" "}
								{minutes < 10 ? `0${minutes}` : minutes}:
								{seconds < 10 ? `0${seconds}` : seconds} นาที
							</span>
						) : (
							<span>กดปุ่มนี้หากยังไม่ได้รับ OTP หรือ OTP หมดอายุ</span>
						)}
					</Text>
				</Flex>
			</Card>
			<Flex justify="space-between" mt="xl">
				<Button
					px="3rem"
					size="md"
					className={classes.btnOutline}
					onClick={() => {
						reset();
						resetRefresh();
						setLoading(false);
						prevStep();
					}}
				>
					กลับ
				</Button>
				<Button
					px="3rem"
					size="md"
					loading={loading}
					className={classes.btn}
					onClick={handleSubmit}
				>
					ยืนยัน
				</Button>
			</Flex>
		</Box>
	);
}

const useStyles = createStyles((theme) => ({
	eachInput: {
		border: "1px solid black",
		borderRadius: theme.radius.xs,
		width: "50px !important",
		height: "50px",
	},
	containerInput: {
		width: "100%",
		justifyContent: "center",
		fontSize: rem(24),
		fontWeight: 300,
	},
	btn: {
		backgroundColor: theme.colors["brand-primary"],
		...theme.fn.hover({
			backgroundColor: "#59151E",
		}),
	},
	btnOutline: {
		backgroundColor: "unset",
		color: theme.colors["brand-primary"],
		outline: `1px solid ${theme.colors["brand-primary"]}`,
		...theme.fn.hover({
			backgroundColor: "#59151E",
			color: theme.white,
		}),
	},
}));

export default OneTimePassword;
