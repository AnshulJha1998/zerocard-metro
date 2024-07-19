import train from "../../assets/images/train.png";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { USER_FORM_VALUES } from "../../common/types";
import "./User.scss";
import { MouseEvent, useState } from "react";
import { convertDateFormat, passengerTypePrice } from "../../common/utils";
import Dialog from "../../components/dialog/Dialog";

const User = () => {
  const { id } = useParams();
  const [totalModal, setTotalModal] = useState<boolean>(false);
  const [recharge, setRecharge] = useState<boolean>(false);
  const [paymentLoading, setPaymentLoading] = useState<boolean>(false);
  const [rechargeLoading, setRechargeLoading] = useState<boolean>(false);
  const [ticketBooked, setTicketBooked] = useState<boolean>(false);

  const [user, setUser] = useState({
    username: "John",
    passengerType: "kid",
    zeroCard: {
      cardNumber: 153235,
      balance: 20,
      lastRecharge: convertDateFormat(Date.now()), //need to fix
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

  const {
    register: rechargeReg,
    handleSubmit: rechargeSub,
    formState: rechargeForm,
  } = useForm({
    defaultValues: {
      amount: 0,
    },
  });

  const { errors: rechargeError } = rechargeForm;

  const handleOnSubmit = (data: USER_FORM_VALUES) => {
    setTotalModal(true);
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

  const handlePay = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (user.zeroCard.balance < passengerTypePrice[user.passengerType]) {
      setTotalModal(false);
      setRecharge(true);
      return;
    }

    setPaymentLoading(true);

    try {
      setTicketBooked(true);
    } catch (error) {
      return alert("There is some error!");
    } finally {
      setPaymentLoading(false);
      setTotalModal(false);
    }
  };

  const handleRecharge = (data: Record<string, number>) => {
    setRechargeLoading(true);
    try {
    } catch (error) {
      return alert("There is some error!");
    } finally {
      setRechargeLoading(false);
    }
  };
  return (
    <div className="user-main-container">
      <Dialog
        open={totalModal}
        onClose={() => setTotalModal(false)}
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
              <h4>{passengerTypePrice[user.passengerType]}</h4>
            </div>
          </div>
        }
        footer={<button onClick={handlePay}>Pay</button>}
      />

      <Dialog
        open={recharge}
        onClose={() => setRecharge(false)}
        header={<h3>Recharge</h3>}
        content={
          <form
            className="recharge-container"
            onSubmit={rechargeSub(handleRecharge)}
            noValidate
          >
            <div className="recharge-info">
              <h4>
                Your current balance is {user.zeroCard.balance}. Please recharge
                to continue!{" "}
              </h4>
            </div>
            <div className="recharge-info">
              <div className="recharge-input">
                <label htmlFor="amount">Amount</label>
                <input
                  type="number"
                  id="amount"
                  className="recharge-input-box"
                  {...rechargeReg("amount", {
                    required: "Amount is required",
                    min: {
                      value: 50,
                      message: "Amount must be at least 50",
                    },
                    max: {
                      value: 1000,
                      message: "Amount cannot exceed 1000",
                    },
                  })}
                />
              </div>
              <p className="error">{rechargeError.amount?.message}</p>
            </div>

            <button className="recharge-btn" type="submit">
              Recharge
            </button>
          </form>
        }
        footer={<div></div>}
      />

      <Dialog
        open={ticketBooked}
        onClose={() => setTicketBooked(false)}
        header={<h3>Ticket Booked Successfully</h3>}
        content={<div></div>}
        footer={<button onClick={() => setTicketBooked(false)}>OK</button>}
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
                type="datetime-local"
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
            <h5>{user.zeroCard.cardNumber}</h5>
          </div>
          <div className="card-info">
            <h5>Card Number:</h5>
            <h5>{user.zeroCard.balance}</h5>
          </div>
          {user.zeroCard.lastRecharge && (
            <div className="card-info">
              <h5>Card Last Recharge:</h5>
              <h5>{user.zeroCard.lastRecharge}</h5>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default User;
