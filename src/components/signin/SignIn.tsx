import { useForm } from "react-hook-form";
import {
  LOGIN_SIGNUP_PAGE_PROPS,
  SIGN_IN_FORM_VALUES,
} from "../../common/types";
import "./SignIn.scss";
import { MouseEvent } from "react";
import { useNavigate } from "react-router-dom";

const SignIn = ({ setPage }: LOGIN_SIGNUP_PAGE_PROPS) => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState } = useForm<SIGN_IN_FORM_VALUES>({
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const { errors } = formState;

  const handleOnSubmit = (data: SIGN_IN_FORM_VALUES) => navigate("/user/123"); // need to change

  const handleClickHere = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setPage(2);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(handleOnSubmit)}
        className="login-form"
        noValidate
      >
        <div className="form-group">
          <div className="label-input">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              {...register("username", {
                required: "Username is required",
                maxLength: 15,
              })}
            />
          </div>
          <p className="error">{errors.username?.message}</p>
        </div>
        <div className="form-group">
          <div className="label-input">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email address",
                },
              })}
            />
          </div>
          <p className="error">{errors.email?.message}</p>
        </div>
        <div className="form-group">
          <div className="label-input">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              {...register("password", {
                required: "Password is required",
                maxLength: {
                  value: 15,
                  message: "Password cannot exceed 15 characters",
                },
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters long",
                },
              })}
            />
          </div>
          <p className="error">{errors.password?.message}</p>
        </div>
        <p className="below-msg">
          New here?{" "}
          <span className="click-span" onClick={handleClickHere}>
            Click here
          </span>{" "}
          to register
        </p>

        <button className="submit-btn" type="submit">
          Login
        </button>
      </form>
    </>
  );
};

export default SignIn;
