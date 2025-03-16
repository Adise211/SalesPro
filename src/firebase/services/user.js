import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile
} from "firebase/auth";
import { auth, db } from "../connection";
import { initStores } from "../../stores";
import { doc, setDoc } from "firebase/firestore";
import { EMAIL_ALREADY_IN_USE } from "../errorCodes";
import { createNewWorkspace, getUserData } from "./workspace";
import { ResultCodes } from "@/utilities/consts";
import { Config } from "@/utilities/config";
import { generatedId } from "@/utilities/utilsFuncs";

export async function createNewUser(data) {
  try {
    const { Email, FirstName, LastName, WorkSpaceName, Role } = data;

    // Fix names (first letter as capital letter)
    const fixedFirstName = FirstName.charAt(0).toUpperCase() + FirstName.slice(1).toLowerCase();
    const fixedLastName = LastName.charAt(0).toUpperCase() + LastName.slice(1).toLowerCase();

    const userFullName = `${fixedFirstName} ${fixedLastName}`;
    const workspaceRandomId = "workspace" + generatedId();
    const newUserInfo = {
      Email,
      FullName: userFullName,
      WorkSpace: {
        Id: workspaceRandomId,
        Name: WorkSpaceName
      },
      Role,
      LastLogin: 0,
      LastUpdated: Date.now()
    };

    // Update user auth profile (Firebase Auth)
    await updateUserProfile({ userFullName, userPhotoUrl: "" });
    // Create new user table
    await setDoc(doc(db, Config.database.collections.users, auth.currentUser.uid), {
      UserInfo: newUserInfo
    });
    // Create new workspace document
    const newWorkspace = await createNewWorkspace(workspaceRandomId, WorkSpaceName, newUserInfo);

    // Send back the response
    return {
      Result: { ResultCode: ResultCodes.Success },
      Data: { User: newUserInfo, Workspace: newWorkspace }
    };
  } catch (error) {
    console.log("error creating new user", error);
  }
}

export async function checkAndSignUpWithEmailAndPass(data) {
  try {
    const { Email, Password } = data;
    const response = await createUserWithEmailAndPassword(auth, Email, Password);
    if (response) {
      return { Result: { ResultCode: ResultCodes.Success }, Data: response.user };
    }
    return response;
  } catch (error) {
    console.log("error checking if user exist", error);
    let resultMessage;

    if (error.code === EMAIL_ALREADY_IN_USE) {
      resultMessage = "Email is already exist";
    }
    return {
      Result: { ResultCode: ResultCodes.Error, ResultMessage: resultMessage }
    };
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
      // TODO: Check if data resturn - set an error message if not!
      const userDataResponse = await getUserData();

      // save user auth info
      sessionStore.setUserId(user?.uid);
      sessionStore.setUserLastLoggedInTime(new Date());
      sessionStore.setSessionToken(user?.accessToken);
      sessionStore.setUserFullName(user.displayName);
      sessionStore.setUserEmail(user.email);
      sessionStore.setUserWorkSpace(userDataResponse.UserInfo?.WorkSpace || "");
      sessionStore.setUserRole(userDataResponse.UserInfo?.Role || "");
      // save user general data
      generalStore.setCompaniesList(userDataResponse.Companies || []);

      // Send back the response
      return { Result: { ResultCode: ResultCodes.Success }, Data: user };
    }
  } catch (error) {
    console.log("error trying signin", error);
  }
}

export async function signoutUser() {
  try {
    await auth.signOut();

    // Send back the response
    return { Result: { ResultCode: ResultCodes.Success }, Data: {} };
  } catch (error) {
    console.log("error trying to logout", error);
  }
}
