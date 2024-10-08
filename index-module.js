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
const progressbar_container = document.querySelector('.progressbar_container');
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
        musicContainer.classList.remove('music_player_category');

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
        musicContainer.classList.contains('music_player_category') ? musicContainer.classList.add('music_player_category') : 
        musicContainer.classList.remove('music_player_category');
        displayCategorySongs(category);
    });

    return categoryDiv;
}

// Add these variables at the top with other declarations
let currentCategoryPlaylist = [];
let isPlayingCategory = false;

async function displayCategorySongs(category) {
    const songListContainer = document.createElement('div');
    songListContainer.classList.add('category-songs-container');
    
    const header = document.createElement('div');
    header.classList.add('category-header');
    
    const backButton = document.createElement('button');
    backButton.textContent = '← Back';
    backButton.classList.add('back-button');
    backButton.onclick = () => {
        songListContainer.remove();
        songsListdata = "";
        isPlayingCategory = false; // Reset category playing state
        currentCategoryPlaylist = []; // Clear category playlist
        document.getElementById('category_content').style.display = 'flex';
        if(musicContainer.style.display !== "none"){
            music_content.classList.add('music_content_adjust');
            musicContainer.classList.remove('music_player_category');
        }
    };
    
    const categoryTitle = document.createElement('h2');
    categoryTitle.textContent = category.name;
    
    header.appendChild(backButton);
    header.appendChild(categoryTitle);
    songListContainer.appendChild(header);

    const songsList = document.createElement('div');
    songsList.id = "songsList";
    songsListdata = songsList.id;
    songsList.classList.add('category-songs-list');

    const loadingDiv = document.createElement('div');
    loadingDiv.textContent = 'Loading songs...';
    loadingDiv.classList.add('loading-indicator');
    songsList.appendChild(loadingDiv);

    try {
        const songPromises = category.songs.map(songId => 
            getDoc(doc(db, "songs", songId))
        );
        
        const songDocs = await Promise.all(songPromises);
        loadingDiv.remove();

        // Create category playlist
        currentCategoryPlaylist = songDocs
            .filter(doc => doc.exists())
            .map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        
        songDocs.forEach((songDoc, index) => {
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

                const playButton = document.createElement('button');
                playButton.classList.add('play-button');
                playButton.innerHTML = '▶';
                songElement.appendChild(playButton);

                songElement.addEventListener('click', () => {
                    isPlayingCategory = true; // Set category playing state
                    playCategorySong(index);
                    document.getElementById('music_player').style.display = "flex";
                    songsList.classList.add('category-songs-list-play'); 
                    // musicContainer.classList.add('music_player_category');
                    // if(document.getElementById('category_content').style.display=="none"){
                    //     musicContainer.classList.add('music_player_category');
                    //     document.getElementById('music_player').style.display = "flex";
                    //     songsList.classList.add('category-songs-list-play'); 
                    // }else{
                    //     musicContainer.classList.remove('music_player_category')
                    // }
                });

                songsList.appendChild(songElement);
            }
        });

        if (songsList.children.length === 0) {
            const noSongsDiv = document.createElement('div');
            noSongsDiv.textContent = 'No songs found in this category';
            noSongsDiv.classList.add('no-songs-message');
            songsList.appendChild(noSongsDiv);
        }

        if(musicContainer.style.display !== "none"){
            songsList.classList.add('category-songs-list-play');
        }

    } catch (error) {
        console.error("Error fetching songs:", error);
        loadingDiv.textContent = 'Error loading songs. Please try again.';
    }

    songListContainer.appendChild(songsList);
    const categoryContent = document.getElementById('category_content');
    categoryContent.style.display = 'none';
    categoryContent.parentElement.appendChild(songListContainer);
}

