import { useEffect, useState } from "react";
import { ThreeDots } from "react-loader-spinner";
import { db } from "../../firebase-config";
import {
  collection,
  where,
  query,
  getDocs,
  onSnapshot,
  Timestamp,
  addDoc,
  orderBy,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { v4 as uniqueId } from "uuid";
import { FaRegUserCircle } from "react-icons/fa";

const PostFeed = ({ user }) => {
  const [feed, setFeed] = useState();
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [yourPost, setYourPost] = useState("");

  const postsCollectionRef = collection(db, "posts");
  const navigate = useNavigate();

  useEffect(() => {
    getUserFeed();
  }, [user]);

  const handleClose = () => {
    setShow(false);
    setYourPost("");
  };
  const handleShow = () => setShow(true);

  const getUserFeed = async () => {
    setLoading(true);
    if (user.hasOwnProperty("following")) {
      if (user.following.length === 0) {
        setLoading(false);
      } else {
        const q = query(
          postsCollectionRef,
          where("userId", "in", user.following),
          orderBy("created", "desc")
        );
        try {
          const docRef = await getDocs(q);
          if (docRef.empty) {
            setFeed([]);
            setLoading(false);
          } else {
            onSnapshot(q, (querySnapshot) => {
              setFeed(
                querySnapshot.docs.map((doc) => ({
                  data: doc.data(),
                }))
              );
            });
            setLoading(false);
          }
        } catch (err) {
          alert("something went wrong");
          alert(err);
          navigate("/");
        }
      }
    }
  };

  const handlePublish = async () => {
    await addDoc(postsCollectionRef, {
      name: user.name,
      userId: user.userId,
      created: Timestamp.now(),
      postId: uniqueId(),
      description: yourPost,
    });
    setShow(false);
    setYourPost("");
    alert("Post published successfully");
  };

  const renderFeed = () => {
    if (feed) {
      if (feed.length !== 0) {
        return (
          <ul className="d-flex flex-column align-items-center w-100 list-container">
            {feed.map((each) => (
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
            <p>
              Feed is empty beacuse people
              <br />
              you follow have not post anything yet{" "}
            </p>
          </>
        );
      }
    } else {
      return (
        <>
          <img
            src="https://i.pinimg.com/originals/48/fb/90/48fb90bcf2a1f779ee66deee8a12c898.png"
            alt="no-data"
            className="w-50"
          />
          <p>
            Feed is empty beacuse you are not
            <br /> following anyone
          </p>
        </>
      );
    }
  };
  return (
    <div className="d-flex flex-column align-items-center">
      <Button
        variant="primary"
        onClick={handleShow}
        className="align-self-center w-25"
        title="Write your post"
      >
        Write
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Write Your Post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            as="textarea"
            row={4}
            placeholder="What's on your mind?"
            value={yourPost}
            onChange={(e) => {
              setYourPost(e.target.value);
            }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handlePublish}>
            Publish
          </Button>
        </Modal.Footer>
      </Modal>
      {loading ? <ThreeDots color="white" /> : renderFeed()}
    </div>
  );
};

export default PostFeed;
