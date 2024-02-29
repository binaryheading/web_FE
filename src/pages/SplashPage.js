import PropTypes from "prop-types";
import styles from "../style/SplashPage.module.css";
import { useNavigate } from "react-router-dom";
import logo from "../assets/kiosk.png";
import { useEffect } from "react";
import { firestore } from "../firebase";
import { addDoc, doc, query, getDoc,getDocs, collection, deleteDoc, getFirestore } from "firebase/firestore";

function SplashPage() {
  const db = getFirestore();
  const navigate = useNavigate();
  const goToOrder = () => {
    navigate("/order");
  };
  const goToCurrentOrder = () => {
    navigate("/currentOrder");
  };
  const goToRecentOrder = () => {
    navigate("/recentOrder");
  };

  useEffect(() => {
    const deleteAllDocuments = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "basket"));

        if (!querySnapshot.empty) {
          querySnapshot.forEach(async (doc) => {
            const docData = doc.data();
            
            if (docData.name !== "dummy") {
              await deleteDoc(doc.ref);
            }
          });
        }
      } catch (error) {
        console.error("Error deleting documents: ", error);
      }
    };

    deleteAllDocuments();
  }, []);

  useEffect(() => {
    const deleteAllPayDocuments = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "pay"));

        if (!querySnapshot.empty) {
          querySnapshot.forEach(async (doc) => {
            const docData = doc.data();
            
            if (docData.name !== "dummy") {
              await deleteDoc(doc.ref);
            }
          });
        }
      } catch (error) {
        console.error("Error deleting documents: ", error);
      }
    };

    deleteAllPayDocuments();
  }, []);

  return (
    <div className={styles.container}>
      <div>
        <img src={logo} />
      </div>
      <div className={styles.orderContainer}>
        <button
          className={styles.orderBtn}
          onClick={goToOrder}
          style={{ backgroundColor: "darkorange" }}
          alt="주문하기 버튼"
        >
          주문하기
        </button>
        <button
          className={styles.Btn}
          onClick={goToCurrentOrder}
          alt="현재 주문 내역 확인하기 버튼"
        >
          현재 주문 내역
        </button>
        <button
          className={styles.Btn}
          onClick={goToRecentOrder}
          alt="최근 주문 내역 확인하기 버튼"
        >
          최근 주문 내역
        </button>
      </div>
    </div>
  );
}
/*
Button.propTypes = {
  text: PropTypes.string.isRequired,
};
*/

export default SplashPage;
