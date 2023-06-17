import { fetchPublic } from ".";
import {
	TCheckAlumni,
	IResponseNotUndefined,
	TSignupData,
	TResRequestOTP,
	IResponse,
} from "../types";

export const getAlumniByIdService = async (id: number) => {
	return await fetchPublic.get<IResponseNotUndefined<TCheckAlumni>>(
		`/liff/user/${id}`
	);
};

export const signUpService = async (payload: TSignupData) => {
	return await fetchPublic.post<IResponse<TResRequestOTP>>(
		"/liff/user",
		payload
	);
};
