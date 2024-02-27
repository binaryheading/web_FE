import PropTypes from "prop-types";
import styles from "../style/Order.module.css";
import { useNavigate } from "react-router-dom";
import { QuerySnapshot, collection, getDocs, getFirestore, query } from "firebase/firestore";
import { firestore } from "../firebase";
import React, { useState, useEffect } from "react";

function Order() {

  const [menus, setMenus] = useState([]);
  const db = getFirestore();
  const navigate = useNavigate();
  const goToSplash = () => {
    window.history.back();
  };
  const goToBasket = () => {
    navigate("/basket");
  };
  useEffect(() => {
    getDocs(query(collection(db, "menu"))).then((QuerySnapshot) => {
      const firestoreMenuList = [];
      QuerySnapshot.forEach((doc) => {
        firestoreMenuList.push({
          name: doc.data().name,
        });
      });
      setMenus(firestoreMenuList);
    });
  }, []);
  //console.log(menus);

  return (
    <div className={styles.container}>
      <div className={styles.tabBar}>
        <button
          className={styles.goBackBtn}
          onClick={goToSplash}
          alt="뒤로가기 버튼"
        ></button>
        주문하기
        <div className={styles.spacer}></div>
      </div>
      <div className={styles.contents}>
        {/* ↓ 화면에 메세지 띄우기. 어떤 메세지를 가지고 올지 연동 필요  */}
        <div className={styles.message}>원하는 메뉴명을 말씀해주세요</div>

        {/* ↓ 버튼 누르면 음성인식 시작. 연동 필요  */}
        <button
          className={styles.micBtn}
          alt="음성인식으로 주문할 수 있는 버튼"
        ></button>

        <button
          className={styles.storeBtn}
          onClick={goToBasket}
          alt="장바구니 버튼"
        >
          장바구니
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

export default Order;
