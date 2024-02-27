import { auth, db } from "../connection";
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { generatedId } from "@/utilities/utilsFuncs";
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
    // generate random id
    const rendonId = "event" + generatedId();
    data.id = rendonId;

    // add event object in "userEvents" array
    // firstore will create automatically if array is not exist
    await updateDoc(userRef, {
      userEvents: arrayUnion(data)
    });
    // const newCompanyObj = {
    //   Company: data.company,
    //   LastUpdated: data.date,
    //   Status: "followups"
    // };
    // // also add or create company info
    // await createNewCompany(newCompanyObj);

    return { Result: { Success: true }, Data: data };
  } catch (error) {
    console.log("error when creating new event:", error);
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
    /**
     newCompanyObj = {
      Company: String (name),
      LastUpdated: String (ISO date),
      Status: Strign ["followups" | "leads" | "closed"]
     }
     */

    // add an id
    // newCompanyObj.Id = generatedId();

    const userRef = doc(db, "users", auth.currentUser.uid);
    const response = await getUserData();
    // 1. If list is not empty
    if (response?.userListedCompanies.length > 0) {
      const isExist = response.userListedCompanies.find((company) => {
        if (company.Company === newCompanyObj.Company) {
          return company;
        }
      });
      if (!isExist) {
        // If comapny not exist - add it
        await updateDoc(userRef, {
          userListedCompanies: arrayUnion(newCompanyObj)
        });
        return { success: true };
      } else {
        // If exist - do nothing
        return { success: false, message: "Company exist" };
      }
    } else {
      // 2. If the list is empty - add it
      await updateDoc(userRef, {
        userListedCompanies: arrayUnion(newCompanyObj)
      });
      return { success: true };
    }
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
    return { success: true };
  } catch (error) {
    console.log("error when removing an item:", error);
  }
}

export async function updateCompanyStatus(companyObj) {
  try {
    const userDataRes = await getUserData();
    if (userDataRes) {
      // find the previous company info in server by name
      const { userListedCompanies } = userDataRes;
      const previousCompanyObj = userListedCompanies.find(
        (com) => com.Company === companyObj.Company
      );
      // if exist
      // 1. remove it
      // 2. add the updated company info
      if (previousCompanyObj) {
        const removePreviousRes = await removeCompany(previousCompanyObj);
        const createNewRes = await createNewCompany(companyObj);
        if (removePreviousRes.success && createNewRes.success) {
          return { success: true };
        }
      }
    }
  } catch (error) {
    console.log("error when trying to update item status:", error);
  }
}

export async function createNewNote(noteObj) {
  try {
    let currentNoteId;
    const noteWatchedAt = noteObj.WatchedAt > 0 ? noteObj.WatchedAt : 0;
    const userRef = doc(db, "users", auth.currentUser.uid);
    const { userNotes } = await getUserData();
    if (userNotes) {
      if (noteObj.NoteId) {
        // if the note has an id - keep it
        currentNoteId = noteObj.NoteId;
      } else {
        // if note does not have an id - create one
        currentNoteId = userNotes.length > 0 ? userNotes.length : 0;
      }

      const createNote = {
        NoteId: currentNoteId,
        CompanyName: noteObj.companyName,
        NoteDescription: noteObj.noteDescription,
        SelectedDate: noteObj.selectedDate,
        SelectedTime: noteObj.selectedTime,
        RemindMe: noteObj.remindMe,
        WatchedAt: noteWatchedAt
      };
      await updateDoc(userRef, {
        userNotes: arrayUnion(createNote)
      });
      return { success: true, data: createNote };
    }
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
        if (createNoteRes.success) {
          return { success: true, data: createNoteRes.data };
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
