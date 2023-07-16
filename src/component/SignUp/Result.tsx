import {
	Box,
	Button,
	Card,
	Flex,
	Loader,
	Text,
	createStyles,
} from "@mantine/core";
import { IconCircleCheck, IconCircleX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { signUpService } from "../../service/signup";
import { useMutation } from "react-query";
import { useSignupContext } from "../../context/signup";
import liff from "@line/liff";

type status = {
	success: boolean;
	msg: string;
};

function Result() {
	const { classes } = useStyles();
	const { loading, signupData, setLoading, initialStep } = useSignupContext();
	const [status, setStatus] = useState<status>({ success: true, msg: "" });

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
				<Flex direction="column" align="center" justify="center" py="2rem">
					{loading ? (
						<Loader size="xl" />
					) : status.success ? (
						<>
							<IconCircleCheck size="12rem" color="#06C755" />
							<Text size={24} weight={500} align="center">
								ลงทะเบียนเสร็จสิ้น
							</Text>
						</>
					) : (
						<>
							<IconCircleX size="12rem" color="#FA5252" />
							<Text size={24} weight={500} align="center">
								{status.msg}
							</Text>
						</>
					)}
				</Flex>
			</Card>
			{status.success ? (
				<Button
					mt="xl"
					w="100%"
					onClick={() => liff.closeWindow()}
					size="md"
					loading={loading}
					className={classes.btn}
				>
					ปิดหน้าต่าง
				</Button>
			) : (
				<Flex justify="space-between" mt="xl">
					<Button
						px="3rem"
						size="md"
						className={classes.btnOutline}
						onClick={() => {
							setLoading(false);
							initialStep();
						}}
					>
						กลับหน้าแรก
					</Button>
					<Button px="3rem" size="md" loading={loading} className={classes.btn}>
						ปิดหน้าต่าง
					</Button>
				</Flex>
			)}
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
			backgroundColor: "#59151E",
			color: theme.white,
		}),
	},
}));

export default Result;
