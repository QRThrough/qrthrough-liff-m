export type TReqRequestOTP = {
	tel: string;
};

export type TReqVerifyOTP = {
	token: string;
	pin: string;
};

export type TResRequestOTP = {
	refno: string;
	token: string;
};