function playCategorySong(index) {
    if (index >= currentCategoryPlaylist.length) {
        // Stop playing when we reach the end of the category playlist
        isPlayingCategory = false;
        return;
    }

    const song = currentCategoryPlaylist[index];
    playSong(
        song.songUrl,
        song.Song_Name,
        song.Subtitle,
        song.coverUrl
    );

    // Modify the audio.onended event in the current context
    const audio = currentAudio;
    audio.onended = function() {
        if (isPlayingCategory) {
            playCategorySong(index + 1);
        } else {
            playRandomSong();
        }
    };
}
  
  function playSong(audioUrl, songName, subtitle, imgUrl) {
    coverUrl.src = imgUrl;
    songTitle.textContent = songName;

    songName.length < 10 ? songTitle.classList.remove('centered') : songTitle.classList.add('centered');

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
        previousSong.onclick = function(event) {
            event.stopPropagation();
            playbtn.src = 'assets/pause.png';
            if (isPlayingCategory) {
                const currentIndex = currentCategoryPlaylist.findIndex(song => song.songUrl === audioUrl);
                if (currentIndex > 0) {
                    playCategorySong(currentIndex - 1);
                } else {
                    audio.currentTime = 0;
                }
            } else {
                // Original previous song logic
                const now = new Date().getTime();
                let clickTime = now;
                const timeSinceLastClick = now - clickTime;
                

                if (timeSinceLastClick > 300 || audio.currentTime > 3) {
                    audio.currentTime = 0;
                } else {
                    currentSongIndex = (currentSongIndex - 1 + allSongs.length) % allSongs.length;
                    allSongs[currentSongIndex].playSong();
                }
            }
        };
    }

    if (pause) {
        pause.onclick = function(event) {
            event.stopPropagation();
            if (audio.paused) {
                audio.play();
                playbtn.src = 'assets/pause.png';
                songTitle.classList.add('centered');
            } else {
                audio.pause();
                playbtn.src = 'assets/play.png';
                songTitle.classList.remove('centered');
            }
        };
    }

    if (nextSong) {
        nextSong.onclick = function(event) {
            event.stopPropagation();
            playbtn.src = 'assets/pause.png';
            if (isPlayingCategory) {
                const currentIndex = currentCategoryPlaylist.findIndex(song => song.songUrl === audioUrl);
                if (currentIndex < currentCategoryPlaylist.length - 1) {
                    playCategorySong(currentIndex + 1);
                }
            } else {
                currentSongIndex = (currentSongIndex + 1) % allSongs.length;
                allSongs[currentSongIndex].playSong();
            }
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
    progressbar_container.classList.remove('progress_content_enlarge');
    title_song.classList.remove('songTitle_enlarge');
    
    // divider.classList.remove('add_divider_enlarge');
    minibtn.style.display = "none";

    if(musicContainer.style.display === "none"){
        music_content.classList.remove('music_content_adjust');
        musicContainer.classList.add('music_player_category');
    }
    
    
    if(minibtn.style.display == "none"){
        songTitle.classList.remove('songTile_enlarge');
        subTitle.classList.remove('subTitle_enlarge');
        runningTime.classList.remove('runningTime_enlarge');
        startRunning.classList.remove('startRunning_enlarge');
        endRunning.classList.remove('endRunning_enlarge');
        

        if (playerbtns.length >= 3) {
            playerbtns[2].style.width = '40px';
            playerbtns[2].style.height = '40px';
        }

        playerbtns.forEach(playerbtns =>{
            playerbtns.classList.remove('playerbtns_enlarge');
        })
    }
    console.log(songsListdata);
    
}


// event listiner
musicContainer.addEventListener('click', event => {
    musicContainer.classList.add('musicPlayer_enlarge');
    audioContainer.classList.add('audio_container_enlarge');
    coverUrl.classList.add('imageCoverUrl_enlarge');
    controllers.classList.add('controllers_enlarge');
    progress.classList.add('progress_enlarge');
    progressbar_container.classList.add('progress_content_enlarge');
    musicContainer.classList.remove('music_player_category');
    minibtn.style.display = "flex";

    playerbtns.forEach(playerbtns =>{
        playerbtns.classList.add('playerbtns_enlarge');
    })
    
    if(musicContainer.classList.contains('musicPlayer_enlarge')){
        songTitle.classList.add('songTile_enlarge');
        subTitle.classList.add('subTitle_enlarge');
        runningTime.classList.add('runningTime_enlarge');
        startRunning.classList.add('startRunning_enlarge');
        endRunning.classList.add('endRunning_enlarge');
        

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
    try {
        event.stopPropagation();
        document.getElementById('music_player').style.display = "none";
        resetMusicPlayer();
        currentAudio.pause();
        document.getElementById(songsListdata).classList.remove('category-songs-list-play');
    } catch (error) {
        console.log(error);
    }
})

minibtn.addEventListener('click', (event) => {
    event.stopPropagation(); 
    resetMusicPlayer();
    
});

loadHitsSongs();