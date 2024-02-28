import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile
} from "firebase/auth";
import { auth, db } from "../connection";
import { initStores } from "../../stores";
import { doc, setDoc } from "firebase/firestore";
import { getUserData } from "./data";

export async function createNewUser(data) {
  try {
    const email = data.Email;
    const password = data.Password;
    const response = await createUserWithEmailAndPassword(auth, email, password);
    if (response) {
      const user = response.user;
      const userFullName = `${data.FirstName} ${data.LastName}`;
      updateUserProfile({ userFullName, userPhotoUrl: "" });
      await setDoc(doc(db, "users", user.uid), { test: true });
      return { createdNewUser: true };
    }
  } catch (error) {
    console.log("error creating new user", error);
  }
}

export async function updateUserProfile(data) {
  await updateProfile(auth.currentUser, {
    displayName: data.userFullName,
    photoURL: data.userPhotoUrl
  });
}

export async function loginUser(data) {
  try {
    const email = data.Email;
    const password = data.Password;
    const signInResponse = await signInWithEmailAndPassword(auth, email, password);
    if (signInResponse) {
      const user = signInResponse.user;
      const { generalStore } = initStores();
      // save user auth info
      generalStore.setUserId(user?.uid);
      generalStore.setUserLastLoggedInTime(new Date());
      generalStore.setSessionToken(user?.accessToken);
      generalStore.setUserFullName(user.displayName);
      generalStore.setUserEmail(user.email);
      // get user info and add it to the store
      const userDataResponse = await getUserData();
      generalStore.setCalendarEvents(userDataResponse.userEvents);
      generalStore.setCompaniesList(userDataResponse.userListedCompanies);
      generalStore.setUserNotesList(userDataResponse.userNotes);

      return user;
    }
  } catch (error) {
    console.log("error trying signin", error);
  }
}

export async function logoutUser() {
  try {
    const { generalStore } = initStores();
    generalStore.setUserLastLoggedInTime(0);
    await auth.signOut();

    return { isUserLogedout: true };
  } catch (error) {
    console.log("error trying to logout", error);
  }
}
