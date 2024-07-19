import { useForm } from "react-hook-form";
import "../signin/SignIn.scss";
import {
  LOGIN_SIGNUP_PAGE_PROPS,
  SIGN_UP_FORM_VALUES,
} from "../../common/types";
import { MouseEvent } from "react";

const SignUp = ({ setPage }: LOGIN_SIGNUP_PAGE_PROPS) => {
  const { register, handleSubmit, formState } = useForm<SIGN_UP_FORM_VALUES>({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      phone: "",
      passengerType: "",
    },
  });

  const { errors } = formState;

  const handleOnSubmit = async (data: SIGN_UP_FORM_VALUES) => {
    delete data.role;
    try {
      await fetch("http://localhost:5450/api/auth/register", {
        method: "POST",
        body: JSON.stringify({
          ...data,
        }),
      });
      alert("User created");
      return setPage(1);
    } catch (error) {
      return alert("There is some error, please try again later!");
    }
  };

  const handleClickHere = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setPage(1);
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
        <div className="form-group">
          <div className="label-input">
            <label htmlFor="phone">Phone</label>
            <input
              type="text"
              id="phone"
              {...register("phone", {
                required: "Phone number is required",
                maxLength: {
                  value: 10,
                  message: "Phone number cannot exceed 10 characters",
                },
                minLength: {
                  value: 10,
                  message: "Phone number must be at least 10 characters long",
                },
              })}
            />
          </div>

          <p className="error">{errors.phone?.message}</p>
        </div>

        <div className="form-group">
          <div className="label-input">
            <div className="radio-options">
              {" "}
              <div className="radio-container">
                <label htmlFor="kid">Kid</label>
                <input
                  type="radio"
                  id="kid"
                  value="kid"
                  {...register("passengerType", {
                    required: "Please provide your age type",
                  })}
                />
              </div>
              <div className="radio-container">
                <label htmlFor="adult">Adult</label>
                <input
                  type="radio"
                  id="adult"
                  value="adult"
                  {...register("passengerType", {
                    required: "Please provide your age type",
                  })}
                />
              </div>
              <div className="radio-container">
                <label htmlFor="old">Old</label>
                <input
                  type="radio"
                  id="old"
                  value="old"
                  {...register("passengerType", {
                    required: "Please provide your age type",
                  })}
                />
              </div>
            </div>
          </div>
          <p className="error">{errors.passengerType?.message}</p>
        </div>
        <p className="below-msg">
          Already Registered?{" "}
          <span className="click-span" onClick={handleClickHere}>
            Click here
          </span>{" "}
          to Login
        </p>
        <button className="submit-btn" type="submit">
          Sign Up
        </button>
      </form>
    </>
  );
};

export default SignUp;
