import Header from "../Header";
import { Routes, Route, useNavigate } from "react-router-dom";
import PostFeed from "../PostFeed";
import Users from "../Users";
import Profile from "../Profile";
import { useEffect, useState } from "react";
import { db } from "../../firebase-config";
import {
  collection,
  where,
  query,
  getDocs,
  onSnapshot,
} from "firebase/firestore";

const MainContainer = () => {
  const [user, setUser] = useState({});

  const usersCollectionRef = collection(db, "users");
  const navigate = useNavigate();

  useEffect(() => {
    getUserDetails();
  }, []);

  const getUserDetails = async () => {
    const userEmail = localStorage.getItem("user");
    const q = query(
      usersCollectionRef,
      where("email", "==", JSON.parse(userEmail))
    );
    try {
      const docRef = await getDocs(q);
      if (docRef.docs.length === 0) {
        alert("Please login first");
        navigate("/");
      } else {
        onSnapshot(q, (querySnapshot) => {
          const data = querySnapshot.docs.map((doc) => ({
            ...doc.data(),
          }));
          setUser(data[0]);
        });
      }
    } catch (err) {
      alert("Someting went wrong");
      navigate("/");
    }
  };
  return (
    <>
      <Header />
      <Routes>
        <Route exact path="postfeed" element={<PostFeed user={user} />} />
        <Route exact path="users" element={<Users user={user} />} />
        <Route exact path="profile" element={<Profile user={user} />} />
      </Routes>
    </>
  );
};

export default MainContainer;
