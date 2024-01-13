import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import bcrypt from "bcrypt";

import app from "./init";

const firestore = getFirestore(app);

interface RetrieveDataProps {
  collectionName: string;
}

export async function retrieveData({ collectionName }: RetrieveDataProps) {
  const snapshot = await getDocs(collection(firestore, collectionName));

  const data = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return data;
}

interface RetrieveDataByIdProps {}

export async function retrieveDataById(collectionName: string, id: string) {
  const snapshot = await getDoc(doc(firestore, collectionName, id));

  const data = snapshot.data;
  return data;
}

export async function signUp(
  userData: {
    email: string;
    fullname: string;
    phone: string;
    password: string;
    role?: string;
  },
  callback: Function
) {
  const q = query(
    collection(firestore, "users"),
    where("email", "==", userData.email)
  );

  const snapshot = await getDocs(q);
  const data = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  if (data.length > 0) {
    callback(false);
  } else {
    if (!userData.role) {
      userData.role = "member";
    }

    userData.password = await bcrypt.hash(userData.password, 10);

    await addDoc(collection(firestore, "users"), userData)
      .then((result) => {
        callback(true);
      })
      .catch((err) => {
        callback(false);
        console.log("[FIREBASE_SIGN_UP_ERROR]", err);
      });
  }
}
