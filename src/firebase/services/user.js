import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile
} from "firebase/auth";
import { auth } from "../connection";
import { initStores } from "../../stores";

export async function createNewUser(data) {
  try {
    const email = data.Email;
    const password = data.Password;
    const response = await createUserWithEmailAndPassword(auth, email, password);
    if (response) {
      const user = response.user;
      const userFullName = `${data.FirstName} ${data.LastName}`;
      updateUserProfile({ userFullName, userPhotoUrl: "" });
      // save the userId and sessionToken
      return user;
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
    console.log("cu user:", auth);
    const email = data.Email;
    const password = data.Password;
    const response = await signInWithEmailAndPassword(auth, email, password);
    if (response) {
      const user = response.user;
      const { generalStore } = initStores();
      generalStore.setUserId(user?.uid);
      generalStore.setSessionToken(user?.accessToken);
      generalStore.setUserFullName(user.displayName);
      generalStore.setUserEmail(user.email);
      return user;
    }
  } catch (error) {
    console.log("error trying signin", error);
  }
}

export async function logoutUser() {
  try {
    await auth.signOut();
    return { isUserLogedout: true };
  } catch (error) {
    console.log("error trying to logout", error);
  }
}
