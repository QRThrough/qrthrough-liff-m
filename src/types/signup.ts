export type TSignupData = {
	id_token: string;
	student_code: string;
	firstname: string;
	lastname: string;
	tel: string;
};

export type TCheckAlumni = {
	in_alumni: boolean;
	firstname: string | null;
	lastname: string | null;
	student_code: string;
	tel: string | null;
};
