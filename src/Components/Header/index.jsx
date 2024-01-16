import { Link, useLocation, useNavigate } from "react-router-dom";
import "./index.css";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <>
      <div className="d-flex align-items-center justify-content-between p-3">
        <h1 className="heading">TweetX</h1>
        <div className="d-flex justify-content-between nav-link-container">
          <Link
            to="postfeed"
            className={`nav-link-item ${
              location.pathname === "/postfeed" && "active-tab"
            }`}
          >
            Feed
          </Link>
          <Link
            to="users"
            className={`nav-link-item ${
              location.pathname === "/users" && "active-tab"
            }`}
          >
            Users
          </Link>
          <Link
            to="profile"
            className={`nav-link-item ${
              location.pathname === "/profile" && "active-tab"
            }`}
          >
            Profile
          </Link>
        </div>
      </div>
      <div className="w-100 d-flex justify-content-end px-3 pb-3 pt-0">
        <button className="btn btn-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </>
  );
};

export default Header;
