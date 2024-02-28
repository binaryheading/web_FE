import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styles from "../style/Basket.module.css";
import { useNavigate } from "react-router-dom";
import { getFirestore, addDoc, deleteDoc, getDocs, doc, setDoc, query, orderBy, collection, QuerySnapshot } from "firebase/firestore"
import { firestore } from "../firebase";

function Basket() {

  const db = getFirestore();

  // 현재는 주문할 메뉴를 가정해놓은 상태
  // 앞 단계에서 음성인식으로 주문한 메뉴들의 이름을 가져오는 작업 필요
  
  /*
  const [menuCounts, setMenuCounts] = useState({
    handmadeCutlet: 1,
    longNamedMenu: 1,
    kimchiStew: 1,
    soybeanStew: 1,
  });
  */
  

  
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
    });
  }, []);
  console.log(menuCounts);

  const navigate = useNavigate();
  const goToPayment = () => {
    navigate("/payment");
  };

  const goToBack = () => {
    window.history.back();
  };

  const handleIncrement = async (menu) => {
    await setDoc(doc(db, "basket", menu), {
      name: menu,
      count: menuCounts[menu] + 1,
    });
    setMenuCounts((prevCounts) => ({
      ...prevCounts,
      [menu]: prevCounts[menu] + 1,
    }));
  };

  const handleDecrement = async (menu) => {
    await setDoc(doc(db, "basket", menu), {
      name: menu,
      count: menuCounts[menu] > 1? menuCounts[menu] - 1 : 1,
    });
    setMenuCounts((prevCounts) => ({
      ...prevCounts,
      [menu]: prevCounts[menu] > 1 ? prevCounts[menu] - 1 : 1,
    }));
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
          <div className={styles.eachMenu}>
            <span>수제왕돈까스</span>
            <div className={styles.amount}>
              <button
                className={styles.plusBtn}
                onClick={() => handleIncrement("handmadeCutlet")}
                alt="수량 증가하기 버튼"
              ></button>
              <div className="count">{menuCounts.handmadeCutlet}</div>
              <button
                className={styles.minusBtn}
                onClick={() => handleDecrement("handmadeCutlet")}
                alt="수량 감소하기 버튼"
              ></button>
            </div>
          </div>
          <div className={styles.eachMenu}>
            <span>이름이엄청긴메뉴임을 가정한</span>
            <div className={styles.amount}>
              <button
                className={styles.plusBtn}
                onClick={() => handleIncrement("longNamedMenu")}
              ></button>
              <div className="count">{menuCounts.longNamedMenu}</div>
              <button
                className={styles.minusBtn}
                onClick={() => handleDecrement("longNamedMenu")}
              ></button>
            </div>
          </div>
          <div className={styles.eachMenu}>
            <span>김치찌개</span>
            <div className={styles.amount}>
              <button
                className={styles.plusBtn}
                onClick={() => handleIncrement("kimchiStew")}
              ></button>
              <div className="count">{menuCounts.kimchiStew}</div>
              <button
                className={styles.minusBtn}
                onClick={() => handleDecrement("kimchiStew")}
              ></button>
            </div>
          </div>
          <div className={styles.eachMenu}>
            <span>된장찌개</span>
            <div className={styles.amount}>
              <button
                className={styles.plusBtn}
                onClick={() => handleIncrement("soybeanStew")}
              ></button>
              <div className="count">{menuCounts.soybeanStew}</div>
              <button
                className={styles.minusBtn}
                onClick={() => handleDecrement("soybeanStew")}
              ></button>
            </div>
          </div>
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

Basket.propTypes = {
  //text: PropTypes.string.isRequired,
};

export default Basket;
