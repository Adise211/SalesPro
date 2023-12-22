import { auth, db } from "../connection";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { initStores } from "../../stores";

export async function createCalendarEvent(data) {
  try {
    const userRef = doc(db, "users", auth.currentUser.uid);
    // generates random id
    const rendonId = Math.floor(Math.random() * 10000);

    const newEventObj = {
      EventId: rendonId,
      EventDate: data.date,
      EventColor: data.color,
      Company: data.company,
      Description: data.description,
      Participants: data.participants
    };
    // add event object in "userEvents" array
    // firstore will create automatically if array is not exist
    await updateDoc(userRef, {
      userEvents: arrayUnion(newEventObj)
    });

    return { createdEvent: true };
  } catch (error) {
    console.log("error when creating new event:", error);
  }
}

export async function getCalendarEvents() {
  try {
    const userRef = doc(db, "users", auth.currentUser.uid);

    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      const { calendarStore } = initStores();
      const documentData = docSnap.data();
      const result = {
        userEvents: documentData.userEvents || []
      };
      // save user data to store
      calendarStore.setUserEventsList(result.userEvents);
      return result;
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
      return [];
    }
  } catch (error) {
    console.log("error when getting user events:", error);
  }
}
