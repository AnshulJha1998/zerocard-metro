import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  JOURNEY_TYPE,
  PASSENGER_SUMMARY_DATA_TYPE,
  SUMMARIES_TYPE,
  USER_TYPE,
} from "../../common/types";
import "./Admin.scss";
import { getTotal } from "../../common/utils";

const Admin = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<USER_TYPE<JOURNEY_TYPE>[]>([]);
  const [summaries, setSummaries] = useState<SUMMARIES_TYPE[]>([]);
  const [totalJourneys, setTotalJourneys] = useState<number>(0);
  const [totalRecharges, setTotalRecharges] = useState<number>(0);
  const [selectedSummary, setSelectedSummary] = useState<SUMMARIES_TYPE>();
  const [passengerData, setPassengerData] = useState<
    PASSENGER_SUMMARY_DATA_TYPE[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [travelCount, setTravelCount] = useState<Record<string, number>>({
    kid: 0,
    old: 0,
    adult: 0,
  });
  const token = localStorage.getItem("token");

  const fetchData = useCallback(() => {
    setLoading(true);
    const api1 = fetch("http://localhost:5450/api/users", {
      headers: {
        Authorization: `token ${token}`,
      },
    });

    const api2 = fetch("http://localhost:5450/api/users/get/summaries", {
      headers: {
        Authorization: `token ${token}`,
      },
    });

    Promise.all([api1, api2])
      .then(([res1, res2]) => {
        return Promise.all([res1.json(), res2.json()]);
      })
      .then(([data1, data2]) => {
        if (data1.status === 403 || data2.status === 403) return navigate("/");
        setUsers(data1);
        setSummaries(data2);

        const { totalFare, totalRecharges, data, travelCounts } = getTotal(
          data1,
          data2[0].date
        );
        setPassengerData(data);
        setTotalJourneys(totalFare);
        setTotalRecharges(totalRecharges);
        setSelectedSummary(data2[0]);
        setTravelCount(travelCounts);
      })
      .catch((err) => alert(err))
      .finally(() => setLoading(false));
  }, [token, navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="admin-main-container">
      <div className="date-summary">
        <h4>Date :</h4>
        <select
          onChange={(e: ChangeEvent<HTMLSelectElement>) => {
            const d = (e.currentTarget as HTMLSelectElement).value;
            const s = summaries.find((sum) => sum.date === d);

            const { totalFare, totalRecharges, data, travelCounts } = getTotal(
              users,
              d
            );
            setPassengerData(data);
            setTotalJourneys(totalFare);
            setTotalRecharges(totalRecharges);
            setSelectedSummary(s);
            setTravelCount(travelCounts);
          }}
        >
          {summaries
            .sort((a, b) => Number(new Date(a.date)) - Number(new Date(b.date)))
            .map((sum) => {
              return (
                <option key={sum.date} value={sum.date}>
                  {sum.date.split("T")[0]}
                </option>
              );
            })}
        </select>
      </div>
      {selectedSummary && !loading ? (
        <div className="amount-summary">
          <header>COLLECTION SUMMARY</header>
          <table>
            <tbody>
              <tr>
                <th>Total Journeys Amount</th>
                <th>Total Recharge Amount</th>
                <th>Total Service Fees (New Delhi)</th>
                <th>Total Service Fees (Airport)</th>
                <th>Total Amount Collected</th>
                <th>Total Discount Given</th>
                <th>Grand Total</th>
              </tr>
              <tr>
                <td>{totalJourneys}</td>
                <td>{totalRecharges}</td>
                <td>{selectedSummary.serviceFees.newDelhi}</td>
                <td>{selectedSummary.serviceFees.airport}</td>
                <td>{selectedSummary.totalAmountCollected}</td>
                <td>{selectedSummary.totalDiscountGiven}</td>
                <td>
                  {selectedSummary.totalAmountCollected -
                    selectedSummary.totalDiscountGiven}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <div className="loader-summary"></div>
      )}

      <div className="passenger-summary" style={{ overflowY: "auto" }}>
        <header>PASSENGER SUMMARY</header>
        <table>
          <tbody>
            <tr>
              <th>Old Travel Count</th>
              <th>Adult Travel Count</th>
              <th>Kid Travel Count</th>
            </tr>

            <tr>
              <td>{travelCount.old || 0}</td>
              <td>{travelCount.adult || 0}</td>
              <td>{travelCount.kid || 0}</td>
            </tr>
          </tbody>
        </table>

        <table>
          <tbody>
            <tr>
              <th>Passenger Type</th>
              <th>Name</th>
              <th>Travel Amount</th>
              <th>Recharge Amount</th>
              <th>Zero Card Number</th>
              <th>Travel Count (Day)</th>
            </tr>
            {passengerData.map((item) => {
              return (
                <tr key={item.zeroCardNumber}>
                  <td>{item.passengerType}</td>
                  <td>{item.name}</td>
                  <td>{item.travelAmount}</td>
                  <td>{item.rechargeAmount}</td>
                  <td>{item.zeroCardNumber}</td>
                  <td>{item.travelCount}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <button
        className="logout"
        onClick={() => {
          localStorage.clear();
          return navigate("/");
        }}
      >
        LOG OUT
      </button>
    </div>
  );
};

export default Admin;
