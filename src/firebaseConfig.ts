import { FirebaseError, initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc, query, where, getDoc, Timestamp, orderBy } from 'firebase/firestore';
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
    attended?: boolean;
    attendance?: { [date: string]: boolean };
}

export interface PostData {
  id: string;
  content: string;
  userId: string;
  createdAt: Timestamp;
  displayName: string;
  reactions?: {
      [userId: string]: 'thumbs-up' | 'heart' | 'laugh' | 'thumbs-down' | null; // Reaction type or null
  };
}


// Function to add or update reaction for a post
export const reactToPost = async (postId: string, userId: string, reaction: 'thumbs-up' | 'heart' | 'laugh' | 'thumbs-down') => {
  try {
      const postRef = doc(db, 'posts', postId);
      await updateDoc(postRef, {
          [`reactions.${userId}`]: reaction
      });
      return true;
  } catch (error) {
      console.error('Error reacting to post:', error);
      return false;
  }
};

// Function to get reactions for a post
export const getPostReactions = async (postId: string): Promise<{ [userId: string]: 'thumbs-up' | 'heart' | 'laugh' | 'thumbs-down' | null }> => {
  try {
      const postRef = doc(db, 'posts', postId);
      const postDoc = await getDoc(postRef);
      if (postDoc.exists()) {
          const data = postDoc.data() as PostData;
          return data.reactions || {};
      }
      return {};
  } catch (error) {
      console.error('Error fetching post reactions:', error);
      return {};
  }
};



export const getNewPosts = async (lastTimestamp: Timestamp): Promise<PostData[]> => {
  try {
      const postsRef = collection(db, 'posts');
      const q = query(
          postsRef,
          where('createdAt', '>', lastTimestamp),
          orderBy('createdAt', 'asc')
      );

      const querySnapshot = await getDocs(q);
      const newPosts: PostData[] = [];
      querySnapshot.forEach((doc) => {
          newPosts.push({ id: doc.id, ...doc.data() } as PostData);
      });

      return newPosts;
  } catch (error) {
      console.error('Error fetching new posts:', error);
      return [];
  }
};

export const addPost = async (post: Omit<PostData, 'id'>) => {
  try {
      const docRef = await addDoc(collection(db, 'posts'), {
          ...post,
          createdAt: Timestamp.now(),
      });
      return !!docRef.id;
  } catch (error) {
      console.error('Error adding post:', error);
      return false;
  }
};

export const getAllPosts = async (): Promise<PostData[]> => {
  const posts: PostData[] = [];
  try {
      const querySnapshot = await getDocs(collection(db, 'posts'));
      querySnapshot.forEach((doc) => {
          posts.push({ id: doc.id, ...doc.data() } as PostData);
      });
  } catch (error) {
      console.error('Error getting posts:', error);
  }
  return posts;
};

// Delete a post
export const deletePost = async (postId: string) => {
  try {
      await deleteDoc(doc(db, 'posts', postId));
      return true;
  } catch (error) {
      console.error('Error deleting post:', error);
      return false;
  }
};

// Update a post
export const updatePost = async (postId: string, updatedData: Partial<PostData>) => {
  try {
      const postRef = doc(db, 'posts', postId);
      await updateDoc(postRef, updatedData);
      return true;
  } catch (error) {
      console.error('Error updating post:', error);
      return false;
  }
};


