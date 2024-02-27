import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styles from "../style/Payment.module.css";
import { useNavigate } from "react-router-dom";
import { firestore } from "../firebase";

function Payment() {
  const [menuCounts, setMenuCounts] = useState({
    handmadeCutlet: 1,
    longNamedMenu: 1,
  });
  const [menuCosts, setMenuCosts] = useState({
    handmadeCutlet: 12000,
    longNamedMenu: 9000,
  });
  const [totalCost, setTotalCost] = useState(0);

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
