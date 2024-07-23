import { JOURNEY_TYPE, PASSENGER_SUMMARY_DATA_TYPE, USER_TYPE } from "./types";

export const passengerTypePrice: Record<string, number> = {
  kid: 30,
  adult: 100,
  old: 20,
};

export const formatDateTime = (date: string) => {
  const modDate = new Date(date);
  const day = modDate.getDate();
  const month = modDate.toLocaleString("en-US", { month: "long" });
  const year = modDate.getFullYear();

  return `${day}, ${month} ${year}`;
};

export const isSameDay = (d1: string, d2: string) => {
  const modDate1 = new Date(d1);
  const modDate2 = new Date(d2);
  return (
    (modDate1.getDate() === modDate2.getDate() &&
      modDate1.getMonth() === modDate2.getMonth() &&
      modDate1.getFullYear() === modDate2.getFullYear()) ||
    null
  );
};

export const calcDiscount = (
  user: USER_TYPE<JOURNEY_TYPE>,
  inputFrom: string,
  inputTo: string,
  inputDate: string
) => {
  const lastJourney = user.journeys[user.journeys.length - 1];
  const secondLastJourney = user.journeys[user.journeys.length - 2];

  let discount = 0;
  let totalAmount = passengerTypePrice[user.passengerType];
  let returnJourney: boolean | null = false;

  const secondLastCondition =
    secondLastJourney?.from === inputFrom &&
    secondLastJourney?.to === inputTo &&
    isSameDay(secondLastJourney?.travelDate, inputDate);

  returnJourney =
    lastJourney?.from === inputTo &&
    lastJourney?.to === inputFrom &&
    isSameDay(lastJourney?.travelDate, inputDate);

  if (user.journeys.length % 2 === 0 && secondLastCondition) {
    returnJourney = false;
  } else if (user.journeys.length % 2 !== 0 && secondLastCondition) {
    returnJourney = true;
  }

  if (returnJourney) {
    discount = totalAmount * 0.5;
  }

  totalAmount -= discount;
  return totalAmount;
};

export const getTotal = (users: USER_TYPE<JOURNEY_TYPE>[], date: string) => {
  const totalFare = users.reduce((acc, user) => {
    if (user.role === "user") {
      acc += user.journeys.reduce((journeyAcc, journey) => {
        if (isSameDay(journey.travelDate, date)) {
          journeyAcc += journey.fare;
        }
        return journeyAcc;
      }, 0);
    }
    return acc;
  }, 0);

  const totalRecharges = users.reduce((acc, user) => {
    if (user.role === "user" && user.zeroCard) {
      acc += user.zeroCard.rechargeHistory.reduce((rechargeAcc, recharge) => {
        if (isSameDay(recharge.rechargeDate, date)) {
          rechargeAcc += recharge.rechargeAmount;
        }
        return rechargeAcc;
      }, 0);
    }
    return acc;
  }, 0);

  const travelCounts: Record<string, number> = users.reduce(
    (acc: Record<string, number>, user) => {
      const journeys = user.journeys.filter((journey) =>
        isSameDay(journey.travelDate, date)
      );
      journeys.forEach((journey) => {
        acc[journey.passengerType] =
          ((acc[journey.passengerType] || 0) as number) + 1;
      });
      return acc;
    },
    {}
  );

  const data: PASSENGER_SUMMARY_DATA_TYPE[] = users
    .filter((user) => user.role === "user")
    .filter((user) => {
      const journeys = user.journeys.filter((journey) =>
        isSameDay(journey.travelDate, date)
      );
      const recharges = user.zeroCard.rechargeHistory.filter((recharge) =>
        isSameDay(recharge.rechargeDate, date)
      );
      return journeys.length > 0 || recharges.length > 0;
    })
    .map((user) => {
      const journeys = user.journeys.filter((journey) =>
        isSameDay(journey.travelDate, date)
      );
      const travelAmount = journeys.reduce(
        (acc, journey) => acc + journey.fare,
        0
      );
      const rechargeAmount = user.zeroCard.rechargeHistory
        .filter((recharge) => isSameDay(recharge.rechargeDate, date))
        .reduce((acc, recharge) => acc + recharge.rechargeAmount, 0);
      return {
        passengerType: user.passengerType,
        name: user.username,
        travelAmount,
        rechargeAmount,
        zeroCardNumber: user.zeroCard.cardNumber,
        travelCount: journeys.length,
      };
    })
    .sort((a, b) => {
      const order = ["old", "adult", "kid"];
      return order.indexOf(a.passengerType) - order.indexOf(b.passengerType);
    });

  return {
    totalFare,
    totalRecharges,
    data,
    travelCounts,
  };
};
