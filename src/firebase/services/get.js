import { db } from "../connection";
import { collection, getDocs } from "firebase/firestore";

// TO DO: collection per user

export async function getToDos() {
  try {
    const result = [];
    const querySnapshot = await getDocs(collection(db, "todos"));
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
      result.push(doc.data());
    });
    return result;
  } catch (error) {
    console.log("something went wrong:", error);
  }
}
