import { auth, db } from "../connection";
import { doc, updateDoc, arrayUnion, arrayRemove, setDoc, getDoc } from "firebase/firestore";
import { generatedId } from "@/utilities/utilsFuncs";
import { ResultCodes } from "@/utilities/consts";
import { Config } from "@/utilities/config";
import { getUserData } from "./user";
import { initStores } from "../../stores";

export async function createNewWorkspace(workspaceId, workspaceName, userInfo) {
  try {
    const newWorkspace = {
      Id: workspaceId,
      Name: workspaceName,
      Users: [userInfo],
      Teams: [],
      Products: [],
      Companies: [],
      Customers: []
    };
    await setDoc(doc(db, Config.database.collections.workspaces, workspaceId), newWorkspace);

    return { Result: { ResultCode: ResultCodes.Success }, Data: newWorkspace };
  } catch (error) {
    console.log("error when creating new work space:", error);
  }
}

export async function getWorkspaceData(workspaceId) {
  try {
    const workspaceRef = doc(db, Config.database.collections.workspaces, workspaceId);

    const docSnap = await getDoc(workspaceRef);
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
    console.log("error when getting workspace data:", error);
  }
}

export async function getCalendarEvents() {
  try {
    const response = await getUserData();

    if (response.Result.ResultCode > 0) {
      return { Result: { ResultCode: ResultCodes.Success }, Data: response.CalendarEvents };
    } else {
      // Has error message (ResultMessage)
      return response;
    }
  } catch (error) {
    console.log("error getting all calendar events:", error);
  }
}

export async function createCalendarEvent(data) {
  try {
    const userRef = doc(db, Config.database.collections.users, auth.currentUser.uid);
    if (!data.Id) {
      // generate random id
      const rendonId = "event" + generatedId();
      data.Id = rendonId;
    }

    // Update time
    data.LastUpdated = Date.now();

    // add event object in "userEvents" array
    // firstore will create automatically if array is not exist
    await updateDoc(userRef, {
      CalendarEvents: arrayUnion(data)
    });

    return { Result: { ResultCode: ResultCodes.Success }, Data: data };
  } catch (error) {
    console.log("error when creating new event:", error);
  }
}

export async function updateCalendarEvent(data) {
  try {
    const userDataRes = await getUserData();
    if (userDataRes) {
      const { CalendarEvents } = userDataRes;
      const previousEvent = CalendarEvents.find((calEvent) => calEvent.Id === data.Id);
      // If event exist - remove it and add the updated
      if (previousEvent) {
        // remove previous event
        await removeCalendarEvent(previousEvent);
        // update the lastUpdate time
        data.LastUpdated = Date.now();
        // update the new
        await createCalendarEvent(data);

        return { Result: { ResultCode: ResultCodes.Success }, Data: data };
      } else {
        // If item is not exist (error)
        return {
          Result: { ResultCode: ResultCodes.Error, Text: "Could not update item" },
          Data: {}
        };
      }
    }
  } catch (error) {
    console.log("error when updating calendar event:", error);
  }
}

export async function removeCalendarEvent(data) {
  try {
    const userRef = doc(db, Config.database.collections.users, auth.currentUser.uid);
    await updateDoc(userRef, {
      CalendarEvents: arrayRemove(data)
    });
    return { Result: { ResultCode: ResultCodes.Success }, Data: {} };
  } catch (error) {
    console.log("error when removing calendar event:", error);
  }
}

export async function createNewCompany(data) {
  try {
    const userRef = doc(db, Config.database.collections.users, auth.currentUser.uid);

    if (!data.Id) {
      // Add an id
      const rendonId = "company" + generatedId();
      data.Id = rendonId;
    }
    // Update time
    data.LastUpdated = Date.now();

    await updateDoc(userRef, {
      Companies: arrayUnion(data)
    });

    return { Result: { ResultCode: 1 }, Data: data };
  } catch (error) {
    console.log("error when creating new company:", error);
  }
}

export async function removeCompany(data) {
  try {
    const userRef = doc(db, Config.database.collections.users, auth.currentUser.uid);
    await updateDoc(userRef, {
      Companies: arrayRemove(data)
    });
    return { Result: { ResultCode: ResultCodes.Success }, Data: data };
  } catch (error) {
    console.log("error when removing company:", error);
  }
}

export async function updateCompanyInfo(data) {
  try {
    const userRef = doc(db, Config.database.collections.users, auth.currentUser.uid);
    const userDataRes = await getUserData();
    if (userDataRes.Result.ResultCode > 0) {
      // Check if company is exist - by id
      const { Companies } = userDataRes;
      const previousCompanyObj = Companies.find((company) => company.Id === data.Id);
      // if previous company object exist - remove it and add the updated instead
      if (previousCompanyObj) {
        await removeCompany(previousCompanyObj);

        // update the lastUpdate time
        data.LastUpdated = Date.now();
        // Add updated
        await updateDoc(userRef, {
          Companies: arrayUnion(data)
        });

        return { Result: { ResultCode: ResultCodes.Success }, Data: data };
      } else {
        // If item is not exist (error)
        return {
          Result: { ResultCode: ResultCodes.Error, Text: "Could not update item" },
          Data: {}
        };
      }
    } else {
      // Has error message (ResultCode)
      return userDataRes;
    }
  } catch (error) {
    console.log("error when trying to update item status:", error);
  }
}

export async function createNewProduct(data) {
  try {
    const { sessionStore } = initStores();
    const workspaceRef = doc(
      db,
      Config.database.collections.workspaces,
      sessionStore.userWorkSpace.Id
    );

    if (!data.Id) {
      // Add an id
      const rendonId = "product" + generatedId();
      data.Id = rendonId;
    }
    // Update name and time
    data.UpdatedBy = sessionStore.userFullName;
    data.LastUpdated = Date.now();

    await updateDoc(workspaceRef, {
      Products: arrayUnion(data)
    });

    return { Result: { ResultCode: ResultCodes.Success }, Data: data };
  } catch (error) {
    console.log("error when creating new product:", error);
  }
}

export async function updateProduct(data) {
  try {
    const { sessionStore } = initStores();
    const workspaceRef = doc(
      db,
      Config.database.collections.workspaces,
      sessionStore.userWorkSpace.Id
    );
    const docSnap = await getDoc(workspaceRef);
    const productsArr = await docSnap.get("Products");
    const prevItem = productsArr.find((item) => {
      return item.Id == data.Id;
    });

    if (prevItem) {
      // If previus item exist - remove it and add the new + update time
      await removeProduct(prevItem);

      data.LastUpdated = Date.now();
      await createNewProduct(data);
    } else {
      throw new Error();
    }

    return { Result: { ResultCode: ResultCodes.Success }, Data: data };
  } catch (error) {
    console.log("error when trying to update item:", error);
    return {
      Result: { ResultCode: ResultCodes.Error, Text: "Could not update item" },
      Data: {}
    };
  }
}

export async function removeProduct(data) {
  try {
    const { sessionStore } = initStores();
    const workspaceRef = doc(
      db,
      Config.database.collections.workspaces,
      sessionStore.userWorkSpace.Id
    );
    await updateDoc(workspaceRef, {
      Products: arrayRemove(data)
    });
    return { Result: { ResultCode: ResultCodes.Success }, Data: {} };
  } catch (error) {
    console.log("error when removing product:", error);
    return { Result: { ResultCode: ResultCodes.Error }, Data: {} };
  }
}
