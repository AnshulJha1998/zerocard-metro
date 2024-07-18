import { Dispatch, MouseEventHandler, ReactNode, SetStateAction } from "react";

export type SIGN_IN_FORM_VALUES = Omit<
  SIGN_UP_FORM_VALUES,
  "phone" | "passengerType" | "role"
>;

export type SIGN_UP_FORM_VALUES = {
  username: string;
  email: string;
  password: string;
  phone: string;
  passengerType: PASSENGER_TYPE;
  role?: ROLE_TYPE;
};

export type USER_FORM_VALUES = {
  from: string;
  to: string;
  date: string;
};

export type PASSENGER_TYPE = "" | "kid" | "adult" | "old";

export type ROLE_TYPE = "user" | "admin";

export type LOGIN_SIGNUP_PAGE_PROPS = {
  setPage: Dispatch<SetStateAction<1 | 2>>;
};

export type DIALOG_PROP = {
  open: boolean;
  onClose: MouseEventHandler<HTMLDivElement>;
  header: ReactNode;
  footer: ReactNode;
  content: ReactNode;
};
