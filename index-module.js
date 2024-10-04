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
let currentAudio = null; 

class ArtistProfile {
    constructor(id, songName, subtitle, imgUrl, audioUrl, count = 0) {
        this.id = id;
        this.songName = songName;
        this.subtitle = subtitle;
        this.imgUrl = imgUrl;
        this.audioUrl = audioUrl;
        this.count = count;
    }
    
    createProfileElement() {
        const profileDiv = document.createElement('div');
        profileDiv.classList.add('artist_profile');

        const img = document.createElement('img');
        img.src = this.imgUrl;
        img.alt = this.songName;

        const h2 = document.createElement('h2');
        h2.textContent = this.songName;

        const p = document.createElement('p');
        p.textContent = this.subtitle;

        profileDiv.appendChild(img);
        profileDiv.appendChild(h2);
        profileDiv.appendChild(p);

        profileDiv.addEventListener('click', async () => {
            await this.playSong();
        });

        return profileDiv;
    }

    async playSong() {
        playSong(this.audioUrl, this.songName, this.subtitle, this.imgUrl);
        document.getElementById('music_player').style.display = "flex";
    
        const docRef = doc(db, "songs", this.id);
        const docSnap = await getDoc(docRef);
    
        if (docSnap.exists()) {
            const data = docSnap.data();
            this.count = (data.count || 0) + 1;
            await updateDoc(docRef, { count: this.count });
            MostPlayedSongs(this);
        } else {
            console.log("No such document!");
        }
    }
}

let mostPlayedSongs = [];
let allSongs = [];
let playQueue = [];

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function playNextSong() {
    if (playQueue.length === 0) {
        playQueue = [...allSongs];
        shuffleArray(playQueue);
    }
    
    const nextSong = playQueue.pop();
    nextSong.playSong();
}

function playRandomSong() {
    if (allSongs.length > 0) {
        if (playQueue.length === 0) {
            playQueue = [...allSongs];
            shuffleArray(playQueue);
        }
        playNextSong();
    }
}

async function loadHitsSongs() {
    const profileContainer = document.getElementById('artist_profile_content');
    profileContainer.innerHTML = ''; 
    const snapshot = await getDocs(colRef);
    
    mostPlayedSongs = [];
    allSongs = []; 

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

        allSongs.push(artistProfile); 

        console.log(allSongs);

        if (data.count && data.count > 0) {
            mostPlayedSongs.push(artistProfile);
        }
    });

    playQueue = [...allSongs];
    shuffleArray(playQueue);

    MostPlayedSongs();
}

function playSong(audioUrl, songName, subtitle, imgUrl) {
    const audioContainer = document.getElementById('audio_container');
    const songTitle = document.getElementById('songTitle');
    const subTitle = document.getElementById('subTitle');
    const progress = document.getElementById('progress');
    const coverUrl = document.getElementById('coverUrl');
    const playbtn = document.getElementById('playbtn');
    const closebtn = document.getElementById('closebtn');
    const minibtn = document.getElementById('minibtn');
    const musicContainer = document.getElementById('music_player');
    const controllers = document.getElementById('controllers');

    coverUrl.src = imgUrl;
    songTitle.textContent = songName;
    subTitle.textContent = subtitle;

    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        audioContainer.removeChild(currentAudio);
    }

    // Create a new audio element
    const audio = document.createElement('audio');
    audio.src = audioUrl;
    audio.controls = true;
    audio.autoplay = true;
    audio.classList.add('audio_player');

    audio.onloadedmetadata = function() {
        progress.max = audio.duration;
        progress.value = audio.currentTime;
    };

    audio.ontimeupdate = function() {
        progress.value = audio.currentTime;
    };

    audio.onended = function() {
        playRandomSong(); 
    };

    audioContainer.appendChild(audio);
    currentAudio = audio; 

        if (backward) {
        backward.onclick = function() {
            audio.currentTime -= 10;
        };
    }

    if (pause) {
        pause.onclick = function() {
            if (audio.paused) {
                audio.play();
                playbtn.src = 'assets/pause.png';
            } else {
                audio.pause();
                playbtn.src = 'assets/play.png';
            }
        };
    }

    if (forward) {
        forward.onclick = function() {
            audio.currentTime += 10; 
        };
    }

    progress.addEventListener('change', (event) => {
        event.stopPropagation();
        audio.play();
        audio.currentTime = progress.value;
    });

    musicContainer.addEventListener('click', () => {
        musicContainer.classList.add('musicPlayer_enlarge');
        audioContainer.classList.add('audio_container_enlarge');
        coverUrl.classList.add('imageCoverUrl_enlarge');
        controllers.classList.add('controllers_enlarge')
        minibtn.style.display = "flex";
        console.log('Classes added');
    });

    minibtn.addEventListener('click', (event) => {
        event.stopPropagation(); 
        musicContainer.classList.remove('musicPlayer_enlarge');
        audioContainer.classList.remove('audio_container_enlarge');
        coverUrl.classList.remove('imageCoverUrl_enlarge');
        controllers.classList.remove('controllers_enlarge')
        minibtn.style.display = "none";
        console.log('Classes removed');
    });

    closebtn.addEventListener("click",()=>{
        document.getElementById('music_player').style.display = "none";
        currentAudio.pause();
    })
}

function MostPlayedSongs(playedSong = null) {
    if (playedSong) {
        const index = mostPlayedSongs.findIndex(song => song.id === playedSong.id);
        if (index !== -1) {
            mostPlayedSongs[index] = playedSong;
        } else {
            mostPlayedSongs.push(playedSong);
        }
    }

    mostPlayedSongs.sort((a, b) => b.count - a.count);
    
    mostPlayedSongs = mostPlayedSongs.slice(0, 5);

    const mostPlayedContainer = document.getElementById('MostPlayed_content');
    mostPlayedContainer.innerHTML = '';

    mostPlayedSongs.forEach(song => {
        const profileElement = song.createProfileElement();
        mostPlayedContainer.appendChild(profileElement);
    });
}

loadHitsSongs();




