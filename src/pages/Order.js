import PropTypes from "prop-types";
import styles from "../style/Order.module.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios"; // axios 추가
import { firestore } from "../firebase";
import {
  QuerySnapshot,
  addDoc,
  collection,
  getDocs,
  getFirestore,
  query,
} from "firebase/firestore";

function Order() {
  const [transcript, setTranscript] = useState("");
  const db = getFirestore();
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
        const transcriptData = response.data.transcript;
        setTranscript(transcriptData);
        // 반환값이 'Could not understand audio' 일 경우 addDoc 하지 않는 작업 필요
        const transcriptDocRef = addDoc(collection(db, "basket"), {
          count: 1,
          createdTime: Math.floor(Date.now() / 1000),
          name: transcriptData,
        });
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
