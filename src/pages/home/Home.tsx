import { useState } from "react";
import "./Home.scss";
import SignIn from "../../components/signin/SignIn";
import SignUp from "../../components/signup/SignUp";
import delhiMetroImg from "../../assets/images/delhi-metro.png";

const Home = () => {
  const [page, setPage] = useState<1 | 2>(1);

  return (
    <div className="home-main-container">
      <header className="header">
        {" "}
        <img
          src={delhiMetroImg}
          alt="Delhi Metro"
          className="delhi-metro-img"
        />
        <div className="header-msg">Welcome to Delhi Metro</div>
      </header>

      {page === 1 ? <SignIn setPage={setPage} /> : <SignUp setPage={setPage} />}
    </div>
  );
};

export default Home;
