import PropTypes from "prop-types";
import styles from "../style/Order.module.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios"; // axios 추가

function Order() {
  const [transcript, setTranscript] = useState("");
  const navigate = useNavigate();

  const goToSplash = () => {
    window.history.back();
  };

  const goToBasket = () => {
    navigate("/basket");
  };

  // 마이크 버튼 클릭 시 서버에 요청 보내는 함수
  const startRecognition = () => {
    axios
      .get("/recognize_speech")
      .then((response) => {
        setTranscript(response.data.transcript);
      })
      .catch((error) => {
        console.error("Error during speech recognition:", error);
      });
  };

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
        {/* 서버로부터 받은 음성 인식 결과 표시 */}
        <div className={styles.message}>{transcript}</div>

        {/* 마이크 버튼 클릭 시 startRecognition 함수 호출 */}
        <button
          className={styles.micBtn}
          onClick={startRecognition}
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

export default Order;
