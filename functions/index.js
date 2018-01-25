const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
    let tmpArry = [];

// exports.notifyUser = functions.firestore
//     .document('notes/{messageId}')
//     .onCreate(event => {
//         const message = event.data.data();
//         const userId = 'j2sPtwf6BpgjcbqNoZCD38oZaSP2'
//         // Message details for end user
//         const payload = {
//             notification: {
//                 Room: 'Quote-Me!',
//                 title: 'there is a new quote for you:',
//                 // body: `sent you a new message`,
//                 body: `${message.content}`,
//                 icon: './assets/images/icons/PF-004.png'
//             }
//         }
//         // ref to the parent document
//         const db = admin.firestore()
//         const userRef = db.collection('users').doc(userId)
//         // get users tokens and send notifications
//         return userRef.get()
//             .then(snapshot => snapshot.data())
//             .then(user => {
//                 const tokens = user.fcmTokens ? Object.keys(user.fcmTokens) : []
//                 if (!tokens.length) {
//                     throw new Error('User does not have any tokens!')
//                 }
//                 return admin.messaging().sendToDevice(tokens, payload)
//             })
//             .catch(err => console.log(err))
//     });

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
        let tokens = "";
        const db = admin.firestore()
        let userRef = db.collection('users').doc("j2sPtwf6BpgjcbqNoZCD38oZaSP2")
        const notificationList = db.collection('notificationList').doc('SVZjOeqeIl0JiLqVRfPU');
        return notificationList.get()
            .then(snapshot => snapshot.data())
            .then(obj => {
                obj.list.forEach(id => {
                    console.log('id:' + id);
                    userRef = db.collection('users').doc(id);
                    // get users tokens and send notifications
                    return userRef.get()
                        .then(snapshot => snapshot.data())
                        .then(user => {
                            tokens = user.fcmTokens ? Object.keys(user.fcmTokens) : []
                            if (!tokens.length) {
                                throw new Error('User: +' + user.displayName + '-' + id + ' does not have any tokens!')
                            }
                            return admin.messaging().sendToDevice(tokens, payload)
                        })
                        .catch(err => console.log(err))
                });
            })
            .catch(err => console.log(err))
    });


exports.notifyUser3 = functions.https.onRequest((req, res) => {
    let currentHour = new Date().getHours();
    let currentDay = new Date().getDay();
    let currentList = 'list-' + currentDay + '-' + currentHour;
    console.log(currentList);
    let tmpArry = [];
    var contentD = "";
    let flag = 0;

    // ref to the parent document
    let tokens = "";
    const db = admin.firestore()
    let userRef = "";
    // const notificationList = db.collection('notificationList').doc('SVZjOeqeIl0JiLqVRfPU');
    const notificationList = db.collection('notificationList').doc("list-4-20");

    return notificationList.get()
        .then(snapshot => snapshot.data())
        .then(obj => {
            obj.list.forEach(id => {
                console.log('id:' + id);
                userRef = db.collection('users').doc(id);

                // get users tokens and send notifications
                return userRef.get()
                    .then(snapshot => snapshot.data())
                    .then(user => {
                        tokens = user.fcmTokens ? Object.keys(user.fcmTokens) : []
                        if (!tokens.length) {
                            throw new Error('User: +' + user.displayName + '-' + id + ' does not have any tokens!')
                        }
                        // userRef.update({lastNotifyQuote:"123123123123123999"});
                        console.log('contentDzzzzzzzzzz: ' + user.displayName + '-' + user.lastNotifyQuote)

                        // Message details for end user
                        let payload = {
                            notification: {
                                title: 'Quote-Me!',
                                // body: `sent you a new message`,
                                body: `${user.lastNotifyQuote}`,
                                icon: './assets/images/icons/PF-004.png'
                            }
                        }
                        return admin.messaging().sendToDevice(tokens, payload)
                    })
                    .catch(err => console.log(err))
            });
        })
        .catch(err => console.log(err))
});


