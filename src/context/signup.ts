import { createContext, useContext } from "react";
import { TResRequestOTP, TSignupData } from "../types";
export type TSignup = {
	signupData: TSignupData;
	setSignupData: React.Dispatch<React.SetStateAction<TSignupData>>;
	prevStep: () => void;
	nextStep: () => void;
	loading: boolean;
	setLoading: React.Dispatch<React.SetStateAction<boolean>>;
	inAlumni: boolean;
	setInAlumni: React.Dispatch<React.SetStateAction<boolean>>;
	otpData: TResRequestOTP & { pin: string };
	setOTPData: React.Dispatch<
		React.SetStateAction<TResRequestOTP & { pin: string }>
	>;
	initialStep: () => void;
};
export const SignupContext = createContext<TSignup>({
	signupData: {
		token_id: "",
		student_code: "",
		firstname: "",
		lastname: "",
		tel: "",
	},
	setSignupData: () => {},
	prevStep: () => {},
	nextStep: () => {},
	loading: false,
	setLoading: () => {},
	inAlumni: false,
	setInAlumni: () => {},
	otpData: {
		refno: "",
		token: "",
		pin: "",
	},
	setOTPData: () => {},
	initialStep: () => {},
});
export const useSignupContext = () => useContext(SignupContext);
