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
  deleteDoc,
} from "firebase/firestore";

function Payment() {
  const [menuCounts, setMenuCounts] = useState([]);
  const [menuCosts, setMenuCosts] = useState([]);

  const [totalCost, setTotalCost] = useState(0);
  const db = getFirestore();

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
                    createdTime: basketdoc.data().createdTime,
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
    const payRef = collection(db, "pay");
    getDocs(query(payRef)).then((payquerySnapshot) => {
      payquerySnapshot.forEach((paydoc) => {
        const payItemName = paydoc.data().name;
        getDocs(query(basketRef, where("name", "==", payItemName))).then(
          (basketSnapshot) => {
            if (basketSnapshot.empty) {
              deleteDoc(doc(db, "pay", paydoc.id));
            }
          }
        );
      });
    });
  }, []);
  // console.log("Check");
  console.log("장바구니 :", menuCounts);

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
  }, [menuCounts, menuCosts]); // 수량 변경시 가격 갱신하여 화면에 렌더링
  console.log(menuCosts);

  // 총 결제금액 계산 함수
  const calculateTotalCost = () => {
    let total = 0;
    // menuCosts 리스트를 순회하면서 각 메뉴의 가격 * 개수를 더함
    menuCosts.forEach((menu) => {
      total += menu.price * menu.count;
    });
    return total;
  };

  // 총 결제금액을 계산하고 상태 업데이트
  useEffect(() => {
    // calculateTotalCost 함수를 호출하여 총 결제금액을 계산
    const total = calculateTotalCost();
    // 총 결제금액 상태 업데이트
    setTotalCost(total);
  }, [menuCosts]); // menuCosts가 변경될 때마다 총 결제금액을 다시 계산하도록 useEffect에 menuCosts를 의존성으로 설정

  const navigate = useNavigate();
  const goToAcceptance = () => {
    navigate("/acceptance");
  };

  const goToBack = () => {
    navigate("/basket");
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
