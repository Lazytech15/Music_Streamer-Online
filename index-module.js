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
const startRunning = document.getElementById('startRunning');
const endRunning = document.getElementById('endRunning');
const runningTime = document.querySelector('.runningTime');
const playerbtns = document.querySelectorAll('.playerbtns');
const music_content = document.getElementById('music_content');
const title_song = document.querySelector('.title_song');
const divider = document.getElementById('divider');

let songsListdata="";

const colRef = collection(db, "songs");
let currentAudio = null; 


let mostPlayedSongs = [];
let allSongs = [];
let playQueue = [];

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
        music_content.classList.add('music_content_adjust');

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
    loadCategoryList();
}

async function loadCategoryList() {
    const profileContainer = document.getElementById('category_content');
    profileContainer.innerHTML = ''; // Clear existing content
    
    const colRef = collection(db, "category");
    const snapshot = await getDocs(colRef);
    
    snapshot.forEach((doc) => {
        const data = doc.data();
        // Create a category object with the songs array
        const categoryData = {
            id: doc.id,
            name: data.name,
            subtitle: data.Subtitle,
            coverUrl: data.coverUrl,
            songs: data.songs || [] // Array of song IDs
        };
        
        const categoryElement = createCategoryElement(categoryData);
        profileContainer.appendChild(categoryElement);
    });
}

function createCategoryElement(category) {
    const categoryDiv = document.createElement('div');
    categoryDiv.classList.add('artist_profile');

    const img = document.createElement('img');
    img.src = category.coverUrl;
    img.alt = category.name;

    const h2 = document.createElement('h2');
    h2.textContent = category.name;

    const p = document.createElement('p');
    p.textContent = category.subtitle;

    categoryDiv.appendChild(img);
    categoryDiv.appendChild(h2);
    categoryDiv.appendChild(p);

    categoryDiv.addEventListener('click', () => {
        displayCategorySongs(category);
    });

    return categoryDiv;
}

