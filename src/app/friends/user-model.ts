export interface User {
  uid: string;
  email?: string | null;
  photoURL?: string;
  displayName?: string;
  discription?: string;
  followList?:string[];
  friendsList?:string[];
}
