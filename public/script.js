// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.4/firebase-app.js";
import * as rtdb from "https://www.gstatic.com/firebasejs/9.9.4/firebase-database.js";
import { getAuth, signInWithRedirect, getRedirectResult, GoogleAuthProvider, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.9.4/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDOBt13oKM9pAevMOwXMGfw4vHbTszSABM",
  authDomain: "twitter-fc080.firebaseapp.com",
  databaseURL: "https://twitter-fc080-default-rtdb.firebaseio.com",
  projectId: "twitter-fc080",
  storageBucket: "twitter-fc080.appspot.com",
  messagingSenderId: "882494812250",
  appId: "1:882494812250:web:b5fe4054d2cfb817592863"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
let db = rtdb.getDatabase(app);

const provider = new GoogleAuthProvider();
const auth = getAuth();

$(document).ready(function(){
  let paths = document.location.pathname.split('/');
  let subapp = paths[1];
  switch (subapp){
    case "login":
        renderLogin();
        break;
    case "home":
        renderHome();
      break;
    case "users":
      renderUsers();
      break;
    default:
      renderHome();
  }
})

var loggedUser;
let userRef = rtdb.ref(db, "/users");

let renderLogin = ()=>{
  $("#main").html("");
  $("#main").append(`
    <button id="loginButton">Sign in/Sign up with Google</button>
  `);
  $("#loginButton").on("click", ()=>{
    signInWithRedirect(auth, provider);
    getRedirectResult(auth)
  .then((result) => {
    // This gives you a Google Access Token. You can use it to access Google APIs.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    // The signed-in user info.
    const user = result.user;
    onAuthStateChanged(auth, user);
    
  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    // ...
  });
  
  })
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    const uid = user.uid;
    // ...
    $(".container").show();
    //renderHome();
    loggedUser=user;
    writeUser(user);
  } else {
    // User is signed out
    // ...
    $(".container").hide();
    renderLogin();
  }
});


let writeUser = (newUser)=>{
  let newUsr = rtdb.ref(db, "users/"+newUser.uid);
  userJSON.nickname=newUser.email.substr(0, loggedUser.email.indexOf('@'));
  rtdb.set(newUsr, userJSON).catch(error => {
    console.log(error.message)});
}

let userJSON={
  nickname:""
}

let renderHome = ()=>{
  $("#main").html("");
  $("#main").append(`
  <header class="p-3 text-bg-dark">
    <div class="container">
      <div class="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
        <a href="/" class="d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none">
          <svg class="bi me-2" width="40" height="32" role="img" aria-label="Bootstrap"><use xlink:href="#bootstrap"/></svg>
        </a>

        <ul class="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
          <li><a href="/home" class="nav-link px-2 text-secondary">Home</a></li>
          <li><a href="/profile" class="nav-link px-2 text-white">Profile</a></li>
          <li><a href="/users" class="nav-link px-2 text-white">Users</a></li>
        </ul>

        <div class="text-end">
          <button type="button" id="signOutButton" class="btn btn-warning">Sign-out</button>
        </div>
      </div>
    </div>
  </header>
  <div class="container text-center">
  <div class="row align-items-top">
    <div class="col">
      One of three columns
    </div>
    <div class="col">
      <div class="wrapper">
        <div class="input-box">
          <div class="tweet-area">
            <span class="placeholder">Wassup?</span>
            <div class="input editable" contenteditable="true" spellcheck="false"></div>
            <div class="input readonly" contenteditable="true" spellcheck="false"></div>
          </div>
        </div>
        <div id="tweetBottom" class="bottom">
          <ul class="icons">
            <li><i class="uil uil-capture"></i></li>
            <li><i class="far fa-file-image"></i></li>
            <li><i class="fas fa-map-marker-alt"></i></li>
            <li><i class="far fa-grin"></i></li>
            <li><i class="far fa-user"></i></li>
          </ul>
          <div class="content">
            <span class="counter">100</span>
            <button id="submitButton">Cluck</button>
          </div>
        </div>
      </div>
      <div id="tweetsBoard">
      </div>

    </div>
    <div class="col">
      One of three columns
    </div>
  </div>
</div>
</div>
  `);
  homeListiners();
}




