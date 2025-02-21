import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile
} from "firebase/auth";
import { auth, db } from "../connection";
import { initStores } from "../../stores";
import { doc, setDoc } from "firebase/firestore";
import { getUserData } from "./data";
import { ResultCodes } from "@/utilities/consts";
import { ResponseBody } from "../../../public/_config/data_temp";

export async function createNewUser(data) {
  try {
    // Fix name (first letter as capital letter)
    const fixedFirstName =
      data.FirstName.charAt(0).toUpperCase() + data.FirstName.slice(1).toLowerCase();
    const fixedLastName =
      data.LastName.charAt(0).toUpperCase() + data.LastName.slice(1).toLowerCase();

    const email = data.Email;
    const password = data.Password;
    const response = await createUserWithEmailAndPassword(auth, email, password);
    if (response) {
      const user = response.user;
      const userFullName = `${fixedFirstName} ${fixedLastName}`;
      // Update user auth profile (Firebase Auth)
      await updateUserProfile({ userFullName, userPhotoUrl: "" });
      // Create new user table
      await setDoc(doc(db, "users", user.uid), {
        UserInfo: {
          Email: email,
          FullName: userFullName,
          WorkSpace: "",
          Role: "",
          LastLogin: 0,
          LastUpdated: Date.now()
        }
      });
      // Send back the response
      const result = new ResponseBody();
      result.Result.ResultCode = ResultCodes.Success;
      return result;
    }
  } catch (error) {
    console.log("error creating new user", error);
  }
}

export async function updateUserProfile(data) {
  try {
    await updateProfile(auth.currentUser, {
      displayName: data.userFullName,
      photoURL: data.userPhotoUrl
    });
  } catch (error) {
    console.log("error uodating user profile", error);
  }
}

// export async function updateUserInfo(data) {
//   try {
//     const info = {
//       WorkSpace: data.workspace,
//       Role: data.role
//     }

//   } catch (error) {
//     console.log("error uodating user info", error);

//   }
// }

export async function loginUser(data) {
  try {
    const email = data.Email;
    const password = data.Password;
    const signInResponse = await signInWithEmailAndPassword(auth, email, password);
    if (signInResponse) {
      const user = signInResponse.user;
      const { generalStore, sessionStore } = initStores();
      // save user auth info
      sessionStore.setUserId(user?.uid);
      sessionStore.setUserLastLoggedInTime(new Date());
      sessionStore.setSessionToken(user?.accessToken);
      sessionStore.setUserFullName(user.displayName);
      sessionStore.setUserEmail(user.email);
      // get user info and add it to the store
      const userDataResponse = await getUserData();
      sessionStore.setUserWorkSpace(userDataResponse.WorkSpace || "");
      sessionStore.setUserRole(userDataResponse.Role || "");
      // TODO: Change the data (params)
      generalStore.setCalendarEvents(userDataResponse.userEvents);
      generalStore.setCompaniesList(userDataResponse.userListedCompanies || []);
      generalStore.setUserNotesList(userDataResponse.userNotes);

      // Send back the response
      const result = new ResponseBody();
      result.Result.ResultCode = ResultCodes.Success;
      result.Data = user;
      return result;
    }
  } catch (error) {
    console.log("error trying signin", error);
  }
}

export async function signoutUser() {
  try {
    await auth.signOut();

    // Send back the response
    const result = new ResponseBody();
    result.Result.ResultCode = ResultCodes.Success;
    return result;
  } catch (error) {
    console.log("error trying to logout", error);
  }
}
