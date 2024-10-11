import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getFirestore, collection, getDocs, setDoc, getDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCD48J3L4qUk8PUkYQ8vDWjQyI9Od-EaFU",
    authDomain: "musicstreameronline-f1691.firebaseapp.com",
    projectId: "musicstreameronline-f1691",
    storageBucket: "musicstreameronline-f1691.appspot.com",
    messagingSenderId: "959696397808",
    appId: "1:959696397808:web:5b6d4b5784d61ebcaf2935"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const colRef = collection(db, "songs");
const music_coverUrl = document.getElementById('music_coverUrl');
const music_songtitle = document.getElementById('music_songtitle');
const music_subtitle = document.getElementById('music_subtitle');
const playbtn = document.getElementById('playbtn');

class ArtistProfile {
    constructor(id, songName, subtitle, imgUrl, audioUrl, count = 0, songs) {
        this.id = id;
        this.songName = songName;
        this.subtitle = subtitle;
        this.imgUrl = imgUrl;
        this.audioUrl = audioUrl;
        this.count = count;
        this.songs = songs;
    }

    createProfileElement() {
        const profileDiv = document.createElement('div');
        profileDiv.classList.add('song_bar');

        const img = document.createElement('img');
        img.id="songNameIMG";
        img.src = this.imgUrl;
        img.alt = this.songName;

        const titlesubtitle_container = document.createElement('div');
        titlesubtitle_container.classList.add('titlesubtitle_container');
        const h4 = document.createElement('h4');
        h4.textContent = this.songName;

        const p = document.createElement('p');
        p.textContent = this.subtitle;

        const play_btn = document.createElement('img');
        play_btn.src = "assets/play_button.png";

        titlesubtitle_container.appendChild(h4);
        titlesubtitle_container.appendChild(p);
        profileDiv.appendChild(img);
        profileDiv.appendChild(titlesubtitle_container); 
        profileDiv.appendChild(play_btn);

        profileDiv.addEventListener('click', async () => {
            playbtn.src="assets/pause_button.png"
            await this.playSong();
        });

        return profileDiv;
    }

    playSong() {
        playSong(this.audioUrl, this.songName, this.subtitle, this.imgUrl); 
    }
}


async function loadAllSongs() {
    const profileContainer = document.getElementById('song_content');
    profileContainer.innerHTML = ''; 
    const snapshot = await getDocs(colRef);

    snapshot.forEach((doc) => {
        const data = doc.data();
        const artistProfile = new ArtistProfile(
            doc.id,
            data.Song_Name,
            data.Subtitle,
            data.coverUrl,
            data.songUrl,
            data.count || 0
        );

        const profileElement = artistProfile.createProfileElement();
        profileContainer.appendChild(profileElement);
    });
}
async function playSong(audioUrl, songName, subtitle, imgUrl){
    music_coverUrl.src = imgUrl;
    music_songtitle.textContent = songName;
    music_subtitle.textContent = subtitle;

    // Create a new audio element
    const audio = document.createElement('audio');
    audio.src = audioUrl;
    audio.controls = true;
    audio.autoplay = true;
    audio.classList.add('audio_player');

    // audio.onloadedmetadata = function() {
    //     progress.max = audio.duration;
    //     progress.value = audio.currentTime;

    //     // Set initial values
    //     startRunning.textContent = formatTime(0);
    //     endRunning.textContent = formatTime(audio.duration);
    // };
}
loadAllSongs();
  