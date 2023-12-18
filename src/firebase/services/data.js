import { auth, db } from "../connection";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";

export async function createCalendarEvent(data) {
  try {
    const userRef = doc(db, "users", auth.currentUser.uid);
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
