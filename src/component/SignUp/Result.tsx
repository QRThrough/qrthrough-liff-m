import { Flex, Loader, Text, createStyles } from "@mantine/core";
import { IconCircleCheck, IconCircleX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { signUpService } from "../../service/signup";
import { useMutation } from "react-query";
import { useSignupContext } from "../../context/signup";

type status = {
	success: boolean;
	msg: string;
};

function Result() {
	const { classes } = useStyles();
	const { loading, signupData, setLoading } = useSignupContext();
	const [status, setStatus] = useState<status>({ success: false, msg: "" });

	const { mutateAsync } = useMutation(signUpService, {
		onSuccess() {
			setStatus({ success: true, msg: "ลงทะเบียนเสร็จสิ้น" });
		},
		onError(error: any) {
			if (error.response) {
				setStatus({ success: false, msg: error.response.data.message });
			} else {
				setStatus({ success: false, msg: "เกิดข้อผิดพลาด ลงทะเบียนไม่สำเร็จ" });
			}
		},
		onSettled() {
			setLoading(false);
		},
	});

	const signUp = async () => {
		setLoading(true);
		await mutateAsync(signupData);
	};

	useEffect(() => {
		signUp();
	}, []);
	return (
		<Flex w="100%" direction="column" align="center" justify="center" mt="xl">
			{loading ? (
				<Loader size="xl" />
			) : (
				<>
					{status.success ? (
						<>
							<IconCircleCheck size="12rem" color="#06C755" />
							<Text size={24} weight={500} align="center" ml="xs">
								ลงทะเบียนเสร็จสิ้น
							</Text>
						</>
					) : (
						<>
							<IconCircleX size="12rem" color="#FA5252" />
							<Text size={24} weight={500} align="center" ml="xs">
								{status.msg}
							</Text>
						</>
					)}
				</>
			)}
		</Flex>
	);
}

const useStyles = createStyles(() => ({}));

export default Result;
