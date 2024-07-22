import {
  MouseEvent,
  MouseEventHandler,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { JOURNEY_TYPE, SUMMARIES_TYPE, USER_TYPE } from "../../common/types";
import "./Admin.scss";

const Admin = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [users, setUsers] = useState<USER_TYPE<JOURNEY_TYPE>[]>([]);
  const [summaries, setSummaries] = useState<SUMMARIES_TYPE[]>([]);
  const [sumDate, setSumDate] = useState<string>("");
  const token = localStorage.getItem("token");

  const fetchData = useCallback(() => {
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
      })
      .catch((err) => alert(err));
  }, [token, navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="admin-main-container">
      <div className="amount-summary">
        <div className="date-summary">
          <h3>Date :</h3>
          <select
            onClick={(e: MouseEvent<HTMLSelectElement>) =>
              setSumDate((e.currentTarget as HTMLSelectElement).value)
            }
          >
            {summaries.map((sum) => {
              return (
                <option key={sum.date} value={sum.date}>
                  {sum.date.split("T")[0]}
                </option>
              );
            })}
          </select>
        </div>
      </div>
      <div className="passenger-summary"></div>
    </div>
  );
};

export default Admin;
