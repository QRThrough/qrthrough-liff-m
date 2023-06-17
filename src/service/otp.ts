import { fetchPublic } from ".";
import { IResponseNotUndefined } from "../types";
import { TReqRequestOTP, TReqVerifyOTP, TResRequestOTP } from "../types";

export const requestOTPService = async (payload: TReqRequestOTP) => {
	return await fetchPublic.post<IResponseNotUndefined<TResRequestOTP>>(
		"/liff/otp/request",
		payload
	);
};

export const verifyOTPService = async (payload: TReqVerifyOTP) => {
	return await fetchPublic.put<IResponseNotUndefined<string>>(
		"/liff/otp/verify",
		payload
	);
};
