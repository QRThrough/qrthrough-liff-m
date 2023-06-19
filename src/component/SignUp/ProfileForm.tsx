import { Box, TextInput, Group, Button, createStyles } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useSignupContext } from "../../context/signup";
import { notifications } from "@mantine/notifications";
import { useMutation } from "react-query";
import { requestOTPService } from "../../service/otp";

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

	const handleSubmit = async (values: valuesForm) => {
		setLoading(true);
		setSignupData((prev) => ({ ...prev, ...values }));
		await mutateAsync({ tel: values.tel });
		form.reset();
	};

	return (
		<Box w="100%" px="sm">
			<form onSubmit={form.onSubmit(handleSubmit)}>
				<TextInput
					disabled
					label="รหัสนักศึกษา"
					placeholder="XX061XXXX or XX06XXX"
					type="number"
					styles={{
						label: {
							fontSize: "1.25rem",
						},
					}}
					{...form.getInputProps("student_code")}
				/>
				<TextInput
					disabled={inAlumni}
					mt="sm"
					withAsterisk
					required
					label="ขื่อ"
					placeholder="สมชาย"
					styles={{
						label: {
							fontSize: "1.25rem",
						},
					}}
					{...form.getInputProps("firstname")}
				/>
				<TextInput
					disabled={inAlumni}
					mt="sm"
					withAsterisk
					required
					label="นามสกุล"
					placeholder="ใจดี"
					styles={{
						label: {
							fontSize: "1.25rem",
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
					type="number"
					styles={{
						label: {
							fontSize: "1.25rem",
						},
					}}
					{...form.getInputProps("tel")}
				/>
				<Group position="right" mt="xl">
					<Button
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
						type="submit"
						size="md"
						loading={loading}
						className={classes.btn}
					>
						ยืนยัน
					</Button>
				</Group>
			</form>
		</Box>
	);
}

const useStyles = createStyles((theme) => ({
	btn: {
		backgroundColor: theme.colors["brand-primary"],
		...theme.fn.hover({
			backgroundColor: "#7B2319",
		}),
	},
	btnOutline: {
		backgroundColor: "unset",
		color: theme.colors["brand-primary"],
		outline: `1px solid ${theme.colors["brand-primary"]}`,
		...theme.fn.hover({
			backgroundColor: theme.colors["brand-primary"],
			color: theme.white,
		}),
	},
}));

export default ProfileForm;
