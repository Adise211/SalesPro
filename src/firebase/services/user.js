import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

export async function createNewUser(data) {
  try {
    const auth = getAuth();
    const email = data.userEmail;
    const password = data.userPassword;
    const response = await createUserWithEmailAndPassword(auth, email, password);
    console.log("create new user response:", response);
    // const user = userCredential.user;
  } catch (error) {
    console.log("error creating new user", error);
  }
}
