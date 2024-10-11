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
let nowPlaying;
let allSongs = [];
let playQueue = [];
let currentWavesurfer = null;
let currentSongIndex = 0;
let lastClickTime = 0;
let currentPlayingElement = null;

const music_coverUrl = document.getElementById('music_coverUrl');
const music_songtitle = document.getElementById('music_songtitle');
const music_subtitle = document.getElementById('music_subtitle');
const pause = document.getElementById('pause');
const playbtn = document.getElementById('playbtn');
const music_player = document.getElementById('music_player');
const minibtn = document.getElementById('minibtn');
const controller_container = document.querySelector('.controller_container');
const music_player_container = document.querySelector('.music_player_container');
const music_player_title_container = document.querySelector('.music_player_title_container');
const mini_close_container = document.querySelector('.mini_close_container'); 
const copyright =  document.getElementById('copyright');


class ArtistProfile {
    constructor(id, songName, subtitle, imgUrl, audioUrl, count = 0, songs) {
        this.id = id;
        this.songName = songName;
        this.subtitle = subtitle;
        this.imgUrl = imgUrl;
        this.audioUrl = audioUrl;
        this.count = count;
        this.songs = songs;
        this.element = null;
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

         // Add click handler for the play button
         play_btn.addEventListener('click', async (e) => {
            e.stopPropagation(); // Prevent the profileDiv click from triggering
            
            if (currentPlayingElement === profileDiv && currentWavesurfer) {
                // If this is the current playing song, toggle play/pause
                currentWavesurfer.playPause();
                const isPlaying = currentWavesurfer.isPlaying();
                play_btn.src = isPlaying ? 'assets/pause_button.png' : 'assets/play_button.png';
                playbtn.src = isPlaying ? 'assets/pause_button.png' : 'assets/play_button.png';
            } else {
                // If this is a different song, play it
                playbtn.src = "assets/pause_button.png";
                await this.playSong();
            }
        });

        profileDiv.addEventListener('click', async () => {
            playbtn.src="assets/pause_button.png"
            await this.playSong();
        });

        this.element = profileDiv;  // Store the created element
        return profileDiv;
    }

    playSong() {
        playSong(this.audioUrl, this.songName, this.subtitle, this.imgUrl, this.element);
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
        artistProfile.element = profileElement;  // Set the element property
        allSongs.push(artistProfile);
    });

    playQueue = [...allSongs];
    shuffleArray(playQueue);
}

