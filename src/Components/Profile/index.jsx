import { useEffect, useState } from "react";
import { ThreeDots } from "react-loader-spinner";
import { FaRegUserCircle } from "react-icons/fa";
import { db } from "../../firebase-config";
import {
  collection,
  where,
  query,
  getDocs,
  onSnapshot,
  doc,
  updateDoc,
  orderBy,
} from "firebase/firestore";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import "./index.css";

const Profile = ({ user }) => {
  const [loading, setLoading] = useState(false);
  const [myPosts, setMyPosts] = useState(null);
  const [followers, setFollowers] = useState(null);
  const [following, setFollowing] = useState(null);
  const [buttonLoading, setButtonLoading] = useState("");

  const postsCollectionRef = collection(db, "posts");
  const usersCollectionRef = collection(db, "users");

  useEffect(() => {
    getUsersPost();
    getFollowers();
    getFollowing();
  }, [user]);

  const getFollowers = async () => {
    setLoading(true);
    if (user.hasOwnProperty("followers")) {
      if (user.followers.length !== 0) {
        const q = query(
          usersCollectionRef,
          where("userId", "in", user.followers)
        );
        try {
          const docRef = await getDocs(q);
          if (docRef.empty) {
            setFollowers([]);
            setLoading(false);
          } else {
            onSnapshot(q, (querySnapshot) => {
              setFollowers(
                querySnapshot.docs.map((doc) => ({
                  data: doc.data(),
                }))
              );
            });
            setLoading(false);
          }
        } catch (err) {
          alert(err);
          setLoading(false);
        }
      } else {
        setFollowers([]);
        setLoading(false);
      }
    }
  };

  const getFollowing = async () => {
    setLoading(true);
    if (user.hasOwnProperty("following")) {
      if (user.following.length !== 0) {
        const q = query(
          usersCollectionRef,
          where("userId", "in", user.following)
        );
        try {
          const docRef = await getDocs(q);
          if (docRef.empty) {
            setFollowing([]);
            setLoading(false);
          } else {
            onSnapshot(q, (querySnapshot) => {
              setFollowing(
                querySnapshot.docs.map((doc) => ({
                  data: doc.data(),
                }))
              );
            });
            setLoading(false);
          }
        } catch (err) {
          alert(err);
          setLoading(false);
        }
      } else {
        setFollowing([]);
        setLoading(false);
      }
    }
  };

  const getUsersPost = async () => {
    setLoading(true);
    if (user.hasOwnProperty("userId")) {
      const q = query(
        postsCollectionRef,
        where("userId", "==", user.userId),
        orderBy("created", "desc")
      );
      try {
        const docRef = await getDocs(q);
        if (docRef.empty) {
          setMyPosts([]);
          setLoading(false);
        } else {
          onSnapshot(q, (querySnapshot) => {
            setMyPosts(
              querySnapshot.docs.map((doc) => ({
                data: doc.data(),
              }))
            );
          });
          setLoading(false);
        }
      } catch (err) {
        alert(err);
        setLoading(false);
      }
    }
  };

  const renderMyPosts = () => {
    if (myPosts) {
      if (myPosts.length !== 0) {
        return (
          <ul className="d-flex flex-column align-items-center list-container">
            {myPosts.map((each) => (
              <li
                key={each.data.postId}
                className="d-flex flex-column align-items-center bg-white p-3 list-item justify-content-around"
              >
                <div className="d-flex align-items-center justify-content-between w-100">
                  <div className="d-flex">
                    <FaRegUserCircle size={"40"} />
                    <h3>{each.data.name}</h3>
                  </div>
                  <p>
                    {new Date(
                      each.data.created.seconds * 1000 +
                        each.data.created.nanoseconds / 1e6
                    ).toLocaleString()}
                  </p>
                </div>
                <p>{each.data.description}</p>
              </li>
            ))}
          </ul>
        );
      } else {
        return (
          <>
            <img
              src="https://i.pinimg.com/originals/48/fb/90/48fb90bcf2a1f779ee66deee8a12c898.png"
              alt="no-data"
              className="w-50"
            />
            <p>You have not published any post yet</p>
          </>
        );
      }
    }
  };

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

  const renderUsers = (users) => {
    if (users) {
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
            <p>No users found</p>
          </>
        );
      }
    }
  };

  const renderTabsSection = () => {
    return (
      <Tabs
        defaultActiveKey="posts"
        className="mb-3 profile-tab-section mt-5 mb-3 bg-white"
        justify
      >
        <Tab eventKey="posts" title="Posts" className="tab-content">
          {renderMyPosts()}
        </Tab>
        <Tab eventKey="followers" title="Followers" className="tab-content">
          {renderUsers(followers)}
        </Tab>
        <Tab eventKey="following" title="Following">
          {renderUsers(following)}
        </Tab>
      </Tabs>
    );
  };

  const renderProfile = () => {
    if (user.hasOwnProperty("followers") && user.hasOwnProperty("following")) {
      return (
        <div className="d-flex flex-column align-items-center w-100">
          <div className="bg-white d-flex justify-content-center align-items-start profile-top-section">
            <FaRegUserCircle size={"60"} />
            <div className="d-flex flex-column align-items-center">
              <h1>{user.name}</h1>
              <div className="d-flex">
                <p className="mx-2">{`Posts: ${
                  myPosts ? myPosts.length : ""
                }`}</p>
                <p className="mx-2">{`Followers: ${user.followers.length}`}</p>
                <p className="mx-2">{`Following: ${user.following.length}`}</p>
              </div>
            </div>
          </div>
          {renderTabsSection()}
        </div>
      );
    }
  };

  return (
    <div className="d-flex flex-column align-items-center w-100">
      {loading ? <ThreeDots color="white" /> : renderProfile()}
    </div>
  );
};

export default Profile;
