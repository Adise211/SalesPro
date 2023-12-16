import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../connection";

export async function createNewUser(data) {
  try {
    const email = data.Email;
    const password = data.Password;
    const response = await createUserWithEmailAndPassword(auth, email, password);
    const user = response.user;
    user.displayName = `${data.FirstName} ${data.LastName}`;

    // TO DO: Token and UserId -
    // const userId = user.uid;
    // const sessionToken = user.accessToken
    return user;
  } catch (error) {
    console.log("error creating new user", error);
  }
}
