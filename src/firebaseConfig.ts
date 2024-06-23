import { FirebaseError, initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { toast } from './toast';

const firebaseConfig = {
    apiKey: "AIzaSyDtBx6-QJY7n8YwO62mQLqd9oNj0IFOym0",
    authDomain: "nabia-app.firebaseapp.com",
    projectId: "nabia-app",
    storageBucket: "nabia-app.appspot.com",
    messagingSenderId: "948534853499",
    appId: "1:948534853499:web:aed6d617cb377fc77e47de",
    measurementId: "G-BM9QGHJVY7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth(app);

// Initialize Firestore
const db = getFirestore(app);

// Function to ensure 'members' collection exists in Firestore
export async function createMembersCollectionIfNotExists() {
    try {
        const membersCollectionRef = collection(db, 'members');
        // Attempt to add a dummy document to check if collection exists
        await addDoc(membersCollectionRef, { test: 'dummy' });
        console.log("Collection 'members' exists or has been created.");
    } catch (error) {
        console.error("Error creating 'members' collection: ", error);
    }
}

// Function to get current authenticated user
export function getCurrentUser() {
    return auth.currentUser;
}

// Function to log in user with email and password
export async function loginUser(username: string, password: string) {
    const email = convertToEmail(username);
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        if (error instanceof Error) {
            toast(error.message);
            return false;
        }
    }
}

// Function to register user with email and password
export async function registerUser(username: string, password: string) {
    const email = convertToEmail(username);
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        if (error instanceof Error) {
            toast(error.message);
        } else {
            toast('Registration Failed');
        }
        return false;
    }
}

// Function to convert username to valid email format
function convertToEmail(username: string): string {
    // Append a fixed domain to the username to form a valid email
    if (!username.includes('@')) {
        return `${username}@gmail.com`;
    }
    return username;
}

// Schema for member data
export interface MemberData {
    id: string;
    name: string;
    birthdate: string;
    residentialAddress: string;
    schoolAddress: string;
    parentGuardianName: string;
    parentGuardianRelationship: string;
    parentGuardianContact: string;
    teacherName: string;
    teacherContact: string;
    teacherClass: string;
}

// Function to add a new member to Firestore
export async function addMember(memberData: MemberData): Promise<boolean> {
    try {
        await addDoc(collection(db, 'members'), memberData);
        return true;
    } catch (error) {
        console.error('Error adding member: ', error);
        if (error instanceof FirebaseError && error.code === 'permission-denied') {
            toast('You do not have permission to add members. Please contact support.');
        } else {
            toast('Failed to add member');
        }
        return false;
    }
}

// Function to fetch all members from Firestore
export async function getAllMembers(): Promise<MemberData[]> {
    try {
        const querySnapshot = await getDocs(collection(db, 'members'));
        const members: MemberData[] = querySnapshot.docs.map(doc => {
            const data = doc.data() as MemberData;
            return {
                id: doc.id,
                name: data.name,
                birthdate: data.birthdate,
                residentialAddress: data.residentialAddress,
                schoolAddress: data.schoolAddress,
                parentGuardianName: data.parentGuardianName,
                parentGuardianRelationship: data.parentGuardianRelationship,
                parentGuardianContact: data.parentGuardianContact,
                teacherName: data.teacherName,
                teacherContact: data.teacherContact,
                teacherClass: data.teacherClass,
            };
        });
        return members;
    } catch (error) {
        console.error('Error fetching members: ', error);
        toast('Failed to fetch members');
        return [];
    }
}

// Function to update an existing member in Firestore
export const updateMember = async (memberId: string, updatedMemberData: Partial<MemberData>): Promise<boolean> => {
    try {
      const memberRef = doc(db, 'members', memberId);
      await updateDoc(memberRef, updatedMemberData);
      return true;
    } catch (error) {
      console.error('Error updating member: ', error);
      if (error instanceof FirebaseError && error.code === 'permission-denied') {
        toast('You do not have permission to update members. Please contact support.');
      } else {
        toast('Failed to update member');
      }
      return false;
    }
  };
  
  // Function to delete a member from Firestore
  export const deleteMember = async (memberId: string): Promise<boolean> => {
    try {
      const memberRef = doc(db, 'members', memberId);
      await deleteDoc(memberRef);
      return true;
    } catch (error) {
      console.error('Error deleting member: ', error);
      if (error instanceof FirebaseError && error.code === 'permission-denied') {
        toast('You do not have permission to delete members. Please contact support.');
      } else {
        toast('Failed to delete member');
      }
      return false;
    }
  };

export { db, auth, app };
