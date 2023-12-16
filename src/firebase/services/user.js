import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../connection";
import { initStores } from "../../stores";

export async function createNewUser(data) {
  try {
    const email = data.Email;
    const password = data.Password;
    const response = await createUserWithEmailAndPassword(auth, email, password);
    const user = response.user;
    user.displayName = `${data.FirstName} ${data.LastName}`;

    // save the userId and sessionToken
    const { generalStore } = initStores();
    generalStore.setUserId(user.uid);
    generalStore.setSessionToken(user.accessToken);
    generalStore.setUserFullName = user.displayName;

    return user;
  } catch (error) {
    console.log("error creating new user", error);
  }
}