let tweetJSON = {
  "content": "",
  "likes": 0,
  "timestamp": Date.now(),
  "author": {
    "id": "",
    "pic":
      "https://www.kindpng.com/picc/m/30-301622_hen-png-images-hen-png-transparent-png.png"
  }
};

let usrRef = rtdb.ref(db, "users/");
var users=[];
  rtdb.get(usrRef).then(ss=>{
    ss.forEach(childss =>{
      users.push(childss);
    })
    users.forEach((i)=>{
      $(`#usersList`).append(`<div data-uuid="${i.key}">${i.val().nickname}</div>`);
    });
  })

let renderUsers = ()=>{
  $("#main").html("");
  $('#main').append(`
    <div id="usersList"></div>
  `);
  
}



let renderTweet = (tObj, uuid) => {
  $("#tweetsBoard").prepend(`
    <div class="wrapper" data-uuid="${uuid}">
      <div class="tweet-box">
        <div class="user">@${tObj.author.id}</div>
        <div class="tweet-area">
          ${tObj.content}
        </div>
      </div>
      <div class="bottom">
        <div>
          <button id="like" class="likeButton" data-uuid="${uuid}">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" id="heart" class="bi bi-balloon-heart" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="m8 2.42-.717-.737c-1.13-1.161-3.243-.777-4.01.72-.35.685-.451 1.707.236 3.062C4.16 6.753 5.52 8.32 8 10.042c2.479-1.723 3.839-3.29 4.491-4.577.687-1.355.587-2.377.236-3.061-.767-1.498-2.88-1.882-4.01-.721L8 2.42Zm-.49 8.5c-10.78-7.44-3-13.155.359-10.063.045.041.089.084.132.129.043-.045.087-.088.132-.129 3.36-3.092 11.137 2.624.357 10.063l.235.468a.25.25 0 1 1-.448.224l-.008-.017c.008.11.02.202.037.29.054.27.161.488.419 1.003.288.578.235 1.15.076 1.629-.157.469-.422.867-.588 1.115l-.004.007a.25.25 0 1 1-.416-.278c.168-.252.4-.6.533-1.003.133-.396.163-.824-.049-1.246l-.013-.028c-.24-.48-.38-.758-.448-1.102a3.177 3.177 0 0 1-.052-.45l-.04.08a.25.25 0 1 1-.447-.224l.235-.468ZM6.013 2.06c-.649-.18-1.483.083-1.85.798-.131.258-.245.689-.08 1.335.063.244.414.198.487-.043.21-.697.627-1.447 1.359-1.692.217-.073.304-.337.084-.398Z"/>
        </svg>
          </button>
          <button id="like" class="unlikeButton hidden" data-uuid="${uuid}" >
          <svg  xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" id="heart" class="bi bi-balloon-heart-fill" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M8.49 10.92C19.412 3.382 11.28-2.387 8 .986 4.719-2.387-3.413 3.382 7.51 10.92l-.234.468a.25.25 0 1 0 .448.224l.04-.08c.009.17.024.315.051.45.068.344.208.622.448 1.102l.013.028c.212.422.182.85.05 1.246-.135.402-.366.751-.534 1.003a.25.25 0 0 0 .416.278l.004-.007c.166-.248.431-.646.588-1.115.16-.479.212-1.051-.076-1.629-.258-.515-.365-.732-.419-1.004a2.376 2.376 0 0 1-.037-.289l.008.017a.25.25 0 1 0 .448-.224l-.235-.468ZM6.726 1.269c-1.167-.61-2.8-.142-3.454 1.135-.237.463-.36 1.08-.202 1.85.055.27.467.197.527-.071.285-1.256 1.177-2.462 2.989-2.528.234-.008.348-.278.14-.386Z"/>
            </svg> 
          
          </button>
            <div class="noLikes" data-uuid="${uuid}">
              ${tObj.likes}
            </div>
        </div>
      </div>
   </div>
   `);


   let likeref = rtdb.ref(db, `tweets/${uuid}/likes`);
   rtdb.onValue(likeref, ss=>{
    $(`[data-uuid=${uuid}].noLikes`).html(`${ss.val()}`);
   })
   let likeUserRef = rtdb.ref(db, `likes/${uuid}/${loggedUser.uid}`);
   rtdb.onValue(likeUserRef, ss=>{
    let liked = ss.val();
    if(liked){
      $(`[data-uuid=${uuid}].likeButton`).addClass("hidden");
      $(`[data-uuid=${uuid}].unlikeButton`).removeClass("hidden");
    }
    else{
      $(`[data-uuid=${uuid}].likeButton`).removeClass("hidden");
      $(`[data-uuid=${uuid}].unlikeButton`).addClass("hidden");
    }
   })
};

