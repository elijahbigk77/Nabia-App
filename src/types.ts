import { Timestamp } from "firebase/firestore";

export interface Comment {
    id: string;
    content: string;
    userId: string;
    displayName: string;
    createdAt: Timestamp;
}