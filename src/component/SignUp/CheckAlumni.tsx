import {
	Box,
	Button,
	Flex,
	Group,
	TextInput,
	createStyles,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useSignupContext } from "../../context/signup";
import { notifications } from "@mantine/notifications";
import { useMutation } from "react-query";
import { IconUserSearch } from "@tabler/icons-react";
import { getAlumniByIdService } from "../../service/signup";

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
			setSignupData((prev) => ({
				...prev,
				firstname: data.result.firstname ?? "",
				lastname: data.result.lastname ?? "",
				student_code: data.result.student_code,
				tel: data.result.tel ?? "",
			}));
			nextStep();
		},
		onError() {
			notifications.show({
				title: "แจ้งเตือน",
				message: "เกิดข้อผิดพลาดระหว่างการตรวจสอบรหัสนักศึกษา",
				color: "red",
			});
		},
		onSettled() {
			setLoading(false);
		},
	});

	const handleSubmit = async (values: valuesForm) => {
		setLoading(true);
		await mutateAsync(parseInt(values.student_code));
	};

	return (
		<Box w="100%" px="sm">
			<Flex w="100%" justify="center" mb="lg">
				<IconUserSearch size="8rem" stroke="1.5px" />
			</Flex>
			<form onSubmit={form.onSubmit(handleSubmit)}>
				<TextInput
					withAsterisk
					label="รหัสนักศึกษา"
					placeholder="XX061XXXX or XX06XXX"
					required
					type="number"
					styles={{
						label: {
							fontSize: "1.25rem",
						},
					}}
					{...form.getInputProps("student_code")}
				/>
				<Group position="right" mt="xl">
					{/* <Button variant="default" onClick={prevStep}>
						Back
					</Button> */}
					<Button
						type="submit"
						size="md"
						loading={loading}
						className={classes.btn}
					>
						ตรวจสอบ
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
}));

export default CheckAlumni;
