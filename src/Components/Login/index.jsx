import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Link, useNavigate } from "react-router-dom";
import "./index.css";
import { useState } from "react";
import { getDocs, collection, query, where } from "firebase/firestore";
import { db } from "../../firebase-config";
import { ThreeDots } from "react-loader-spinner";

const Login = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const usersCollectionRef = collection(db, "users");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const q = query(
      usersCollectionRef,
      where("email", "==", user.email),
      where("password", "==", user.password)
    );
    try {
      const docRef = await getDocs(q);

      if (docRef.empty) {
        setLoading(false);
        alert("Details are incorrect");
      } else {
        localStorage.setItem("user", JSON.stringify(user.email));
        setLoading(false);
        setUser({
          email: "",
          password: "",
        });
        navigate("/postfeed");
      }
    } catch (err) {
      setLoading(false);
      alert(err);
    }
  };

  return (
    <div className="login-page">
      <h1 className="text-center heading">TweetX</h1>
      <div className="d-flex justify-content-around align-items-center h-75">
        <Form
          className="d-flex flex-column align-items-center justify-content-center bg-white p-3 form-container"
          onSubmit={handleLogin}
        >
          <h2 className="">Login</h2>
          <Form.Group className="mb-3">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              required
              value={user.email}
              onChange={(e) => {
                setUser({ ...user, email: e.target.value });
              }}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              required
              value={user.password}
              onChange={(e) => {
                setUser({ ...user, password: e.target.value });
              }}
            />
          </Form.Group>

          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? (
              <ThreeDots color="white" height="30" width="40" />
            ) : (
              "Login"
            )}
          </Button>
          <Form.Text className="mt-3">
            New User?
            <Link to="./signup">Sign up here</Link>
          </Form.Text>
        </Form>
        <img
          src="https://assets.ccbp.in/frontend/react-js/password-manager-lg-img.png"
          alt="login"
          className="login-image d-none d-md-block"
        />
      </div>
    </div>
  );
};

export default Login;