async function displayCategorySongs(category) {
    // Create container for the category songs
    const songListContainer = document.createElement('div');
    songListContainer.classList.add('category-songs-container');
    
    // Create header with back button
    const header = document.createElement('div');
    header.classList.add('category-header');
    
    const backButton = document.createElement('button');
    backButton.textContent = '← Back';
    backButton.classList.add('back-button');
    backButton.onclick = () => {
        songListContainer.remove();
        songsListdata ="";
        document.getElementById('category_content').style.display = 'flex';
    };
    
    const categoryTitle = document.createElement('h2');
    categoryTitle.textContent = category.name;
    
    header.appendChild(backButton);
    header.appendChild(categoryTitle);
    songListContainer.appendChild(header);

    // Create songs list
    const songsList = document.createElement('div');
    songsList.id = "songsList";
    songsListdata = songsList.id;
    songsList.classList.add('category-songs-list');

    // Loading indicator
    const loadingDiv = document.createElement('div');
    loadingDiv.textContent = 'Loading songs...';
    loadingDiv.classList.add('loading-indicator');
    songsList.appendChild(loadingDiv);

    try {
        // Fetch all songs from the array of IDs
        const songPromises = category.songs.map(songId => 
            getDoc(doc(db, "songs", songId))
        );
        
        const songDocs = await Promise.all(songPromises);
        
        // Remove loading indicator
        loadingDiv.remove();

        // Create song elements
        songDocs.forEach(songDoc => {
            if (songDoc.exists()) {
                const songData = songDoc.data();
                const songElement = document.createElement('div');
                songElement.classList.add('song-item');

                const songImg = document.createElement('img');
                songImg.src = songData.coverUrl;
                songImg.alt = songData.Song_Name;

                const songInfo = document.createElement('div');
                songInfo.classList.add('song-info');
                
                const songTitle = document.createElement('h3');
                songTitle.textContent = songData.Song_Name;
                
                const songSubtitle = document.createElement('p');
                songSubtitle.textContent = songData.Subtitle;

                songInfo.appendChild(songTitle);
                songInfo.appendChild(songSubtitle);

                songElement.appendChild(songImg);
                songElement.appendChild(songInfo);

                // Add play button
                const playButton = document.createElement('button');
                playButton.classList.add('play-button');
                music_content.classList.add('music_content_adjust');
                playButton.innerHTML = '▶';
                songElement.appendChild(playButton);

                songElement.addEventListener('click', () => {
                    playSong(
                        songData.songUrl,
                        songData.Song_Name,
                        songData.Subtitle,
                        songData.coverUrl
                    );
                    document.getElementById('music_player').style.display = "flex";
                    songsList.classList.add('category-songs-list-play');
                });

                songsList.appendChild(songElement);
            }
        });

        // Show message if no songs are found
        if (songsList.children.length === 0) {
            const noSongsDiv = document.createElement('div');
            noSongsDiv.textContent = 'No songs found in this category';
            noSongsDiv.classList.add('no-songs-message');
            songsList.appendChild(noSongsDiv);
        }

    } catch (error) {
        console.error("Error fetching songs:", error);
        loadingDiv.textContent = 'Error loading songs. Please try again.';
    }

    songListContainer.appendChild(songsList);

    // Hide the category grid and show the songs list
    const categoryContent = document.getElementById('category_content');
    categoryContent.style.display = 'none';
    categoryContent.parentElement.appendChild(songListContainer);
}
  
  function playSong(audioUrl, songName, subtitle, imgUrl) {
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

        // Set initial values
        startRunning.textContent = formatTime(0);
        endRunning.textContent = formatTime(audio.duration);
    };

    audio.ontimeupdate = function() {
        progress.value = audio.currentTime;

         // Update time displays
         startRunning.textContent = formatTime(audio.currentTime);
         endRunning.textContent = formatTime(audio.duration - audio.currentTime);
    };

    function formatTime(timeInSeconds) {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = Math.floor(timeInSeconds % 60);
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    audio.onended = function() {
        playRandomSong(); 
    };

    audioContainer.appendChild(audio);
    currentAudio = audio; 

    let currentSongIndex = allSongs.findIndex(song => song.audioUrl === audioUrl);

    if (previousSong) {
        let clickTime = 0;
        previousSong.onclick = function(event) {
            event.stopPropagation();
            playbtn.src = 'assets/pause.png';
            const now = new Date().getTime();
            const timeSinceLastClick = now - clickTime;
            clickTime = now;

            if (timeSinceLastClick > 300 || audio.currentTime > 3) {
                // If it's been more than 300ms since last click or current time > 3s, restart the song
                audio.currentTime = 0;
            } else {
                // Play the previous song
                currentSongIndex = (currentSongIndex - 1 + allSongs.length) % allSongs.length;
                allSongs[currentSongIndex].playSong();
            }
        };
    }

    if (pause) {
        pause.onclick = function(event) {
            event.stopPropagation();
            if (audio.paused) {
                audio.play();
                playbtn.src = 'assets/pause.png';
            } else {
                audio.pause();
                playbtn.src = 'assets/play.png';
            }
        };
    }

    if (nextSong) {
        nextSong.onclick = function(event) {
            event.stopPropagation();
            playbtn.src = 'assets/pause.png';
            currentSongIndex = (currentSongIndex + 1) % allSongs.length;
            allSongs[currentSongIndex].playSong();
        };
    }

    if (backward) {
        backward.onclick = function(event) {
            event.stopPropagation();
            audio.currentTime -= 10;
        };
    }

    if (forward) {
        forward.onclick = function(event) {
            event.stopPropagation();
            audio.currentTime += 10; 
        };
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
  
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function resetMusicPlayer(){
    musicContainer.classList.remove('musicPlayer_enlarge');
    audioContainer.classList.remove('audio_container_enlarge');
    coverUrl.classList.remove('imageCoverUrl_enlarge');
    controllers.classList.remove ('controllers_enlarge');
    progress.classList.remove('progress_enlarge');
    title_song.classList.remove('songTitle_enlarge');
    divider.classList.remove('add_divider_enlarge');
    minibtn.style.display = "none";

    if(musicContainer.style.display == "none"){
        music_content.classList.remove('music_content_adjust');
    }
    
    
    if(minibtn.style.display == "none"){
        songTitle.style.fontSize="1.2rem";
        subTitle.style.fontSize="0.8rem";
        startRunning.style.fontSize="initial";
        endRunning.style.fontSize="initial";
        runningTime.style.marginTop = "initial";

        if (playerbtns.length >= 3) {
            playerbtns[2].style.width = '40px';
            playerbtns[2].style.height = '40px';
        }

        playerbtns.forEach(playerbtns =>{
            playerbtns.classList.remove('playerbtns_enlarge');
        })
    }
    console.log(songsListdata);
    if(songsListdata !== ""){
        document.getElementById(songsListdata).classList.remove('category-songs-list-play');
        songsListdata="";
    }
}


// event listiner
musicContainer.addEventListener('click', event => {
    musicContainer.classList.add('musicPlayer_enlarge');
    audioContainer.classList.add('audio_container_enlarge');
    coverUrl.classList.add('imageCoverUrl_enlarge');
    controllers.classList.add('controllers_enlarge');
    progress.classList.add('progress_enlarge');
    title_song.classList.add('songTitle_enlarge');
    divider.classList.add('add_divider_enlarge');
    minibtn.style.display = "flex";

    playerbtns.forEach(playerbtns =>{
        playerbtns.classList.add('playerbtns_enlarge');
    })
    
    if(musicContainer.classList.contains('musicPlayer_enlarge')){
        songTitle.style.fontSize="1.8rem";
        subTitle.style.fontSize="1rem";
        startRunning.style.fontSize="0.9rem";
        endRunning.style.fontSize="0.9rem";
        runningTime.style.marginTop = "20px";

        if (playerbtns.length >= 3) {
            playerbtns[2].style.width = '40px';
            playerbtns[2].style.height = '40px';
        }
    }
});

progress.addEventListener('change', (event) => {
    event.stopPropagation();
    audio.play();
    audio.currentTime = progress.value;
});

closebtn.addEventListener("click",(event)=>{
    event.stopPropagation();
    document.getElementById('music_player').style.display = "none";
    resetMusicPlayer();
    currentAudio.pause();
})

minibtn.addEventListener('click', (event) => {
    event.stopPropagation(); 
    resetMusicPlayer();
});

loadHitsSongs();