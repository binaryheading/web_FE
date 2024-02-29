import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styles from "../style/RecentOrder.module.css";
import { useNavigate } from "react-router-dom";
import ProgressBar from "react-bootstrap/ProgressBar";
import "bootstrap/dist/css/bootstrap.min.css";
import { firestore } from "../firebase";
import { deleteDoc, doc, QuerySnapshot, collection, getDocs, getFirestore, orderBy, query, setDoc } from "firebase/firestore";

function RecentOrder() {
  const db = getFirestore();
  const [menuCosts, setMenuCosts] = useState([]);
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
        setMenuCosts(firestorePayList);
      })
      .catch((error) => {
        console.log("Error fetching pay counts: ", error);
      });
  }, []);
  console.log(menuCosts);
  return <div>This is RecentOrder Page!</div>;
}
/*
Button.propTypes = {
  text: PropTypes.string.isRequired,
};
*/

export default RecentOrder;
