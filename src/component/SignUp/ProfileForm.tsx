import {
	Box,
	TextInput,
	Button,
	createStyles,
	Card,
	Text,
	Flex,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useSignupContext } from "../../context/signup";
import { notifications } from "@mantine/notifications";
import { useMutation } from "react-query";
import { requestOTPService } from "../../service/otp";
import { AxiosError } from "axios";

type valuesForm = {
	student_code: string;
	firstname: string;
	lastname: string;
	tel: string;
};

function ProfileForm() {
	const { classes } = useStyles();
	const {
		setSignupData,
		loading,
		nextStep,
		signupData,
		inAlumni,
		prevStep,
		setLoading,
		setOTPData,
	} = useSignupContext();
	const form = useForm({
		initialValues: {
			student_code: signupData.student_code,
			firstname: signupData.firstname,
			lastname: signupData.lastname,
			tel: signupData.tel,
		},

		validate: {
			firstname: (value) =>
				/^.{1,256}$/.test(value) ? null : "กรุณากรอกชื่อตามจริง",
			lastname: (value) =>
				/^.{1,256}$/.test(value) ? null : "กรุณากรอกนามสกุลตามจริง",
			tel: (value) =>
				/^\d{9,10}$/.test(value)
					? null
					: "กรุณากรอกเบอร์โทรศัพท์ 9 - 10 ตัวเลข",
		},
	});

	const { mutateAsync, reset } = useMutation(requestOTPService, {
		onSuccess({ data }) {
			const { refno, token } = data.result;
			setOTPData((prev) => ({
				...prev,
				refno: refno,
				token: token,
			}));
			nextStep();
		},
		onError(error: AxiosError<{ success: string; message: string }>) {
			if (
				error &&
				error.response &&
				error.response.data &&
				error.response.data.message
			) {
				notifications.show({
					title: "แจ้งเตือน",
					message: error.response.data.message,
					color: "red",
				});
			} else {
				notifications.show({
					title: "แจ้งเตือน",
					message: "เกิดข้อผิดพลาดระหว่างการขอ OTP",
					color: "red",
				});
			}
		},
		onSettled() {
			setLoading(false);
		},
	});

	const handleSubmit = async (values: valuesForm) => {
		setLoading(true);
		setSignupData((prev) => ({ ...prev, ...values }));
		await mutateAsync({ tel: values.tel });
		form.reset();
	};

	return (
		<Box w="100%" px="sm">
			<form onSubmit={form.onSubmit(handleSubmit)}>
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
							กรุณากรอกข้อมูลส่วนตัว
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

					<TextInput
						mt="sm"
						withAsterisk
						required
						label="ขื่อ"
						placeholder="สมชาย"
						styles={{
							label: {
								fontSize: "1.1rem",
								fontWeight: 400,
							},
						}}
						{...form.getInputProps("firstname")}
					/>
					<TextInput
						mt="sm"
						withAsterisk
						required
						label="นามสกุล"
						placeholder="ใจดี"
						styles={{
							label: {
								fontSize: "1.1rem",
								fontWeight: 400,
							},
						}}
						{...form.getInputProps("lastname")}
					/>
					<TextInput
						mt="sm"
						withAsterisk
						required
						label="เบอร์โทรศัพท์"
						description="ใช้สำหรับรับรหัส OTP เพื่อยืนยันตัวตน"
						placeholder="0891234567"
						styles={{
							label: {
								fontSize: "1.1rem",
								fontWeight: 400,
							},
						}}
						{...form.getInputProps("tel")}
					/>
				</Card>
				<Flex justify="space-between" mt="xl">
					<Button
						px="3rem"
						size="md"
						className={classes.btnOutline}
						onClick={() => {
							reset();
							setLoading(false);
							prevStep();
						}}
					>
						กลับ
					</Button>
					<Button
						px="3rem"
						type="submit"
						size="md"
						loading={loading}
						className={classes.btn}
					>
						ยืนยัน
					</Button>
				</Flex>
			</form>
		</Box>
	);
}

const useStyles = createStyles((theme) => ({
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

export default ProfileForm;
