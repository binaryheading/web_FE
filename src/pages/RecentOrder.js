import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styles from "../style/RecentOrder.module.css";
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

function RecentOrder() {
  const db = getFirestore();
  const [menus, setMenus] = useState([]);
  const [menuCosts, setMenuCosts] = useState([]);

  const [totalCost, setTotalCost] = useState(0);

  useEffect(() => {
    getDocs(query(collection(db, "recent"), orderBy("createdTime")))
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
        setMenus(firestorePayList);
      })
      .catch((error) => {
        console.log("Error fetching pay counts: ", error);
      });
  }, []);
  console.log(menus);

  const navigate = useNavigate();
  const goToBack = () => {
    navigate("/");
  };

  // 총 결제금액 계산 함수
  const calculateTotalCost = () => {
    let total = 0;
    // menuCosts 리스트를 순회하면서 각 메뉴의 가격 * 개수를 더함
    menus.forEach((menu) => {
      total += menu.price * menu.count;
    });
    return total;
  };

  // 총 결제금액을 계산하고 상태 업데이트
  useEffect(() => {
    // calculateTotalCost 함수를 호출하여 총 결제금액을 계산
    const total = calculateTotalCost();
    console.log("총 가격 : ", total);
    // 총 결제금액 상태 업데이트
    setTotalCost(total);
  }, [menus]);

  return (
    <div className={styles.container}>
      <div className={styles.tabBar}>
        <button
          className={styles.goBackBtn}
          onClick={goToBack}
          alt="뒤로가기 버튼"
        ></button>
        최근 주문 내역
        <div className={styles.spacer}></div>
      </div>

      <div className={styles.contents}>
        <div className={styles.menuView}>
          {/* map 함수 사용하여 장바구니 메뉴별로 불러오기 */}
          {menus.map((menu, index) => (
            <div className={styles.eachMenu} key={index}>
              <span>
                {menu.name} <b>{menu.count}</b>개
              </span>
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
      </div>
    </div>
  );
}
/*
Button.propTypes = {
  text: PropTypes.string.isRequired,
};
*/

export default RecentOrder;
