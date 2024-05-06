import { auth, db } from "../connection";
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { generatedId } from "@/utilities/utilsFuncs";
import Axios from "axios";
import moment from "moment";

export async function getUserData() {
  try {
    const userRef = doc(db, "users", auth.currentUser.uid);

    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      const documentData = docSnap.data();
      return {
        userEvents: documentData.userEvents || [],
        userListedCompanies: documentData.userListedCompanies || [],
        userNotes: documentData.userNotes || []
      };
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
      return [];
    }
  } catch (error) {
    console.log("error when getting user events:", error);
  }
}

export async function createCalendarEvent(data) {
  try {
    const userRef = doc(db, "users", auth.currentUser.uid);
    if (!data.id) {
      // generate random id
      const rendonId = "event" + generatedId();
      data.id = rendonId;
    }

    // add event object in "userEvents" array
    // firstore will create automatically if array is not exist
    await updateDoc(userRef, {
      userEvents: arrayUnion(data)
    });
    return { Result: { Success: true }, Data: data };
  } catch (error) {
    console.log("error when creating new event:", error);
  }
}

export async function updateCalendarEvent(data) {
  try {
    const userDataRes = await getUserData();
    if (userDataRes) {
      const { userEvents } = userDataRes;
      const previousEvent = userEvents.find((ev) => ev.id === data.id);

      if (previousEvent) {
        // remove previousEvent
        const removeEventRes = await removeCalendarEvent(previousEvent);
        // update the new
        const createEventRes = await createCalendarEvent(data);
        if (removeEventRes.Result.Success && createEventRes.Result.Success) {
          return { Result: { Success: true }, Data: createEventRes.Data };
        }
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
      userEvents: arrayRemove(data)
    });
    return { Result: { Success: true } };
  } catch (error) {
    console.log("error when removing calendar event:", error);
  }
}

export async function getCalendarEvents() {
  try {
    const userRef = doc(db, "users", auth.currentUser.uid);

    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      const documentData = docSnap.data();
      return {
        userEvents: documentData.userEvents || []
      };
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
      return [];
    }
  } catch (error) {
    console.log("error when getting user events:", error);
  }
}

export async function createNewCompany(newCompanyObj) {
  try {
    const userRef = doc(db, "users", auth.currentUser.uid);
    // Add an id
    const rendonId = "comp" + generatedId();
    newCompanyObj.companyId = rendonId;
    // Add last updated time (epoch time)
    const currentEpochTime = Number.parseInt(moment(new Date()).format("X"));
    newCompanyObj.lastUpdate = currentEpochTime;

    await updateDoc(userRef, {
      userListedCompanies: arrayUnion(newCompanyObj)
    });
    return { Result: { Success: true }, Data: newCompanyObj };
  } catch (error) {
    console.log("error when creating new company:", error);
  }
}

export async function removeCompany(companyObj) {
  try {
    const userRef = doc(db, "users", auth.currentUser.uid);
    await updateDoc(userRef, {
      userListedCompanies: arrayRemove(companyObj)
    });
    return { Result: { Success: true } };
  } catch (error) {
    console.log("error when removing an item:", error);
  }
}

export async function updateCompanyInfo(companyObj) {
  try {
    const userRef = doc(db, "users", auth.currentUser.uid);
    const userDataRes = await getUserData();
    if (userDataRes) {
      // find the previous company object in server by id
      const { userListedCompanies } = userDataRes;
      const previousCompanyObj = userListedCompanies.find(
        (com) => com.companyId === companyObj.companyId
      );
      // if previous company object exist - remove it and add the new instead
      if (previousCompanyObj) {
        const removePreviousRes = await removeCompany(previousCompanyObj);

        // update the lastUpdate time
        const currentEpochTime = Number.parseInt(moment(new Date()).format("X"));
        companyObj.lastUpdate = currentEpochTime;

        await updateDoc(userRef, {
          userListedCompanies: arrayUnion(companyObj)
        });
        if (removePreviousRes.Result.Success) {
          return { Result: { Success: true }, Data: companyObj };
        }
      }
    }
  } catch (error) {
    console.log("error when trying to update item status:", error);
  }
}

export async function createNewNote(noteObj) {
  try {
    const userRef = doc(db, "users", auth.currentUser.uid);

    // If note does'nt have and id - add id
    if (!noteObj.noteId) {
      const rendonId = "note" + generatedId();
      noteObj.noteId = rendonId;
    }
    // Add last updated time (epoch time)
    const currentEpochTime = Number.parseInt(moment(new Date()).format("X"));
    noteObj.lastUpdate = currentEpochTime;

    await updateDoc(userRef, {
      userNotes: arrayUnion(noteObj)
    });
    return { Result: { Success: true }, Data: noteObj };
  } catch (error) {
    console.log("error when trying to create new note:", error);
  }
}

export async function removeNote(noteObj) {
  try {
    const userRef = doc(db, "users", auth.currentUser.uid);
    await updateDoc(userRef, {
      userNotes: arrayRemove(noteObj)
    });
    return { success: true };
  } catch (error) {
    console.log("error when trying to remove note:", error);
  }
}

export async function updateNote(noteObj) {
  try {
    const userDataRes = await getUserData();
    if (userDataRes) {
      // find the previous note info in server by id
      const { userNotes } = userDataRes;
      const previousNote = userNotes.find((note) => {
        return note.NoteId === noteObj.NoteId;
      });
      // remove prevoius
      if (previousNote) {
        await removeNote(previousNote);
        // create new
        const createNoteRes = await createNewNote(noteObj);
        if (createNoteRes.Result.Success) {
          // return the created note data
          return { Result: { Success: true }, Data: createNoteRes.Data };
        }
      }
    }
  } catch (error) {
    console.log("error when trying to update note:", error);
  }
}

export async function updateNoteWatchedTime(noteObj) {
  try {
    const userRef = doc(db, "users", auth.currentUser.uid);
    const userDataRes = await getUserData();

    const { userNotes } = userDataRes;
    // Get the relevant note by id
    const currentNote = userNotes.find((note) => {
      return note.NoteId === noteObj.NoteId;
    });
    if (currentNote) {
      // Update watched time
      const currentEpochTime = Number.parseInt(moment(new Date()).format("X"));
      noteObj.WatchedAt = currentEpochTime;

      // Remove old note
      await removeNote(currentNote);
      // Create the updated note
      await updateDoc(userRef, {
        userNotes: arrayUnion(noteObj)
      });
      return { success: true, data: noteObj };
    }
  } catch (error) {
    console.log("error when trying to update note watched time:", error);
  }
}

export async function getAllCountriesAndCities() {
  try {
    // from postman APIs - https://documenter.getpostman.com/view/1134062/T1LJjU52#dd5bd0d9-2602-4161-8c77-3af30cd2f41a
    const response = await Axios.get("https://countriesnow.space/api/v0.1/countries");
    if (response.status === 200 && response.data) {
      return { Result: { Success: true }, Data: response.data };
    } else {
      return { Result: { Success: false }, Data: [] };
    }
  } catch (error) {
    console.log("error when trying to get countries:", error);
  }
}
