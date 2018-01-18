const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.notifyUser = functions.firestore
    .document('notes/{messageId}')
    .onCreate(event => { 
        const message = event.data.data();
        const userId = 'j2sPtwf6BpgjcbqNoZCD38oZaSP2'
        // Message details for end user
        const payload = {
            notification: {
                Room: 'Quote-Me!',
                title: 'there is a new quote for you:',
                // body: `sent you a new message`,
                body: `${message.content}`,
                icon: './assets/images/icons/PF-004.png'
            }
        }
        // ref to the parent document
        const db = admin.firestore()
        const userRef = db.collection('users').doc(userId)
        // get users tokens and send notifications
        return userRef.get()
            .then(snapshot => snapshot.data() )
            .then(user => {
                const tokens = user.fcmTokens ? Object.keys(user.fcmTokens) : []
                if (!tokens.length) {
                throw new Error('User does not have any tokens!')
                }
                return admin.messaging().sendToDevice(tokens, payload)
            })
            .catch(err => console.log(err) )
});

exports.notifyUser2 = functions.firestore
    .document('messages/{messageId}')
    .onCreate(event => {
        const message = event.data.data();
        const userId = message.rid
        // Message details for end user
        const payload = {
            notification: {
                title: 'Quote-Me!',
                body: `sent you a new message`,
                // body: `${message.senderId} sent you a new message`,
                icon: './assets/images/icons/PF-004.png'
            }
        }
        // ref to the parent document
        let tokens ="";
        const db = admin.firestore()
        let userRef = db.collection('users').doc("j2sPtwf6BpgjcbqNoZCD38oZaSP2")
        const notificationList = db.collection('notificationList').doc('SVZjOeqeIl0JiLqVRfPU');
        return notificationList.get()
            .then(snapshot => snapshot.data() )
            .then(obj => {
                obj.list.forEach(id=> {
                    console.log('id:'+id);
                    userRef = db.collection('users').doc(id);
                    // get users tokens and send notifications
                    return userRef.get()
                    .then(snapshot => snapshot.data() )
                    .then(user => {
                        tokens = user.fcmTokens ? Object.keys(user.fcmTokens) : []
                        if (!tokens.length) {
                        throw new Error('User: +'+user.displayName+'-'+id+' does not have any tokens!')
                        }
                        return admin.messaging().sendToDevice(tokens, payload)
                    })
                    .catch(err => console.log(err) )
                });
            })
            .catch(err => console.log(err) )   
});


// functions.https.onRequest((req, res) => {

exports.notifyUser3 = functions.https.onRequest((req, res) => {

        // const message = event.data.data();
        // const userId = message.rid
        // Message details for end user
        const payload = {
            notification: {
                title: 'Quote-Me!',
                body: `sent you a new message`,
                // body: `${message.senderId} sent you a new message`,
                icon: './assets/images/icons/PF-004.png'
            }
        }
        // ref to the parent document
        let tokens ="";
        const db = admin.firestore()
        let userRef = db.collection('users').doc("j2sPtwf6BpgjcbqNoZCD38oZaSP2")
        const notificationList = db.collection('notificationList').doc('SVZjOeqeIl0JiLqVRfPU');
        return notificationList.get()
            .then(snapshot => snapshot.data() )
            .then(obj => {
                obj.list.forEach(id=> {
                    console.log('id:'+id);
                    userRef = db.collection('users').doc(id);
                    // get users tokens and send notifications
                    return userRef.get()
                    .then(snapshot => snapshot.data() )
                    .then(user => {
                        tokens = user.fcmTokens ? Object.keys(user.fcmTokens) : []
                        if (!tokens.length) {
                        throw new Error('User: +'+user.displayName+'-'+id+' does not have any tokens!')
                        }
                        return admin.messaging().sendToDevice(tokens, payload)
                    })
                    .catch(err => console.log(err) )
                });
            })
            .catch(err => console.log(err) )   
});