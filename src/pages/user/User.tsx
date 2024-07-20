import train from "../../assets/images/train.png";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { JOURNEY_TYPE, USER_FORM_VALUES, USER_TYPE } from "../../common/types";
import { MouseEvent, useCallback, useEffect, useState } from "react";
import { calcDiscount, passengerTypePrice } from "../../common/utils";
import Dialog from "../../components/dialog/Dialog";
import "./User.scss";

const User = () => {
  const { id } = useParams();
  const [totalModal, setTotalModal] = useState<boolean>(false);
  const [recharge, setRecharge] = useState<boolean>(false);
  const [paymentLoading, setPaymentLoading] = useState<boolean>(false);
  const [rechargeLoading, setRechargeLoading] = useState<boolean>(false);
  const [ticketBooked, setTicketBooked] = useState<boolean>(false);

  const token = localStorage.getItem("token");
  const [user, setUser] = useState<USER_TYPE<JOURNEY_TYPE>>({
    _id: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    role: "",
    passengerType: "",
    zeroCard: {
      cardNumber: 0,
      balance: 0,
      lastRecharge: "",
      _id: "",
    },
    journeys: [],
  });

  const fetchUserDetails = useCallback(() => {
    fetch(`http://localhost:5450/api/users/${id}`, {
      headers: {
        Authorization: `token ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch((err) => alert(err));
  }, [id, token]);

  useEffect(() => {
    fetchUserDetails();
  }, [fetchUserDetails]);

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
  const dateValue = watch("date");

  const today = new Date().toISOString().split("T")[0];

  const handlePay = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (user.zeroCard.balance < passengerTypePrice[user.passengerType]) {
      setTotalModal(false);
      setRecharge(true);
      return;
    }

    setPaymentLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5450/api/users/recordJourney",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `token ${token}`,
          },
          body: JSON.stringify({
            userId: id,
            from: fromValue,
            to: toValue,
            date: dateValue,
            fare: passengerTypePrice[user.passengerType],
          }),
        }
      );

      if (!response.ok) return alert("Unable to make payment");
      fetchUserDetails();
    } catch (error) {
      return alert("There is some error!");
    } finally {
      setPaymentLoading(false);
      setTotalModal(false);
    }
  };

  const handleRecharge = async (data: Record<string, number>) => {
    setRechargeLoading(true);
    try {
      const response = await fetch("http://localhost:5450/api/users/recharge", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `token ${token}`,
        },
        body: JSON.stringify({
          userId: id,
          rechargeAmount: Number(data.amount),
          fromStation: fromValue,
        }),
      });

      if (!response.ok) return alert("Unable to recharge");
      fetchUserDetails();
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
            <div className="payment-info">
              <h4>Time:</h4>
              <h4>{dateValue.split("T")[0]}</h4>
            </div>
            <div className="payment-info payment-total">
              <h4>Total Fare:</h4>
              <h4>
                {dateValue && calcDiscount(user, fromValue, toValue, dateValue)}
              </h4>
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
            <h5>Card Balance:</h5>
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
