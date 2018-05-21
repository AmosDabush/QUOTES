export interface User {
  uid: string;
  email?: string | null;
  photoURL?: string;
  displayName?: string;
  discription?: string;
  friendReq?:string[];
  followList?:string[];
  friendsList?:string[];
  
}
