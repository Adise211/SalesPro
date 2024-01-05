import { auth, db } from "../connection";
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
// import { generatedId } from "@/utilities/consts";

export async function getUserData() {
  try {
    const userRef = doc(db, "users", auth.currentUser.uid);

    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      const documentData = docSnap.data();
      return {
        userEvents: documentData.userEvents || [],
        userListedCompanies: documentData.userListedCompanies || []
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
    // generates random id
    const rendonId = Math.floor(Math.random() * 10000);

    const newEventObj = {
      EventId: rendonId,
      EventDate: data.date,
      EventColor: data.color,
      Company: data.company,
      Prodact: data.prodact,
      Description: data.description,
      Participants: data.participants
    };
    // add event object in "userEvents" array
    // firstore will create automatically if array is not exist
    await updateDoc(userRef, {
      userEvents: arrayUnion(newEventObj)
    });
    const newCompanyObj = {
      Company: data.company,
      LastUpdated: data.date,
      Status: "followups"
    };
    // also add or create company info
    await createNewCompany(newCompanyObj);

    return { success: true, eventObject: newEventObj };
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

export async function removeComapny(companyObj) {
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
