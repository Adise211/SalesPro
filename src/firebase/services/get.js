import { db } from "../connection";
import { collection, getDocs } from "firebase/firestore";
console.log("db:", db);
export async function getToDos() {
  try {
    const querySnapshot = await getDocs(collection(db, "todos"));
    console.log("snapp start:", querySnapshot);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log("doc in get.js:", doc);
      return doc.id + " => " + doc.data();
    });
    console.log("snapp end:", querySnapshot);
  } catch (error) {
    console.log("something went wrong:", error);
  }
}
