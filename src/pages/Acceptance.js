import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styles from "../style/Acceptance.module.css";
import { useNavigate } from "react-router-dom";
import ProgressBar from "react-bootstrap/ProgressBar";
import "bootstrap/dist/css/bootstrap.min.css";
import { firestore } from "../firebase";
import {
  deleteDoc,
  doc,
  QuerySnapshot,
  collection,
  getDocs,
  getFirestore,
  orderBy,
  query,
  setDoc,
} from "firebase/firestore";

function Payment() {
  const db = getFirestore();

  const [menuCosts, setMenuCosts] = useState([]);
  //const [menuCounts, setMenuCounts] = useState([]);

  useEffect(() => {
    getDocs(query(collection(db, "pay"), orderBy("createdTime"))).then(
      (querySanpshots) => {
        const firestorePayList = [];
        querySanpshots.forEach((doc) => {
          firestorePayList.push({
            name: doc.data().name,
            price: doc.data().price,
            count: doc.data().count,
            createdTime: doc.data().createdTime,
          });
        });
        setMenuCosts(firestorePayList);
      }
    );
  }, []);
  console.log(menuCosts);

  useEffect(() => {
    const deleteAllDocuments = async () => {
      try {
        const recentQuerySnapshot = await getDocs(collection(db, "recent"));
        recentQuerySnapshot.forEach(async (doc) => {
          const docData = doc.data();
          if (docData.name !== "dummy") await deleteDoc(doc.ref);
        });
      } catch (error) {
        console.error("Error deleting documents: ", error);
      }
    };
    deleteAllDocuments();
    const fetchData = async () => {
      try {
        const payquerySnapshot = await getDocs(
          query(collection(db, "pay"), orderBy("createdTime"))
        );
        const batch = [];
        payquerySnapshot.forEach((docu) => {
          const payData = docu.data();

          const recentDocRef = doc(db, "recent", docu.id);
          const recentData = {
            name: payData.name,
            createdTime: payData.createdTime,
            count: payData.count,
            price: payData.price,
          };
          batch.push(setDoc(recentDocRef, recentData));
        });
        await Promise.all(batch);
      } catch (error) {
        console.error("Error copying data: ", error);
      }
    };
    fetchData();
  }, []);

  const navigate = useNavigate();
  const goToHome = () => {
    navigate("/");
  };

  const goToBack = () => {
    window.history.back();
  };

  return (
    <div className={styles.container}>
      <div className={styles.tabBar}>
        <div className={styles.spacer}></div>
        접수창
        <button
          className={styles.goBackBtn}
          onClick={goToHome}
          alt="홈으로 이동하기 버튼"
        ></button>
      </div>

      <div className={styles.contents}>
        <div className={styles.menuView}>
          {/* map 함수 사용하여 장바구니 메뉴별로 불러오기 */}
          {menuCosts.map((menu, index) => (
            <div className={styles.eachMenu} key={index}>
              <span>
                {menu.name} <b>{menu.count}개</b>
              </span>
              <div className={styles.amount}>
                <div className="cost">{menu.price * menu.count} 원</div>
              </div>
            </div>
          ))}
        </div>
        <div
          className={styles.acceptView}
          style={{ backgroundColor: "darkorange" }}
        >
          <div className={styles.acceptNum}>
            <span>주문번호</span>
            <span style={{ fontSize: "xxx-large" }}>
              <b>1번</b>
            </span>
          </div>
          <ProgressBar className={styles.progressBar} variant="info" now={30} />
          <div>접수 중</div>
        </div>
      </div>
    </div>
  );
}

Payment.propTypes = {
  text: PropTypes.string.isRequired,
};

export default Payment;