let tweetRef = rtdb.ref(db, "/tweets");

rtdb.onChildAdded(tweetRef, (ss) => {
  let tObj = ss.val();
  renderTweet(tObj, ss.key);
  likeTweet();
});



let likeTweet = ()=>{
  let likeduuid;
  $(".likeButton").off("click")
  $(".likeButton").on("click", (event)=>{
      likeduuid = $(event.currentTarget).attr("data-uuid");
      let likeref = rtdb.ref(db, `likes/${likeduuid}/${loggedUser.uid}`);
      rtdb.set(likeref, true).then(()=>{
        auditBot(likeduuid);
      })
    });
    $(".unlikeButton").off("click")
    $(".unlikeButton").on("click", (event)=>{
        likeduuid = $(event.currentTarget).attr("data-uuid");
        let likeref = rtdb.ref(db, `likes/${likeduuid}/${loggedUser.uid}`);
        rtdb.set(likeref, false).then(()=>{
          auditBot(likeduuid);
        })
      });
}

//backend
let auditBot = (tweetId)=>{
  
  let likeref = rtdb.ref(db, `likes/${tweetId}`);
  let likeAggRef = rtdb.ref(db, `tweets/${tweetId}/likes`);
  rtdb.get(likeref).then(ss=>{
    let allLikes = ss.val();
    let likeCount=0;
    Object.keys(allLikes).map((uid)=>{
      if(allLikes[uid]){
        likeCount++;
      }
    });
    rtdb.set(likeAggRef, likeCount);
  })
}


let homeListiners = ()=>{

  $(`#signOutButton`).on('click', ()=>{
    signOut(auth).then(() => {
      renderLogin();
    }).catch((error) => {
      // An error happened.
    });
  });

  $("#submitButton").on("click", function () {
    var txt = editableInput.innerText;
    tweetJSON.content = txt;
    var nickname = loggedUser.email.substr(0, loggedUser.email.indexOf('@'));
    tweetJSON.author.id=nickname;
    let newTweetRef = rtdb.push(tweetRef);
    rtdb.set(newTweetRef, tweetJSON);
    $(".editable").empty();
    placeholder.style.display = "block";
    counter.style.display = "none";
  });
  
 

  const wrapper = document.querySelector(".wrapper"),
  editableInput = wrapper.querySelector(".editable"),
  readonlyInput = wrapper.querySelector(".readonly"),
  placeholder = wrapper.querySelector(".placeholder"),
  counter = wrapper.querySelector(".counter"),
  button = wrapper.querySelector("button");
editableInput.onfocus = () => {
  placeholder.style.color = "#c5ccd3";
};
editableInput.onblur = (e) => {
  placeholder.style.color = "#98a5b1";
};
editableInput.onkeyup = (e) => {
  let element = e.target;
  validated(element);
};
editableInput.onkeypress = (e) => {
  let element = e.target;
  validated(element);
  placeholder.style.display = "none";
};

function validated(element) {
  let text;
  let maxLength = 100;
  let currentlength = element.innerText.length;
  if (currentlength <= 0) {
    placeholder.style.display = "block";
    counter.style.display = "none";
    button.classList.remove("active");
  } else {
    placeholder.style.display = "none";
    counter.style.display = "block";
    button.classList.add("active");
  }
  counter.innerText = maxLength - currentlength;
  if (currentlength > maxLength) {
    let overText = element.innerText.substr(maxLength); //extracting over texts
    overText = `<span class="highlight">${overText}</span>`; //creating new span and passing over texts
    text = element.innerText.substr(0, maxLength) + overText; //passing overText value in textTag variable
    readonlyInput.style.zIndex = "1";
    counter.style.color = "#e0245e";
    button.classList.remove("active");
  } else {
    readonlyInput.style.zIndex = "-1";
    counter.style.color = "#333";
  }
  readonlyInput.innerHTML = text; //replacing innerHTML of readonly div with textTag value
}
}

