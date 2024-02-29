import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styles from "../style/Acceptance.module.css";
import { useNavigate } from "react-router-dom";
import ProgressBar from "react-bootstrap/ProgressBar";
import "bootstrap/dist/css/bootstrap.min.css";
import { firestore } from "../firebase";
import { deleteDoc, doc, QuerySnapshot, collection, getDocs, getFirestore, orderBy, query, setDoc } from "firebase/firestore";

function Payment() {
  const db = getFirestore();
  
  const [menuCosts, setMenuCosts] = useState([]);
  const [menuCounts, setMenuCounts] = useState([]);
  //이건 없어도 되는데 지금 당장 실행이 안 되어서 일단 냅뒀어


  useEffect(() => {
    getDocs(query(collection(db, "pay"), orderBy("createdTime")))
      .then((querySnapshot) => {
        const firestorePayList = [];
        querySnapshot.forEach((doc) => {
          firestorePayList.push({
            id: doc.id,
            name: doc.data().name,
            createdTime: doc.data().createdTime,
            count: doc.data().count,
            price: doc.data().price,
          });
        });
        setMenuCosts(firestorePayList);
      })
      .catch((error) => {
        console.log("Error fetching pay counts: ", error);
      });
  }, []);

  useEffect(() => {
    const deleteAllDocuments = async () => {
      try {
        const recentQuerySnapshot = await getDocs(collection(db, "recent"));
        recentQuerySnapshot.forEach(async(doc) => {
          const docData = doc.data();
          if (docData.name !== "dummy") await deleteDoc(doc.ref);
        });
      }
      catch (error) {
        console.error("Error deleting documents: ", error);
      }
    };
    deleteAllDocuments();
    const fetchData = async () => {
      try {
        const payquerySnapshot = await getDocs(query(collection(db, "pay"), orderBy("createdTime")));
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
        console.error('Error copying data: ', error);
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
          <div className={styles.eachMenu}>
            <span>수제왕돈까스</span>
            <div className={styles.amount}>
              <div className="count">{menuCounts.handmadeCutlet} 개</div>
              <div className="cost">{menuCosts.handmadeCutlet} 원</div>
            </div>
          </div>
          <div className={styles.eachMenu}>
            <span>이름이엄청긴메뉴임을 가정한</span>
            <div className={styles.amount}>
              <div className="count">{menuCounts.longNamedMenu} 개</div>
              <div className="cost">{menuCosts.longNamedMenu} 원</div>
            </div>
          </div>
        </div>
        <div
          className={styles.acceptView}
          style={{ backgroundColor: "darkorange" }}
        >
          <div className={styles.acceptNum}>
            <span>주문번호</span>
            <span style={{ fontSize: "xxx-large" }}>
              <b>7번</b>
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