async function playSong(audioUrl, songName, subtitle, imgUrl, element){
    // If there's a current WaveSurfer instance, destroy it
    currentSongIndex = allSongs.findIndex(song => song.audioUrl === audioUrl);

    updateSongUI(element);

    if (currentWavesurfer) {
        currentWavesurfer.destroy();
    }

    music_coverUrl.src = imgUrl;
    music_songtitle.textContent = songName;
    music_subtitle.textContent = subtitle;

    // Initialize WaveSurfer
    const wavesurfer = WaveSurfer.create({
        container: '#progress_wavesurfing',
        waveColor: 'hsl(283, 100%, 20%)',
        progressColor: '#383351',
        barWidth: 4,
        barHeight: 1, 
        barMinHeight: 1,
        height: 30,
        responsive: true,
        hideScrollbar: true,
        barRadius: 4
    });
    wavesurfer.load(audioUrl);

    wavesurfer.on('ready', () => {
        wavesurfer.play();
        playbtn.src = 'assets/pause_button.png';
        if (currentPlayingElement) {
            const playButton = currentPlayingElement.querySelector('img[src="assets/play_button.png"]');
            if (playButton) {
                playButton.src = "assets/pause_button.png";
            }
        }
    });

    wavesurfer.on('finish', () => {
        console.log('song ended');
        updateSongUI(null);  // Reset UI when song ends
        playNextSong();
    });

    const currentTimeElement = document.getElementById('startRunning');
    const durationElement = document.getElementById('endRunning');

    wavesurfer.on('audioprocess', () => {
        const currentTime = wavesurfer.getCurrentTime();
        currentTimeElement.textContent = formatTime(currentTime);
    });

    wavesurfer.on('ready', () => {
        const duration = wavesurfer.getDuration();
        durationElement.textContent = formatTime(duration);
    });

    function formatTime(timeInSeconds) {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = Math.floor(timeInSeconds % 60);
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    // Control buttons
    if (previousSong) {
        previousSong.onclick = function(event) {
            event.stopPropagation();
            playPreviousSong();
        };
    }

    if (pause) {
        pause.onclick = function(event) {
            event.stopPropagation();
            wavesurfer.playPause();
            const isPlaying = wavesurfer.isPlaying();
            playbtn.src = isPlaying ? 'assets/pause_button.png' : 'assets/play_button.png';
            
            // Update the play button in the current playing element
            if (currentPlayingElement) {
                const playButton = currentPlayingElement.querySelector('img:last-child');
                if (playButton) {
                    playButton.src = isPlaying ? 'assets/pause_button.png' : 'assets/play_button.png';
                }
            }
        };
    }

    if (nextSong) {
        nextSong.onclick = function(event) {
            event.stopPropagation();
            playNextSong();
        };
    }

    if (backward) {
        backward.onclick = function(event) {
            event.stopPropagation();
            const currentTime = wavesurfer.getCurrentTime();
            wavesurfer.seekTo((currentTime - 10) / wavesurfer.getDuration());
        };
    }

    if (forward) {
        forward.onclick = function(event) {
            event.stopPropagation();
            const currentTime = wavesurfer.getCurrentTime();
            wavesurfer.seekTo(Math.min((currentTime + 10) / wavesurfer.getDuration(), 1));
        };
    }

    // Set the current WaveSurfer instance
    currentWavesurfer = wavesurfer;

    // Return the wavesurfer instance
    return wavesurfer;
}


loadAllSongs();

function updateSongUI(newSongElement) {
    // Reset previous song's UI
    if (currentPlayingElement) {
        const prevPlayBtn = currentPlayingElement.querySelector('img:last-child');
        if (prevPlayBtn) prevPlayBtn.src = "assets/play_button.png";
        currentPlayingElement.style.backgroundColor = '';
    }

    // Update new song's UI
    if (newSongElement) {
        const newPlayBtn = newSongElement.querySelector('img:last-child');
        if (newPlayBtn) newPlayBtn.src = "assets/pause_button.png";
        newSongElement.style.backgroundColor = 'hsl(283, 100%, 20%)';
    }

    currentPlayingElement = newSongElement;
}

function playNextSong() {
    currentSongIndex = (currentSongIndex + 1) % allSongs.length;
    const nextSong = allSongs[currentSongIndex];
    playSong(nextSong.audioUrl, nextSong.songName, nextSong.subtitle, nextSong.imgUrl, nextSong.element);
}

function playPreviousSong() {
    const now = new Date().getTime();
    const timeSinceLastClick = now - lastClickTime;
    lastClickTime = now;

    if (currentWavesurfer) {
        if (timeSinceLastClick > 300 || currentWavesurfer.getCurrentTime() > 3) {
            currentWavesurfer.seekTo(0);
        } else {
            currentSongIndex = (currentSongIndex - 1 + allSongs.length) % allSongs.length;
            const previousSong = allSongs[currentSongIndex];
            playSong(previousSong.audioUrl, previousSong.songName, previousSong.subtitle, previousSong.imgUrl, previousSong.element);
        }
    }
}

function playRandomSong() {
    if (allSongs.length > 0) {
        if (playQueue.length === 0) {
            playQueue = [...allSongs];
            shuffleArray(playQueue);
        }
        const nextSong = playQueue.pop();
        playSong(nextSong.audioUrl, nextSong.songName, nextSong.subtitle, nextSong.imgUrl, nextSong.element);
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

music_player.addEventListener('click',()=>{
    const playerbtns = document.querySelectorAll('.playerbtns');
    controller_container.classList.add('controller_container_enlarge');
    document.querySelector('.progress_container').style.display="flex";
    document.querySelector('.mini_close_container').style.visibility="visible";
    music_player_container.classList.add('music_player_container_enlarge');
    music_player_title_container.classList.add('music_player_title_container_enlarge');
    document.querySelector('.song_content').style.display="none";
    mini_close_container.classList.add('mini_close_container_enlarge'); 
    music_player.classList.add('music_player_enlarge');
    music_coverUrl.classList.add('music_coverUrl_enlarge');
    copyright.style.display="flex";

    if (playerbtns.length >= 3) {
        playerbtns[2].style.width = '3.5em';
        playerbtns[2].style.height = '3.5em';
    }
})

minibtn.addEventListener('click', ()=>{
    const playerbtns = document.querySelectorAll('.playerbtns');
    controller_container.classList.remove('controller_container_enlarge');
    document.querySelector('.progress_container').style.display="none";
    document.querySelector('.song_content').style.display="flex";
    document.querySelector('.mini_close_container').style.visibility="hidden";
    music_player_container.classList.remove('music_player_container_enlarge');
    music_player_title_container.classList.remove('music_player_title_container_enlarge');
    mini_close_container.classList.remove('mini_close_container_enlarge'); 
    music_player.classList.remove('music_player_enlarge');
    music_coverUrl.classList.remove('music_coverUrl_enlarge');
    copyright.style.display="none";

    if (playerbtns.length >= 3) {
        playerbtns[2].style.width = '1.5em';
        playerbtns[2].style.height = '1.5em';
    }
})