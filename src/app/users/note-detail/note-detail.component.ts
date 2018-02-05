import { Component, Input } from '@angular/core';
// import { ActivatedRoute} from '@angular/router';

import { FeedService } from '../../feed/feed.service';

import { Note } from '../../feed/note-model';

import { AppRoutingModule } from '../../app-routing.module';



@Component({
    selector: 'note-detail',
    templateUrl: './note-detail.component.html',
    styleUrls: ['./note-detail.component.scss'],
    host: {
    '(window:resize)': 'onResize($event)'
    },
})
export class NoteDetailComponent {

    @Input()
    note: Note;
    likeShowNum;
    mobile:boolean;
    constructor(private noteService: FeedService,
    ) {this.likeShowNum=3}

    //add Heart To a Note (aka like)
    addHeartToNote(val: number) {
        if (this.note.id && this.note.authorId) {
            // this.noteService.updateNote(this.note.id, { hearts: val + 1 },this.note.authorId);
            this.addToHeartlist(this.note.id, this.note.authorId, val)
        } else {
            console.error('Note missing ID!');
        }
    }
    //use for changeing view if mobile or not
    ngOnInit() {
    if (window.innerWidth < 1022) { // 768px portrait
        this.mobile = true;
     }
     else
        this.mobile = false;
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

    //add users uids and display names to note like list
    addToHeartlist(Nid, authorId, val) {

        //add to notificationList
        const CNote = this.noteService.getNote(Nid, authorId)
        const CUid = this.noteService.getCurrentUid();
        const CName = this.noteService.getCurrentName();
        let subList2 = [CUid];
        CNote.valueChanges().take(1).forEach(n => {
        
            if (!n.heartsList || !n.heartsListNames)
                //  this.afs.doc<Note>(`users/${authorId}/notes/${Nid}`);
                this.noteService.updateNote(Nid, {
                    hearts: val + 1,
                    heartsList: [CUid],
                    heartsListNames: [CName]
                }, authorId);
            else if (n.heartsList)
                if (n.heartsList.indexOf(CUid) == -1 && n.heartsListNames.indexOf(CName) == -1) {
                    n.heartsList.push(CUid)
                    n.heartsListNames.push(CName)
                    this.noteService.updateNote(Nid, {
                        hearts: val + 1,
                        heartsList: n.heartsList,
                        heartsListNames: n.heartsListNames
                    }, authorId);
                } else
                    console.log('you allrady liked this quote')

        });

    }

    //show like list on mouse hover 
    mouseEnter(div: string) {
        var likes = document.getElementById(div);
        if (typeof likes !== "undefined" && likes) {
            likes.style.display = 'inline'
        }
    }
    mouseLeave(div: string) {
        var likes = document.getElementById(div);
        if (typeof likes !== "undefined" && likes) {
            likes.style.display = 'none'

        }
    }

        //show like list on mouse hover 
    mouseEnter1(div: string) {
        console.log(div)
        var likes = document.getElementById(div);
        if (typeof likes !== "undefined" && likes) {
            likes.style.display = 'inline'
        }
    }
    mouseLeave1(div: string) {
        var likes = document.getElementById(div);
        if (typeof likes !== "undefined" && likes) {
            likes.style.display = 'none'

        }
    }

    //delete selected note
    deleteNote(id: string) {
        if (id && this.note.authorId)
            this.noteService.deleteNote(id, this.note.authorId);
        else
            console.error('Note missing ID!');
    }

    show = false;

    toggleCollapse() {
        this.show = !this.show;
     }



}