// Function to add a new member to Firestore
export async function addMember(memberData: Omit<MemberData, 'id'>): Promise<boolean> {
    try {
        // Add the document and get the document reference
        const docRef = await addDoc(collection(db, 'members'), memberData);
        
        // Update the document with the generated ID
        await updateDoc(docRef, { id: docRef.id });

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
        if (!memberId) {
            console.error('Member ID is invalid.');
            return false;
        }
        const memberRef = doc(db, 'members', memberId);
        console.log('Deleting member with reference:', memberRef.path); // Log the path
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
    id?: string; 
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

  // Function to fetch club by ID from Firestore
export async function getClubById(clubId: string): Promise<ClubData | undefined> {
  try {
      const clubDoc = await getDoc(doc(db, 'clubs', clubId));
      if (clubDoc.exists()) {
          const clubData = clubDoc.data() as ClubData;
          return {
              id: clubDoc.id,
              name: clubData.name,
              location: clubData.location
          };
      } else {
          console.error(`Club with ID ${clubId} not found`);
          return undefined;
      }
  } catch (error) {
      console.error(`Error fetching club with ID ${clubId}: `, error);
      return undefined;
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

// Function to mark attendance for a member on a specific date
export async function markAttendance(memberId: string, date: string, attended: boolean): Promise<boolean> {
  try {
      const memberRef = doc(db, 'members', memberId);
      // Update the member document to set attendance for the specified date
      await updateDoc(memberRef, { [`attendance.${date}`]: attended });
      return true;
  } catch (error) {
      console.error('Error marking attendance: ', error);
      return false;
  }
}

// Function to get attendance records for a specific date
export async function getAttendanceByDate(clubId: string, date: string): Promise<MemberData[]> {
  try {
      const membersQuery = query(collection(db, 'members'), where('clubId', '==', clubId));
      const querySnapshot = await getDocs(membersQuery);
      const members: MemberData[] = querySnapshot.docs.map(doc => {
          const data = doc.data() as MemberData;
          return {
              ...data,
              id: doc.id,
              attended: data.attendance && data.attendance[date] === true
          };
      });
      return members;
  } catch (error) {
      console.error('Error fetching attendance records: ', error);
      return [];
  }
}

// Function to fetch all dates for which there are attendance records
export async function getAllAttendanceDates(clubId: string): Promise<string[]> {
  try {
      const membersQuery = query(collection(db, 'members'), where('clubId', '==', clubId));
      const querySnapshot = await getDocs(membersQuery);
      const dates: Set<string> = new Set();
      querySnapshot.forEach(doc => {
          const data = doc.data() as MemberData;
          if (data.attendance) {
              Object.keys(data.attendance).forEach(date => dates.add(date));
          }
      });
      return Array.from(dates);
  } catch (error) {
      console.error('Error fetching attendance dates: ', error);
      return [];
  }
}

// Function to delete all dummy accounts from Firestore
export async function deleteDummyAccounts() {
  try {
      const querySnapshot = await getDocs(collection(db, 'members'));

      // Array to store promises for deletion
      const deletePromises: Promise<void>[] = [];

      // Iterate over each document in the collection
      querySnapshot.forEach(doc => {
          const data = doc.data();
          // Check if it's a dummy account (example criteria: no name)
          if (!data.name) {
              // Add delete operation to array of promises
              deletePromises.push(deleteDoc(doc.ref));
              console.log(`Deleted dummy account with id ${doc.id}`);
          }
      });

      // Wait for all delete operations to complete
      await Promise.all(deletePromises);

      console.log("All dummy accounts deleted successfully");
  } catch (error) {
      console.error('Error deleting dummy accounts: ', error);
      
  }
}

// Call the function to delete dummy accounts
deleteDummyAccounts()
  .then(() => {
      console.log("Dummy accounts cleanup complete");
      // Perform any additional actions after cleanup if needed
  })
  .catch(error => {
      console.error("Error cleaning up dummy accounts: ", error);
  });
  

  // Function to get a member by ID
export const getMemberById = async (id: string): Promise<MemberData | null> => {
    try {
      const memberRef = doc(db, "members", id);
      const docSnap = await getDoc(memberRef);
      if (docSnap.exists()) {
        return docSnap.data() as MemberData;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error fetching member:", error);
      return null;
    }
  };


export const signOut = async () => {
    try {
      await auth.signOut();
      // Clear any persisted user data
      localStorage.removeItem('firebase:authUser'); // Clear Firebase auth user from local storage if using persistence
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

export { db, auth, app };
