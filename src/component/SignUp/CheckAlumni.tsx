import {
	Box,
	Button,
	Card,
	Text,
	TextInput,
	createStyles,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useSignupContext } from "../../context/signup";
import { notifications } from "@mantine/notifications";
import { useMutation } from "react-query";
import { getAlumniByIdService } from "../../service/signup";
import { AxiosError } from "axios";

type valuesForm = {
	student_code: string;
};

function CheckAlumni() {
	const { classes } = useStyles();
	const { setSignupData, loading, setLoading, nextStep, setInAlumni } =
		useSignupContext();
	const form = useForm({
		initialValues: {
			student_code: "",
		},

		validate: {
			student_code: (value) =>
				/^((1[3-9]|[2-3][0-9]|4[0-8])06\d{3})$|((49|[5-9][0-9])06\d{5})$/.test(
					value
				)
					? null
					: "รหัสนักศึกษาไม่ถูกต้อง",
		},
	});

	const { mutateAsync } = useMutation(getAlumniByIdService, {
		onSuccess({ data }) {
			setInAlumni(data.result.in_alumni);
			const { firstname, lastname, student_code, tel } = data.result;
			setSignupData((prev) => ({
				...prev,
				firstname: firstname ?? "",
				lastname: lastname ?? "",
				student_code: student_code,
				tel: tel ?? "",
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
					message: "เกิดข้อผิดพลาดระหว่างการตรวจสอบรหัสนักศึกษา",
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
		await mutateAsync(parseInt(values.student_code));
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
							กรุณากรอกรหัสนักศึกษา เพื่อดึงข้อมูลจากฐานข้อมูลศิษย์เก่า
						</Text>
						<Text size="14px" color="#999B9D">
							(หากพบจะนำไปใช้ในการลงทะเบียน ขั้นตอนถัดไป)
						</Text>
					</Box>

					<TextInput
						withAsterisk
						label="รหัสนักศึกษา"
						placeholder="XX061XXXX or XX06XXX"
						required
						styles={{
							label: {
								fontSize: "1.1rem",
								fontWeight: 400,
							},
						}}
						{...form.getInputProps("student_code")}
					/>
				</Card>
				<Button
					mt="xl"
					type="submit"
					size="md"
					loading={loading}
					className={classes.btn}
				>
					ตรวจสอบ
				</Button>
			</form>
		</Box>
	);
}

const useStyles = createStyles((theme) => ({
	btn: {
		width: "100%",
		backgroundColor: theme.colors["brand-primary"],
		...theme.fn.hover({
			backgroundColor: "#59151E",
		}),
	},
}));

export default CheckAlumni;
