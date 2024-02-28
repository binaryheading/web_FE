import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styles from "../style/Basket.module.css";
import { useNavigate } from "react-router-dom";
import {
  getFirestore,
  getDocs,
  doc,
  setDoc,
  query,
  orderBy,
  collection,
} from "firebase/firestore";
import { firestore } from "../firebase";

function Basket() {
  const db = getFirestore();

  const [menuCounts, setMenuCounts] = useState([]);

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

  const navigate = useNavigate();

  // {플러스 함수, 마이너스 함수 미세조정}
  const handleIncrement = async (menu) => {
    await setDoc(doc(db, "basket", menu.id), {
      name: menu.name,
      count: menu.count + 1,
    });
    const updatedMenuCounts = menuCounts.map((item) =>
      item.id === menu.id ? { ...item, count: item.count + 1 } : item
    );
    setMenuCounts(updatedMenuCounts);
  };

  const handleDecrement = async (menu) => {
    await setDoc(doc(db, "basket", menu.id), {
      name: menu.name,
      count: menu.count > 1 ? menu.count - 1 : 1,
    });
    const updatedMenuCounts = menuCounts.map((item) =>
      item.id === menu.id ? { ...item, count: item.count - 1 } : item
    );
    setMenuCounts(updatedMenuCounts);
  };

  const goToPayment = () => {
    navigate("/payment");
  };

  const goToBack = () => {
    window.history.back();
  };

  return (
    <div className={styles.container}>
      <div className={styles.tabBar}>
        <button className={styles.goBackBtn} onClick={goToBack}></button>
        장바구니
        <div className={styles.spacer}></div>
      </div>

      <div className={styles.contents}>
        <div className={styles.menuView}>
          {/* map 함수 사용하여 장바구니 메뉴별로 불러오기 */}
          {menuCounts.map((menu, index) => (
            <div className={styles.eachMenu} key={index}>
              <span>{menu.name}</span>
              <div className={styles.amount}>
                <button
                  className={styles.plusBtn}
                  onClick={() => handleIncrement(menu)}
                  alt="수량 증가하기 버튼"
                ></button>
                <div className="count">{menu.count}</div>
                <button
                  className={styles.minusBtn}
                  onClick={() => handleDecrement(menu)}
                  alt="수량 감소하기 버튼"
                ></button>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", marginBottom: "5vh" }}>
          <button
            className={styles.storeBtn}
            onClick={goToBack}
            alt="수정하기 버튼"
          >
            수정
          </button>
          <button
            className={styles.storeBtn}
            onClick={goToPayment}
            style={{ backgroundColor: "darkorange" }}
            alt="결제하기 버튼"
          >
            결제
          </button>
        </div>
      </div>
    </div>
  );
}

Basket.propTypes = {};

export default Basket;
