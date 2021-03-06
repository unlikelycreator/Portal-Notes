var config = {
    apiKey: "AIzaSyBbio5-pAmZmSP0p1WGt_uUAX8qvcM01p0",
    authDomain: "portalnotes-d3c35.firebaseapp.com",
    databaseURL: "https://portalnotes-d3c35.firebaseio.com",
    projectId: "portalnotes-d3c35",
    storageBucket: "portalnotes-d3c35.appspot.com",
    messagingSenderId: "554658502583",
    appId: "1:554658502583:web:0b41244dbf972bfde53a32",
    measurementId: "G-TR9560B0YJ"
};


firebase.initializeApp(config);
var db = firebase.database();

// CREATE REWIEW
firebase.auth().onAuthStateChanged(function(user) {
    var user = firebase.auth().currentUser;
    if (user) {

        var uid = user.uid;
        var reviewForm = document.getElementById('reviewForm');
        var fullName = document.getElementById('fullName');
        var message = document.getElementById('message');
        var hiddenId = document.getElementById('hiddenId');

        reviewForm.addEventListener('submit', (e) => {
            e.preventDefault();

            if (!fullName.value || !message.value) return null

            var id = hiddenId.value || Date.now()

            db.ref(uid + '/notes/' + id).set({
                fullName: fullName.value,
                message: message.value
            });
            fullName.value = '';
            message.value = '';
            hiddenId.value = '';
        });


        // READ REVEIWS

        var reviews = document.getElementById('reviews');
        var reviewsRef = db.ref(uid + '/notes/');

        reviewsRef.on('child_added', (data) => {
            var li = document.createElement('li')
            li.id = data.key;
            li.innerHTML = reviewTemplate(data.val())
            reviews.appendChild(li);
        });

        reviewsRef.on('child_changed', (data) => {
            var reviewNode = document.getElementById(data.key);
            reviewNode.innerHTML = reviewTemplate(data.val());
        });

        reviewsRef.on('child_removed', (data) => {
            var reviewNode = document.getElementById(data.key);
            reviewNode.parentNode.removeChild(reviewNode);
        });

        reviews.addEventListener('click', (e) => {
            var reviewNode = e.target.parentNode

            // UPDATE REVEIW
            if (e.target.classList.contains('edit')) {
                fullName.value = reviewNode.querySelector('.fullName').innerText;
                message.value = reviewNode.querySelector('.message').innerText;
                hiddenId.value = reviewNode.id;
            }

            // DELETE REVEIW
            if (e.target.classList.contains('delete')) {
                var id = reviewNode.id;
                db.ref(uid + '/notes/' + id).remove();
            }
        });

        function reviewTemplate({ fullName, message }) {
            return `
                <div class='fullName'>${fullName}</div>
                <div class='message'>${message}</div>
                <button class='delete'>Delete</button>
                <button class='edit'>Edit</button>
            `
        };

    } else {
        // No user is signed in.
    }
});