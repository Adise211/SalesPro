import { auth, db } from "../connection";
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { generatedId } from "@/utilities/utilsFuncs";
import { ResultCodes } from "@/utilities/consts";

export async function getUserData() {
  try {
    const userRef = doc(db, "users", auth.currentUser.uid);

    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      const documentData = docSnap.data();
      return documentData;
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
      return [];
    }
  } catch (error) {
    console.log("error when getting user events:", error);
  }
}

export async function getCalendarEvents() {
  try {
    const response = await getUserData();

    if (response) {
      return { Result: { ResultCode: ResultCodes.Success }, Data: response.CalendarEvents };
    }
  } catch (error) {
    console.log("error getting all calendar events:", error);
  }
}

export async function createCalendarEvent(data) {
  try {
    const userRef = doc(db, "users", auth.currentUser.uid);
    if (!data.Id) {
      // generate random id
      const rendonId = "event" + generatedId();
      data.Id = rendonId;
    }

    // Update time
    data.LastUpdated = Date.now();

    // add event object in "userEvents" array
    // firstore will create automatically if array is not exist
    await updateDoc(userRef, {
      CalendarEvents: arrayUnion(data)
    });

    return { Result: { ResultCode: ResultCodes.Success }, Data: data };
  } catch (error) {
    console.log("error when creating new event:", error);
  }
}

export async function updateCalendarEvent(data) {
  try {
    const userDataRes = await getUserData();
    if (userDataRes) {
      const { CalendarEvents } = userDataRes;
      const previousEvent = CalendarEvents.find((calEvent) => calEvent.Id === data.Id);
      // If event exist - remove it and add the updated
      if (previousEvent) {
        // remove previous event
        await removeCalendarEvent(previousEvent);
        // update the lastUpdate time
        data.LastUpdated = Date.now();
        // update the new
        await createCalendarEvent(data);

        return { Result: { ResultCode: ResultCodes.Success }, Data: data };
      } else {
        // If item is not exist (error)
        return {
          Result: { ResultCode: ResultCodes.Error, Text: "Could not update item" },
          Data: {}
        };
      }
    }
  } catch (error) {
    console.log("error when updating calendar event:", error);
  }
}

export async function removeCalendarEvent(data) {
  try {
    const userRef = doc(db, "users", auth.currentUser.uid);
    await updateDoc(userRef, {
      CalendarEvents: arrayRemove(data)
    });
    return { Result: { ResultCode: ResultCodes.Success }, Data: {} };
  } catch (error) {
    console.log("error when removing calendar event:", error);
  }
}

export async function createNewCompany(data) {
  try {
    const userRef = doc(db, "users", auth.currentUser.uid);

    if (!data.Id) {
      // Add an id
      const rendonId = "company" + generatedId();
      data.Id = rendonId;
    }
    // Update time
    data.LastUpdated = Date.now();

    await updateDoc(userRef, {
      Companies: arrayUnion(data)
    });

    return { Result: { ResultCode: 1 }, Data: data };
  } catch (error) {
    console.log("error when creating new company:", error);
  }
}

export async function removeCompany(data) {
  try {
    const userRef = doc(db, "users", auth.currentUser.uid);
    await updateDoc(userRef, {
      Companies: arrayRemove(data)
    });
    return { Result: { ResultCode: ResultCodes.Success }, Data: data };
  } catch (error) {
    console.log("error when removing company:", error);
  }
}

export async function updateCompanyInfo(data) {
  try {
    const userRef = doc(db, "users", auth.currentUser.uid);
    const userDataRes = await getUserData();
    if (userDataRes) {
      // Check if company is exist - by id
      const { Companies } = userDataRes;
      const previousCompanyObj = Companies.find((company) => company.Id === data.Id);
      // if previous company object exist - remove it and add the updated instead
      if (previousCompanyObj) {
        await removeCompany(previousCompanyObj);

        // update the lastUpdate time
        data.LastUpdated = Date.now();
        // Add updated
        await updateDoc(userRef, {
          Companies: arrayUnion(data)
        });

        return { Result: { ResultCode: ResultCodes.Success }, Data: data };
      } else {
        // If item is not exist (error)
        return {
          Result: { ResultCode: ResultCodes.Error, Text: "Could not update item" },
          Data: {}
        };
      }
    }
  } catch (error) {
    console.log("error when trying to update item status:", error);
  }
}
