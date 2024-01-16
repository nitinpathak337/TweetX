import { useState, useEffect } from "react";
import {
  collection,
  where,
  query,
  getDocs,
  onSnapshot,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../firebase-config";
import { useNavigate } from "react-router-dom";
import { ThreeDots } from "react-loader-spinner";
import { FaRegUserCircle } from "react-icons/fa";
import "./index.css";

const Users = ({ user }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState("");
  const navigate = useNavigate();
  const usersCollectionRef = collection(db, "users");

  useEffect(() => {
    fetchAllUsers();
  }, [user]);

  const handleFollow = async (id) => {
    const qUser = query(usersCollectionRef, where("userId", "==", user.userId));
    const qFollowing = query(usersCollectionRef, where("userId", "==", id));
    setButtonLoading(id);
    try {
      const querySnapshotUser = await getDocs(qUser);
      const querySnapshotFollowing = await getDocs(qFollowing);
      if (!querySnapshotUser.empty && !querySnapshotFollowing.empty) {
        const documentSnapshotUser = querySnapshotUser.docs[0];
        const documentSnapshotFollowing = querySnapshotFollowing.docs[0];
        const docRefUser = doc(usersCollectionRef, documentSnapshotUser.id);
        const docRefFollowing = doc(
          usersCollectionRef,
          documentSnapshotFollowing.id
        );
        const updatedDataUser = {
          ...documentSnapshotUser.data(),
          following: [...user.following, id],
        };

        const updatedDataFollowing = {
          ...documentSnapshotFollowing.data(),
          followers: [
            ...documentSnapshotFollowing.data().followers,
            user.userId,
          ],
        };

        await updateDoc(docRefUser, updatedDataUser);
        await updateDoc(docRefFollowing, updatedDataFollowing);
        setButtonLoading("");
      }
    } catch (err) {
      alert(err);
    }
  };

  const renderUsers = () => {
    if (users.length !== 0) {
      return (
        <ul className="d-flex flex-column align-items-center w-100 list-container">
          {users.map((each) => (
            <li
              key={each.data.userId}
              className="d-flex align-items-start bg-white p-3 list-item justify-content-around"
            >
              <div className="d-flex align-items-start">
                <FaRegUserCircle size="40" />
                <div>
                  <h3>{each.data.name}</h3>
                  <p>{`following ${each.data.following.length}`}</p>
                </div>
              </div>
              <button
                className={
                  user.following.includes(each.data.userId)
                    ? "btn btn-secondary"
                    : "btn btn-primary"
                }
                disabled={user.following.includes(each.data.userId)}
                onClick={() => handleFollow(each.data.userId)}
              >
                {buttonLoading === each.data.userId ? (
                  <ThreeDots color="white" height="30" width="30" />
                ) : user.following.includes(each.data.userId) ? (
                  "Following"
                ) : (
                  "Follow"
                )}
              </button>
            </li>
          ))}
        </ul>
      );
    } else {
      return (
        <>
          <img
            src="https://cdni.iconscout.com/illustration/premium/thumb/no-user-found-6771636-5639817.png"
            alt="no-users"
            className="w-25"
          />
          <p>
            Currently you are the only
            <br /> user. Invite your friends to tweetX
          </p>
        </>
      );
    }
  };

  const fetchAllUsers = async () => {
    setLoading(true);
    if (user.hasOwnProperty("userId")) {
      const q = query(usersCollectionRef, where("userId", "!=", user.userId));
      try {
        const docRef = await getDocs(q);
        if (docRef.docs.length === 0) {
          setUsers([]);
          setLoading(false);
        } else {
          onSnapshot(q, (querySnapshot) => {
            setUsers(
              querySnapshot.docs.map((doc) => ({
                data: doc.data(),
              }))
            );
          });
          setLoading(false);
        }
      } catch (err) {
        alert("Something went wrong");
        navigate("/");
      }
    }
  };
  return (
    <div className="d-flex flex-column align-items-center">
      {loading ? <ThreeDots color="white" /> : renderUsers()}
    </div>
  );
};

export default Users;
