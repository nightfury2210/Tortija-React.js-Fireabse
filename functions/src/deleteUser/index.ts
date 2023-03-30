import {Change} from "firebase-functions";
import {QueryDocumentSnapshot} from "firebase-functions/lib/providers/firestore";
import {admin, db} from "../firebase";

const deleteUser = (uid: string): void => {
  try {
    admin.auth().deleteUser(uid).then(() => {
      return console.log("Successfully deleted user");
    }).catch((reason) => {
      return console.error("deleteUser failure", reason);
    });
  } catch (reason) {
    return console.error("deleteUser failure", reason);
  }
};

const removeStoredUserData = async (change: Change<QueryDocumentSnapshot>): Promise<false | void | FirebaseFirestore.WriteResult> => {
  const data = change.after;
  const userId = data.id;

  if (!data.data().toDelete) {
    return false;
  }

  try {
    deleteUser(userId);
    return db.collection("users").doc(userId).delete();
  } catch (reason) {
    return console.error("removeStoredUserData failure", reason);
  }
};

export default removeStoredUserData;
