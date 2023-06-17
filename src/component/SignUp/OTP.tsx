import { Button, Flex, Group, Text, createStyles, rem } from "@mantine/core";
import OtpInput from "react-otp-input";
import { useSignupContext } from "../../context/signup";
import { IconDeviceMobileMessage, IconRefresh } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { useMutation } from "react-query";
import { requestOTPService, verifyOTPService } from "../../service/otp";
import { useState, useEffect } from "react";

function OTP() {
	const { signupData, nextStep, otpData, setOTPData, setLoading, loading } =
		useSignupContext();
	const { classes } = useStyles();

	const [minutes, setMinutes] = useState(1);
	const [seconds, setSeconds] = useState(30);

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

	const { mutateAsync } = useMutation(verifyOTPService, {
		onSuccess({ data }) {
			if (data.success) nextStep();
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

	const { mutateAsync: mutateRefresh } = useMutation(requestOTPService, {
		onSuccess({ data }) {
			const { refno, token } = data.result;
			setOTPData((prev) => ({
				...prev,
				refno: refno,
				token: token,
			}));
			setMinutes(1);
			setSeconds(30);
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
	});

	const handleRefreshOTP = async () => {
		if (seconds > 0 || minutes > 0) return;
		setLoading(true);
		await mutateRefresh({ tel: signupData.tel });
	};

	return (
		<Group w="100%" align="center">
			<Flex w="100%" justify="center" mb="lg">
				<IconDeviceMobileMessage size="8rem" stroke="1.5px" />
			</Flex>
			<Text w="100%" size={16} weight={500} align="center">
				กรุณากรอกเลข OTP ที่ส่งไปยัง
				<br />
				หมายเลข {signupData.tel} (Ref: {otpData.refno})
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
			<Flex w="100%" align="center" justify="center">
				<IconRefresh
					size="1.2rem"
					onClick={handleRefreshOTP}
					color={seconds > 0 || minutes > 0 ? "gray" : "#e2590b"}
					cursor={seconds > 0 || minutes > 0 ? "normal" : "pointer"}
				/>

				<Text size={12} weight={300} align="center" ml="xs">
					{seconds > 0 || minutes > 0 ? (
						<p>
							สามารถส่ง OTPอีกครั้งใน {minutes < 10 ? `0${minutes}` : minutes}:
							{seconds < 10 ? `0${seconds}` : seconds} นาที
						</p>
					) : (
						<p>&lt;- กดปุ่มนี้หากยังไม่ได้รับ OTP</p>
					)}
				</Text>
			</Flex>
			<Group w="100%" position="right" mt="xs" px="md">
				<Button
					w="100%"
					size="md"
					onClick={handleSubmit}
					className={classes.btn}
					loading={loading}
				>
					ยืนยัน OTP
				</Button>
			</Group>
		</Group>
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
			backgroundColor: "#7B2319",
		}),
	},
}));

export default OTP;
