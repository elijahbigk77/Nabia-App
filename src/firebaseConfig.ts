import { FirebaseError, initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc, query, where } from 'firebase/firestore';
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
export async function registerUser(username: string, password: string, name: string) {
  const email = convertToEmail(username);
  try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update user profile with name
      await updateProfile(userCredential.user, { displayName: name });

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
    tribeId: string;
    clubId: string; 
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

// Function to fetch all members from Firestore and remove those without a name
export async function getAllMembers(): Promise<MemberData[]> {
    try {
        const querySnapshot = await getDocs(collection(db, 'members'));
        const members: MemberData[] = [];

        for (const doc of querySnapshot.docs) {
            const data = doc.data() as MemberData;
            if (!data.name) {
                await deleteDoc(doc.ref);
                console.log(`Deleted member with id ${doc.id} due to missing name`);
            } else {
                members.push({
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
                    tribeId: data.tribeId,
                    clubId: data.clubId
                });
            }
        }

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

// Function to fetch members by tribeId from Firestore
export async function getMembersByTribeId(tribeId: string): Promise<MemberData[]> {
    try {
        const querySnapshot = await getDocs(collection(db, 'members'));
        const members: MemberData[] = querySnapshot.docs
            .filter(doc => {
                const data = doc.data() as MemberData;
                return data.tribeId === tribeId;
            })
            .map(doc => {
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
                    tribeId: data.tribeId,
                    clubId: data.clubId
                };
            });

        return members;
    } catch (error) {
        console.error('Error fetching members by tribeId: ', error);
        toast('Failed to fetch members');
        return [];
    }
}

// Schema for club data
export interface ClubData {
    id?: string; // Optional because Firestore will generate it
    name: string;
    location: string; // Added location field
  }
  
  // Function to add a new club to Firestore
  export async function addClub(clubData: ClubData): Promise<boolean> {
    try {
      await addDoc(collection(db, 'clubs'), clubData);
      return true;
    } catch (error) {
      console.error('Error adding club: ', error);
      if (error instanceof FirebaseError && error.code === 'permission-denied') {
        toast('You do not have permission to add clubs. Please contact support.');
      } else {
        toast('Failed to add club');
      }
      return false;
    }
  }
  
  // Function to update an existing club in Firestore
  export async function updateClub(clubId: string, updatedClubData: Partial<ClubData>): Promise<boolean> {
    try {
      const clubRef = doc(db, 'clubs', clubId);
      await updateDoc(clubRef, updatedClubData);
      return true;
    } catch (error) {
      console.error('Error updating club: ', error);
      if (error instanceof FirebaseError && error.code === 'permission-denied') {
        toast('You do not have permission to update clubs. Please contact support.');
      } else {
        toast('Failed to update club');
      }
      return false;
    }
  }
  
  // Function to delete a club from Firestore
  export async function deleteClub(clubId: string): Promise<boolean> {
    try {
      const clubRef = doc(db, 'clubs', clubId);
      await deleteDoc(clubRef);
      return true;
    } catch (error) {
      console.error('Error deleting club: ', error);
      if (error instanceof FirebaseError && error.code === 'permission-denied') {
        toast('You do not have permission to delete clubs. Please contact support.');
      } else {
        toast('Failed to delete club');
      }
      return false;
    }
  }
  
  // Function to fetch all clubs from Firestore
  export async function getAllClubs(): Promise<ClubData[]> {
    try {
      const querySnapshot = await getDocs(collection(db, 'clubs'));
      const clubs: ClubData[] = querySnapshot.docs.map(doc => {
        const data = doc.data() as ClubData;
        return {
          id: doc.id,
          name: data.name,
          location: data.location // Ensure location is included
        };
      });
      return clubs;
    } catch (error) {
      console.error('Error fetching clubs: ', error);
      toast('Failed to fetch clubs');
      return [];
    }
  }
  
// Function to fetch tribes from Firestore
export async function getTribes(): Promise<Tribe[]> {
    try {
        // Assuming 'tribes' is a collection in Firestore
        const querySnapshot = await getDocs(collection(db, 'tribes'));
        const tribes: Tribe[] = querySnapshot.docs.map(doc => {
            const data = doc.data() as Tribe;
            return {
                id: doc.id,
                name: data.name
            };
        });
        return tribes;
    } catch (error) {
        console.error('Error fetching tribes: ', error);
        toast('Failed to fetch tribes');
        return [];
    }
}
  

export interface Tribe {
    id: string;
    name: string;
}

export const tribes: Tribe[] = [
    { id: "1", name: "Asher" },
    { id: "2", name: "Dan" },
    { id: "3", name: "Judah" },
    { id: "4", name: "Reuben" },
    { id: "5", name: "Joseph" },
    { id: "6", name: "Naphtali" },
    { id: "7", name: "Issachar" },
    { id: "8", name: "Simeon" },
    { id: "9", name: "Benjamin" },
    { id: "10", name: "Gad" },
    { id: "11", name: "Zebulun" },
    { id: "12", name: "Levi" }
];


// Function to fetch members by clubId from Firestore
export async function getMembersByClubId(clubId: string): Promise<MemberData[]> {
    try {
      const membersQuery = query(collection(db, 'members'), where('clubId', '==', clubId));
      const querySnapshot = await getDocs(membersQuery);
      const members: MemberData[] = querySnapshot.docs.map(doc => {
        const data = doc.data();
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
          tribeId: data.tribeId,
          clubId: data.clubId
        };
      });
      return members;
    } catch (error) {
      console.error('Error fetching members by clubId: ', error);
      toast('Failed to fetch members');
      return [];
    }
  }
  


export const signOut = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  

export { db, auth, app };
