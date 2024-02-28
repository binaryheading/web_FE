import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styles from "../style/Payment.module.css";
import { useNavigate } from "react-router-dom";
import { firestore } from "../firebase";
import {
  where,
  QuerySnapshot,
  addDoc,
  collection,
  getDocs,
  getFirestore,
  query,
  orderBy,
  updateDoc,
  doc,
} from "firebase/firestore";

function Payment() {
  /*
  const [menuCounts, setMenuCounts] = useState({
    handmadeCutlet: 1,
    longNamedMenu: 1,
  });
  const [menuCosts, setMenuCosts] = useState({
    handmadeCutlet: 12000,
    longNamedMenu: 9000,
  });
  */

  const [menuCounts, setMenuCounts] = useState([]);
  const [menuCosts, setMenuCosts] = useState([]);

  const [totalCost, setTotalCost] = useState(0);
  const db = getFirestore();

  useEffect(() => {
    getDocs(query(collection(db, "basket"), orderBy("createdTime")))
      .then((querySnapshot) => {
        const firestoreMenuList = [];
        querySnapshot.forEach((doc) => {
          firestoreMenuList.push({
            id: doc.id,
            name: doc.data().name,
            count: doc.data().count ?? 1,
            createdTime: doc.data().createdTime,
          });
        });
        setMenuCounts(firestoreMenuList);
      })
      .catch((error) => {
        console.error("Error fetching menu counts: ", error);
      });
  }, []);

  console.log("장바구니 :", menuCounts);

  useEffect(() => {
    const basketRef = collection(db, "basket");
    getDocs(query(basketRef)).then((QuerySnapshot) => {
      const firesotrePayList = [];
      QuerySnapshot.forEach((basketdoc) => {
        const basketItemName = basketdoc.data().name;
        const menuRef = collection(db, "menu");
        getDocs(query(menuRef, where("name", "==", basketItemName))).then(
          (menuQuerySnapshot) => {
            menuQuerySnapshot.forEach((menuDoc) => {
              const payRef = collection(db, "pay");
              const existingPayQuery = query(
                payRef,
                where("name", "==", basketItemName)
              );
              getDocs(existingPayQuery).then((existingPaySnapshot) => {
                existingPaySnapshot.forEach((existingPayDoc) => {
                  const existingPayData = existingPayDoc.data();
                  if (existingPayData.count !== basketdoc.data().count) {
                    updateDoc(doc(db, "pay", existingPayDoc.id), {
                      count: basketdoc.data().count,
                    });
                  }
                });
                if (existingPaySnapshot.empty) {
                  const docRef = addDoc(collection(db, "pay"), {
                    name: basketItemName,
                    price: menuDoc.data().price,
                    count: basketdoc.data().count,
                  }).then((docRef) => {
                    firesotrePayList.push(docRef);
                  });
                }
              });
            });
          }
        );
      });
      //setMenuCosts(firesotrePayList);
    });
  }, []);
  //console.log("Check");

  useEffect(() => {
    getDocs(collection(db, "pay")).then((querySanpshots) => {
      const firestorePayList = [];
      querySanpshots.forEach((doc) => {
        firestorePayList.push({
          name: doc.data().name,
          price: doc.data().price,
          count: doc.data().count,
        });
      });
      setMenuCosts(firestorePayList);
    });
  }, []);
  console.log(menuCosts);

  useEffect(() => {
    // 총 결제금액 계산
    // Object.keys(menuCounts) : menuCounts 객체의 속성들을 배열로 가져오기
    // reduce() 메서드 : 배열의 각 요소에 대해 주어진 콜백 함수를 실행하고 하나의 결과값을 반환
    const total = Object.keys(menuCounts).reduce((acc, menu) => {
      return acc + menuCosts[menu] * menuCounts[menu];
    }, 0);
    setTotalCost(total);
  }, [menuCounts, menuCosts]);

  const navigate = useNavigate();
  const goToAcceptance = () => {
    navigate("/acceptance");
  };

  const goToBack = () => {
    window.history.back();
  };

  return (
    <div className={styles.container}>
      <div className={styles.tabBar}>
        <button
          className={styles.goBackBtn}
          onClick={goToBack}
          alt="뒤로가기 버튼"
        ></button>
        결제창
        <div className={styles.spacer}></div>
      </div>

      <div className={styles.contents}>
        <div className={styles.menuView}>
          {/* map 함수 사용하여 장바구니 메뉴별로 불러오기 */}
          {menuCosts.map((menu, index) => (
            <div className={styles.eachMenu} key={index}>
              <span>{menu.name}</span>
              <div className={styles.amount}>
                <div className="cost">{menu.price * menu.count} 원</div>
              </div>
            </div>
          ))}
          {/* <div className={styles.eachMenu}>
            <span>수제왕돈까스</span>
            <div className={styles.amount}>
              <div className="cost">{menuCosts.handmadeCutlet} 원</div>
            </div>
          </div>
          <div className={styles.eachMenu}>
            <span>참치마요김밥</span>
            <div className={styles.amount}>
              <div className="cost">{menuCosts.longNamedMenu} 원</div>
            </div>
          </div> */}
        </div>

        <div className={styles.divider}></div>

        <div className={styles.eachMenu} style={{ minHeight: "15vh" }}>
          <span>총 결제금액</span>
          <div className={styles.amount}>
            <div className="costs">{totalCost} 원</div>
          </div>
        </div>
        <button
          className={styles.storeBtn}
          onClick={goToAcceptance}
          style={{ backgroundColor: "darkorange" }}
          alt="총 금액에 따른 결제하기 버튼"
        >
          {totalCost}원 결제하기
        </button>
      </div>
    </div>
  );
}

Payment.propTypes = {
  text: PropTypes.string.isRequired,
};

export default Payment;
