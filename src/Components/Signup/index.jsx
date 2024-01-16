import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Link, useNavigate } from "react-router-dom";
import "./index.css";
import { useState } from "react";
import { db } from "../../firebase-config";
import { collection, addDoc, where, query, getDocs } from "firebase/firestore";
import { ThreeDots } from "react-loader-spinner";
import { v4 as uniqueId } from "uuid";

const Signup = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const usersCollectionRef = collection(db, "users");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (user.password !== user.confirmPassword) {
      alert("Password did not match");
    } else {
      setLoading(true);
      try {
        const q = query(usersCollectionRef, where("email", "==", user.email));
        const docRef = await getDocs(q);
        if (docRef.docs.length === 0) {
          await addDoc(usersCollectionRef, {
            name: user.name,
            password: user.password,
            email: user.email,
            followers: [],
            following: [],
            userId: uniqueId(),
          });
          localStorage.setItem("user", JSON.stringify(user.email));
          setLoading(false);
          setUser({ name: "", email: "", password: "", confirmPassword: "" });
          navigate("/postfeed");
        } else {
          setLoading(false);
          alert("Email already exist. Try to login");
        }
      } catch (err) {
        setLoading(false);
        alert(err);
      }
    }
  };

  return (
    <div className="login-page">
      <h1 className="text-center heading">TweetX</h1>
      <div className="d-flex justify-content-around align-items-center h-75">
        <Form
          className="d-flex flex-column align-items-center justify-content-center bg-white p-3 form-container"
          onSubmit={handleSignup}
        >
          <h2 className="">Create Account</h2>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter name"
              required
              value={user.name}
              onChange={(e) => {
                setUser({ ...user, name: e.target.value });
              }}
            />
          </Form.Group>
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
              placeholder="Create password"
              required
              value={user.password}
              onChange={(e) => {
                setUser({ ...user, password: e.target.value });
              }}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm password"
              required
              value={user.confirmPassword}
              onChange={(e) => {
                setUser({ ...user, confirmPassword: e.target.value });
              }}
            />
          </Form.Group>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? (
              <ThreeDots color="white" height="30" width="40" />
            ) : (
              "Sign up"
            )}
          </Button>
          <Form.Text className="mt-3">
            Already a User?
            <Link to="/">Login here</Link>
          </Form.Text>
        </Form>
        <img
          src="https://simulanis.com/assets/img/registrationimage.png"
          alt="login"
          className="signup-image d-none d-md-block"
        />
      </div>
    </div>
  );
};

export default Signup;
