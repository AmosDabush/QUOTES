import { Component, Input } from '@angular/core';

import { NoteService } from '../note.service';

import { Note } from '../note-model';

@
Component({
    selector: 'note-detail',
    templateUrl: './note-detail.component.html',
    styleUrls: ['./note-detail.component.scss'],
    host: {
    '(window:resize)': 'onResize($event)'
    },
})
export class NoteDetailComponent {

    @
    Input()
    note: Note;
    likeShowNum;
    mobile:boolean;
    editContent: string;

    constructor(private noteService: NoteService) {this.likeShowNum=3}

    //use for changeing view if mobile or not
    ngOnInit() {
    if (window.innerWidth < 1022) { // 768px portrait
        this.mobile = true;
     }
     else
        this.mobile = false;

    this.editContent=this.note.content   
    }

    //use for changeing view if mobile or not 
    onResize(event){
        event.target.innerWidth;
            if (window.innerWidth < 1022) { 
        this.mobile = true;
     }
     else
        this.mobile = false;
    }







    //add Heart To a Note (aka like)
    addHeartToNote(val: number) {
        if (this.note.id && this.note.authorId) {
            console.log("this.note.authorId" + this.note.authorId)

            // this.noteService.updateNote(this.note.id, { hearts: val + 1 },this.note.authorId);
            this.addToHeartlist(this.note.id, this.note.authorId, val)
        } else {
            console.error('Note missing ID!');
        }
    }


    //add users uids and display names to note like list
    addToHeartlist(Nid, authorId, val) {
        //add to notificationList
        const CNote = this.noteService.getNote2(Nid, authorId)
        const CUid = this.noteService.getCurrentUid();
        const CName = this.noteService.getCurrentName();
        let subList2 = [CUid];
        CNote.valueChanges().take(1).forEach(n => {

            if (!n.heartsList || !n.heartsListNames)
                this.noteService.updateNote2(Nid, {
                    hearts: val + 1,
                    heartsList: [CUid],
                    heartsListNames: [CName]
                }, authorId);
            else if (n.heartsList)
                if (n.heartsList.indexOf(CUid) == -1 && n.heartsListNames.indexOf(CName) == -1) {
                    n.heartsList.push(CUid)
                    n.heartsListNames.push(CName)
                    this.noteService.updateNote2(Nid, {
                        hearts: val + 1,
                        heartsList: n.heartsList,
                        heartsListNames: n.heartsListNames
                    }, authorId);
                } else
                    console.log('you allrady liked this quote')

        });

    }

    deleteNote(id: string) {
        this.noteService.deleteNote(id);
    }
    
    editNote() {
        // this.noteService.updateNote2(id,data,nid);
       if (this.note.id && this.note.authorId) {
            console.log("this.note.authorId" + this.note.authorId)

               this.noteService.updateNote2(this.note.id, {
                  content: this.editContent
                }, this.note.authorId);

        } else {
            console.error('Note missing ID!');
        }
    }


    editToggle(){
        var edit = document.getElementById('editText'+this.note.id);
        var quoteText = document.getElementById('quoteText'+this.note.id);

        if (typeof edit !== "undefined" && edit && typeof quoteText !== "undefined" && quoteText) {
           if(edit.style.display=="none"){
                edit.style.display = 'inline'
                quoteText.style.display = 'none'
        }
           else{
                edit.style.display = 'none'
                quoteText.style.display = 'inline'

            }
        }
     
    }

    //show like list while mouse hover 
    mouseEnter(div: string) {
        var likes = document.getElementById(div);
        if (typeof likes !== "undefined" && likes) {
            likes.style.display = 'inline-table'
        }
    }
    mouseLeave(div: string) {
        this.wait(100)
        var likes = document.getElementById(div);
        if (typeof likes !== "undefined" && likes) {
            likes.style.display = 'none'

        }
    }

wait(ms){
   var start = new Date().getTime();
   var end = start;
   while(end < start + ms) {
     end = new Date().getTime();
  }
}

}