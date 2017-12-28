export interface Note {
  content: string;
  hearts: number;
  id?: string;
  time: number;
  authorId?:string;
  authorName?:string;
}
