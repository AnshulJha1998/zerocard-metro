import train from "../../assets/images/train.png";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { USER_FORM_VALUES } from "../../common/types";
import "./User.scss";
import { useState } from "react";
import { convertDateFormat } from "../../common/utils";
import Dialog from "../../components/dialog/Dialog";

const User = () => {
  const { id } = useParams();
  const [openModal, setOpenModal] = useState(false);

  const [user, setUser] = useState({
    username: "John",
    passengerType: "adult",
    zerCard: {
      cardNumber: 12,
      balance: 100,
      lastRecharge: convertDateFormat(Date.now()),
    },
  });

  const { register, handleSubmit, formState, watch, reset } =
    useForm<USER_FORM_VALUES>({
      defaultValues: {
        from: "",
        to: "",
        date: "",
      },
    });
  const { errors } = formState;

  const handleOnSubmit = (data: USER_FORM_VALUES) => {
    setOpenModal(true);
    console.log(data);
  };

  const handleReset = () => {
    reset({
      from: "",
      to: "",
      date: "",
    });
  };

  const fromValue = watch("from");
  const toValue = watch("to");

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="user-main-container">
      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        header={<h3>Your Total</h3>}
        content={
          <div className="payment-container">
            <div className="payment-info">
              <h4>Passenger Type:</h4>
              <h4>{user.passengerType}</h4>
            </div>
            <div className="payment-info">
              <h4>Passenger Name:</h4>
              <h4>{user.username}</h4>
            </div>
            <div className="payment-info">
              <h4>From:</h4>
              <h4>{fromValue}</h4>
            </div>
            <div className="payment-info">
              <h4>To:</h4>
              <h4>{toValue}</h4>
            </div>
            <div className="payment-info payment-total">
              <h4>Total Fare:</h4>
              <h4>{45}</h4> {/*change*/}
            </div>
          </div>
        }
        footer={<button>Pay</button>}
      />
      <header>Hi there {user.username}</header>

      <div className="ul-container">
        <ul className="ul-list">
          <li className="ul-li-1">
            <figure>
              <img src={train} alt="train" />
              <h4>Direct Line</h4>
            </figure>
            <p>New Delhi</p>
          </li>
          <li className="ul-li-2">
            <figure>
              <img src={train} alt="train" />
              <h4>Direct Line</h4>
            </figure>
            <p>Airport</p>
          </li>
        </ul>
      </div>

      <div className="form-card">
        {" "}
        <form
          onSubmit={handleSubmit(handleOnSubmit)}
          className="login-form"
          noValidate
        >
          <div className="form-group">
            <div className="label-input">
              <label htmlFor="from">From</label>
              <select
                id="from"
                {...register("from", {
                  required: "Starting destination is required",
                })}
              >
                <option value=""></option>
                <option value="New Delhi">New Delhi</option>
                <option value="Airport">Airport</option>
              </select>
            </div>
            <p className="error">{errors.from?.message}</p>
          </div>
          <div className="form-group">
            <div className="label-input">
              <label htmlFor="to">To</label>
              <select
                id="to"
                {...register("to", {
                  required: "End destination is required",
                  validate: (value) =>
                    value !== fromValue ||
                    "End destination cannot be the same as starting destination",
                })}
              >
                <option value=""></option>
                <option value="New Delhi">New Delhi</option>
                <option value="Airport">Airport</option>
              </select>
            </div>
            <p className="error">{errors.to?.message}</p>
          </div>
          <div className="form-group">
            <div className="label-input">
              <label htmlFor="date">Date</label>
              <input
                id="date"
                type="date"
                {...register("date", {
                  required: "Date is required",
                  validate: (value) =>
                    new Date(value) >= new Date(today) ||
                    "Travel date cannot be in the past",
                })}
              />
            </div>
            <p className="error">{errors.date?.message}</p>
          </div>

          <div className="user-form-buttons">
            <p className="reset-button" onClick={handleReset}>
              Reset
            </p>
            <button className="submit-btn" type="submit">
              Book
            </button>
          </div>
        </form>
        <div className="zero-card-info">
          <div className="card-info">
            <h5>Card Number:</h5>
            <h5>{user.zerCard.cardNumber}</h5>
          </div>
          <div className="card-info">
            <h5>Card Number:</h5>
            <h5>{user.zerCard.balance}</h5>
          </div>
          {user.zerCard.lastRecharge && (
            <div className="card-info">
              <h5>Card Last Recharge:</h5>
              <h5>{user.zerCard.lastRecharge}</h5>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default User;
