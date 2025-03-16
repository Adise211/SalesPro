import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile
} from "firebase/auth";
import { auth, db } from "../connection";
import { initStores } from "../../stores";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { EMAIL_ALREADY_IN_USE } from "../errorCodes";
import { createNewWorkspace, getWorkspaceData } from "./workspace";
import { ResultCodes } from "@/utilities/consts";
import { Config } from "@/utilities/config";
import { generatedId } from "@/utilities/utilsFuncs";

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
      resultMessage = "Email is already in use";
    }
    return {
      Result: { ResultCode: ResultCodes.Error, ResultMessage: resultMessage }
    };
  }
}

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

export async function getUserData() {
  try {
    const userRef = doc(db, Config.database.collections.users, auth.currentUser.uid);

    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      const documentData = docSnap.data();

      return { Result: { ResultCode: ResultCodes.Success }, Data: documentData };
    } else {
      // docSnap.data() will be undefined in this case
      return {
        Result: { ResultCode: ResultCodes.Error, ResultMessage: "No such document!" },
        Data: {}
      };
    }
  } catch (error) {
    console.log("error when getting user events:", error);
  }
}

export async function loginUser(data) {
  try {
    const { Email, Password } = data;
    const signInResponse = await signInWithEmailAndPassword(auth, Email, Password);
    if (signInResponse) {
      const { user } = signInResponse;
      const { generalStore, sessionStore } = initStores();
      const userDataResponse = await getUserData();
      //If user data exist
      if (userDataResponse.Result.ResultCode > 0) {
        // save user auth info/data
        sessionStore.setUserId(user?.uid);
        sessionStore.setUserLastLoggedInTime(new Date());
        sessionStore.setSessionToken(user?.accessToken);
        sessionStore.setUserFullName(user.displayName);
        sessionStore.setUserEmail(user.email);
        sessionStore.setUserWorkSpace(userDataResponse.UserInfo?.WorkSpace || "");
        sessionStore.setUserRole(userDataResponse.UserInfo?.Role || "");
        // save user workspace data
        const workspaceDataRes = await getWorkspaceData(userDataResponse.UserInfo?.WorkSpace.Id);
        if (workspaceDataRes.Result.ResultCode > 0) {
          generalStore.setCompaniesList(userDataResponse.Companies || []);
        }

        // Send back the response
        return {
          Result: { ResultCode: ResultCodes.Success },
          Data: { User: userDataResponse, Workspace: workspaceDataRes }
        };
      } else {
        // Has error message (ResultMessage)
        return userDataResponse;
      }
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
