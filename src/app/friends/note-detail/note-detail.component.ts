import { Component, Input } from '@angular/core';
import { ActivatedRoute} from '@angular/router';

import { FeedService } from '../../feed/feed.service';
import { Note } from '../../feed/note-model';
import { AppRoutingModule } from '../../app-routing.module';


@Component({
  selector: 'note-detail',
  templateUrl: './note-detail.component.html',
  styleUrls: ['./note-detail.component.scss'],
})
export class NoteDetailComponent {

  @Input()
  note: Note;

  constructor(private noteService: FeedService,
              private route:ActivatedRoute,
              ) { }

  addHeartToNote2(val: number) {
    if (this.note.id&&this.note.authorId) {
            console.log("this.note.authorId"+this.note.authorId)

      this.noteService.updateNote(this.note.id, { hearts: val + 1 },this.note.authorId);
    } else {
      console.error('Note missing ID!');
    }
  }
  addHeartToNote(val: number) {
    if (this.note.id&&this.note.authorId) {
            console.log("this.note.authorId"+this.note.authorId)

      // this.noteService.updateNote(this.note.id, { hearts: val + 1 },this.note.authorId);
      this.addToHeartlist(this.note.id,this.note.authorId,val)
    } else {
      console.error('Note missing ID!');
    }
  }



addToHeartlist(Nid,authorId,val){

    //add to notificationList
      // const CNote = this.afs.doc<Note>(`users/'${authorId}'/notes/'${Nid}'`).valueChanges().take(1);
      const CNote = this.noteService.getNote(Nid,authorId)
      const CUid=this.noteService.getCurrentUid();
      const CName=this.noteService.getCurrentName();
      let subList2=[CUid];
      CNote.valueChanges().take(1).forEach(n => {
         if(!n.heartsList||!n.heartsListNames)
            //  this.afs.doc<Note>(`users/${authorId}/notes/${Nid}`);
          this.noteService.updateNote(Nid, { hearts: val + 1 ,heartsList:[CUid],heartsListNames:[CName]},authorId);
          else if(n.heartsList) 
          if(n.heartsList.indexOf(CUid) == -1 &&n.heartsListNames.indexOf(CName) == -1){
                  n.heartsList.push(CUid)
                  n.heartsListNames.push(CName)
                  this.noteService.updateNote(Nid, {hearts: val + 1 ,heartsList:n.heartsList,heartsListNames:n.heartsListNames},authorId);
        }else
        console.log('you allrady liked this quote')
     
    });

}



  uc1() {
    if (this.note.id&&this.note.authorId) {
      this.noteService.updateNote(this.note.id, { content: "val + 1 "},this.note.authorId);
    } else {
      console.error('Note missing ID!');
    }
  }

  deleteNote(id: string) {
    if (id && this.note.authorId)
        this.noteService.deleteNote(id,this.note.authorId);
    else 
      console.error('Note missing ID!');
  }

}