exports.notifyUser4 = functions.https.onRequest((req, res) => {
    let currentHour = new Date().getHours();
    let currentDay = new Date().getDay();
    let currentList = 'list-' + currentDay + '-' + currentHour;
    let tmpArry = [];
    var contentD = "";

    let tokens = "";
    const db = admin.firestore()
    let userRef = "";

    // ref to the parent document
    const usersRef = db.collection('users');
    usersRef.get().then((querySnapshot) => {
            querySnapshot.forEach((otherUser) => {
                console.log(otherUser.id, " => ", otherUser.data().displayName);

                // const notificationList = db.collection('notificationList').doc('SVZjOeqeIl0JiLqVRfPU');
                const notificationList = db.collection('notificationList').doc("list-4-20");

                return notificationList.get()
                    .then(snapshot => snapshot.data())
                    .then(obj => {
                        obj.list.forEach(id => {
                            console.log('id:' + id);
                            userRef = db.collection('users').doc(id);
                            let flag = 0;
                            // get users tokens and send notifications
                            return userRef.get()
                                .then(snapshot => snapshot.data())
                                .then(user => {
                                    let userQuotes = db.collection('users').doc(otherUser.id).collection('notes') //.orderBy('random')//.limit(1);
                                    return userQuotes.get().then((querySnapshot) => {
                                        querySnapshot.forEach((doc) => {
                                            console.log(doc.id, " => ", doc.data().content);
                                            tmpArry.push(doc.data().content);
                                            console.log(tmpArry);
                                            if (flag == 0) {
                                                console.log('====>' + id + "===>")
                                                userRef.update({
                                                    lastNotifyQuote: tmpArry[0]
                                                    // lastNotifyQuote: doc.data().content
                                                });
                                                contentD += doc.data().content;
                                                console.log('cD == ' + contentD)
                                                if (contentD != "") {
                                                    flag = 1;
                                                }
                                            }
                                        });
                                    });
                                });
                        });

                    })
                    .catch(err => console.log(err))
            });
        })
        .catch(err => console.log(err))
});




//good===============================================================================================

exports.notifyUser5 = functions.https.onRequest((req, res) => {
    let currentHour = new Date().getHours();
    let currentDay = new Date().getDay();
    let currentList = 'list-' + currentDay + '-' + currentHour;
    // let tmpArry = [];
    var contentD = "";

    let tokens = "";
    const db = admin.firestore()
    // Get a new write batch
    var batch = db.batch();
    let userRef = "";
    // ref to the parent document   
    const notificationList = db.collection('notificationList').doc("Nlist-1-00");
    return notificationList.get()
        .then(snapshot => snapshot.data())
        .then(obj => {
            obj.list.forEach(id => { //for each user in this notification list
                console.log('id:' + id);
                userRef = db.collection('users').doc(id);
                return new Promise(function() {
                    updateLastQuote2(userRef);
                });
            });
        })
        .catch(err => console.log(err))
});


function updateLastQuote(content, userRef) {
    userRef.update({
        lastNotifyQuote: content
    });
    //   tmpArry.push(content);

}

function updateLastQuote2(userRef) {
    const db = admin.firestore()
    var contentD = "";
    let flag = 0;
    // get users tokens and send notifications
    return userRef.get()
        .then(snapshot => snapshot.data())
        .then(user => {
            const usersRef = db.collection('users'); //all users ref
            usersRef.get().then((querySnapshot) => {
                querySnapshot.forEach((otherUser) => { //for each user from all users
                    // console.log(otherUser.id, " => ", otherUser.data().displayName);
                    let userQuotes = db.collection('users').doc(otherUser.id).collection('notes') //.orderBy('random')//.limit(1);
                    return userQuotes.get().then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                            // console.log(doc.id, " => ", doc.data().content);
                            tmpArry.push(doc.data().content);
                            // console.log(tmpArry);
                            return new Promise(function() {
                                updateLastQuote(doc.data().content, userRef);
                            });

                        });
                    });
                });               
                    
            });
            return new Promise(function() {
                notifyUserT(userRef);
            });
        })
        .catch(err => console.log(err))
}

function notifyUserT(userRef) {
    console.log("notifyUserT userRef.id:" + userRef.id);
    let tokens = "";
    // get users tokens and send notifications
    return userRef.get()
        .then(snapshot => snapshot.data())
        .then(user => {
            tokens = user.fcmTokens ? Object.keys(user.fcmTokens) : []
            if (!tokens.length) {
                throw new Error('User: +' + user.displayName + '-' + id + ' does not have any tokens!')
            }
           
            // console.log('contentDzzzzzzzzzz: ' + user.displayName + '-' + user.lastNotifyQuote)
             var rand = tmpArry[Math.floor(Math.random() * tmpArry.length)];       
                        
                            console.log('1----------------------------------------');
                            console.log(tmpArry);
                            console.log('rand: '+rand);

                            console.log('-----------------------------------------');
            // Message details for end user
            let payload = {
                notification: {
                    title: 'Quote-Me!',
                    body: `${user.lastNotifyQuote}`,
                    // body: `${rand}`,
                    icon: './assets/images/icons/PF-004.png'
                }
            }
            return admin.messaging().sendToDevice(tokens, payload)
        })
        .catch(err => console.log(err))
};