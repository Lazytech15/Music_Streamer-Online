function _0x3e24(_0x13b01a,_0x2390db){const _0x2273ad=_0x2273();return _0x3e24=function(_0x3e242f,_0x1b53c8){_0x3e242f=_0x3e242f-0xd9;let _0x349791=_0x2273ad[_0x3e242f];return _0x349791;},_0x3e24(_0x13b01a,_0x2390db);}const _0x3190c8=_0x3e24;(function(_0x5ea687,_0x1cb0c9){const _0x43984e=_0x3e24,_0x4e6e97=_0x5ea687();while(!![]){try{const _0x2ea87a=-parseInt(_0x43984e(0x12f))/0x1*(parseInt(_0x43984e(0x115))/0x2)+parseInt(_0x43984e(0x132))/0x3+-parseInt(_0x43984e(0x135))/0x4*(parseInt(_0x43984e(0x114))/0x5)+parseInt(_0x43984e(0x14d))/0x6*(-parseInt(_0x43984e(0x131))/0x7)+parseInt(_0x43984e(0x140))/0x8*(-parseInt(_0x43984e(0x103))/0x9)+-parseInt(_0x43984e(0xea))/0xa*(parseInt(_0x43984e(0xe0))/0xb)+parseInt(_0x43984e(0x101))/0xc;if(_0x2ea87a===_0x1cb0c9)break;else _0x4e6e97['push'](_0x4e6e97['shift']());}catch(_0x14d4e2){_0x4e6e97['push'](_0x4e6e97['shift']());}}}(_0x2273,0x9a3af));import{initializeApp}from'https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js';import{getFirestore,collection,getDocs,setDoc,getDoc,doc,updateDoc}from'https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js';const firebaseConfig={'apiKey':_0x3190c8(0x14a),'authDomain':_0x3190c8(0x102),'projectId':_0x3190c8(0x118),'storageBucket':'musicstreameronline-f1691.appspot.com','messagingSenderId':_0x3190c8(0x13b),'appId':'1:959696397808:web:5b6d4b5784d61ebcaf2935'},app=initializeApp(firebaseConfig),db=getFirestore(app),colRef=collection(db,_0x3190c8(0xfb));let nowPlaying,allSongs=[],playQueue=[],currentWavesurfer=null,currentSongIndex=0x0,lastClickTime=0x0,currentPlayingElement=null,isShuffleOn=![],repeatMode=0x0,upcomingSongsDiv;const music_coverUrl=document[_0x3190c8(0x145)](_0x3190c8(0x146)),music_songtitle=document[_0x3190c8(0x145)](_0x3190c8(0xe7)),music_subtitle=document[_0x3190c8(0x145)](_0x3190c8(0x11c)),pausebtn=document['getElementById'](_0x3190c8(0x149)),playbtn=document[_0x3190c8(0x145)](_0x3190c8(0x111)),music_player=document[_0x3190c8(0x145)]('music_player'),minibtn=document[_0x3190c8(0x145)]('minibtn'),controller_container=document[_0x3190c8(0xe5)](_0x3190c8(0xe3)),music_player_container=document['querySelector'](_0x3190c8(0x116)),music_player_title_container=document[_0x3190c8(0xe5)](_0x3190c8(0x151)),mini_close_container=document[_0x3190c8(0xe5)](_0x3190c8(0x11d)),nextsongShow=document[_0x3190c8(0xe5)](_0x3190c8(0xde)),playnextsong=document[_0x3190c8(0x145)](_0x3190c8(0x14f)),wavebar_animation_container=document[_0x3190c8(0xe5)](_0x3190c8(0x13e));class ArtistProfile{constructor(_0x5c0334,_0x9846c2,_0xa59b73,_0xcf1b48,_0x353ae1,_0x139ac1=0x0,_0x19885d){const _0x594d1d=_0x3190c8;this['id']=_0x5c0334,this[_0x594d1d(0xf0)]=_0x9846c2,this[_0x594d1d(0x14b)]=_0xa59b73,this[_0x594d1d(0xfd)]=_0xcf1b48,this[_0x594d1d(0x10c)]=_0x353ae1,this['count']=_0x139ac1,this[_0x594d1d(0xfb)]=_0x19885d,this[_0x594d1d(0x12d)]=null;}[_0x3190c8(0xf5)](){const _0x2c1c50=_0x3190c8,_0x4c1182=document[_0x2c1c50(0x109)](_0x2c1c50(0x125));_0x4c1182[_0x2c1c50(0xe2)][_0x2c1c50(0x123)]('song_bar');const _0x4b4d33=document['createElement'](_0x2c1c50(0x113));_0x4b4d33['id']='songNameIMG',_0x4b4d33[_0x2c1c50(0x121)]=this[_0x2c1c50(0xfd)],_0x4b4d33[_0x2c1c50(0x122)]=this[_0x2c1c50(0xf0)];const _0x537e84=document[_0x2c1c50(0x109)]('div');_0x537e84[_0x2c1c50(0xe2)][_0x2c1c50(0x123)](_0x2c1c50(0x14e));const _0x5d5685=document[_0x2c1c50(0x109)]('h4');_0x5d5685['textContent']=this[_0x2c1c50(0xf0)];const _0x70e5b8=document[_0x2c1c50(0x109)]('p');_0x70e5b8[_0x2c1c50(0xf9)]=this[_0x2c1c50(0x14b)];const _0x43fc2f=document[_0x2c1c50(0x109)](_0x2c1c50(0x113));return _0x43fc2f['src']='assets/play_button.png',_0x537e84[_0x2c1c50(0xf2)](_0x5d5685),_0x537e84[_0x2c1c50(0xf2)](_0x70e5b8),_0x4c1182[_0x2c1c50(0xf2)](_0x4b4d33),_0x4c1182[_0x2c1c50(0xf2)](_0x537e84),_0x4c1182[_0x2c1c50(0xf2)](_0x43fc2f),_0x43fc2f[_0x2c1c50(0xf4)](_0x2c1c50(0x142),async _0x26ecc4=>{const _0x4b74fc=_0x2c1c50;_0x26ecc4['stopPropagation']();if(currentPlayingElement===_0x4c1182&&currentWavesurfer){currentWavesurfer[_0x4b74fc(0x10b)]();const _0x31fa59=currentWavesurfer['isPlaying']();_0x43fc2f[_0x4b74fc(0x121)]=_0x31fa59?'assets/pause_button.png':_0x4b74fc(0x105),playbtn[_0x4b74fc(0x121)]=_0x31fa59?_0x4b74fc(0xdd):'assets/play_button.png';}else playbtn[_0x4b74fc(0x121)]=_0x4b74fc(0xdd),await this[_0x4b74fc(0x107)]();}),_0x4c1182['addEventListener'](_0x2c1c50(0x142),async()=>{const _0x2cb630=_0x2c1c50;playbtn[_0x2cb630(0x121)]=_0x2cb630(0xdd),await this[_0x2cb630(0x107)]();}),this[_0x2c1c50(0x12d)]=_0x4c1182,_0x4c1182;}[_0x3190c8(0x107)](){const _0x55b355=_0x3190c8;playSong(this[_0x55b355(0x10c)],this[_0x55b355(0xf0)],this['subtitle'],this[_0x55b355(0xfd)],this[_0x55b355(0x12d)]);}}async function loadAllSongs(){const _0x3219d7=_0x3190c8,_0x2fc4d3=document[_0x3219d7(0x145)](_0x3219d7(0xdf));_0x2fc4d3['innerHTML']='';const _0x47f364=await getDocs(colRef);_0x47f364[_0x3219d7(0x112)](_0x40a635=>{const _0xc16ef6=_0x3219d7,_0x4e3579=_0x40a635[_0xc16ef6(0xed)](),_0x194324=new ArtistProfile(_0x40a635['id'],_0x4e3579[_0xc16ef6(0x139)],_0x4e3579['Subtitle'],_0x4e3579['coverUrl'],_0x4e3579['songUrl'],_0x4e3579[_0xc16ef6(0x13f)]||0x0),_0x19442a=_0x194324['createProfileElement']();_0x2fc4d3[_0xc16ef6(0xf2)](_0x19442a),_0x194324[_0xc16ef6(0x12d)]=_0x19442a,allSongs['push'](_0x194324);}),playQueue=[...allSongs],shuffleArray(playQueue);if(allSongs['length']>0x0){const _0x18c3fe=allSongs[0x0];music_coverUrl[_0x3219d7(0x121)]=_0x18c3fe[_0x3219d7(0xfd)],music_songtitle[_0x3219d7(0xf9)]=_0x18c3fe['songName'],music_subtitle['textContent']=_0x18c3fe['subtitle'],updateNextSongDisplay();}}async function playSong(_0xd35fa3,_0x359f99,_0x465105,_0x2e93e3,_0x5bf41f){const _0x234afb=_0x3190c8;currentSongIndex=allSongs['findIndex'](_0x52f8c6=>_0x52f8c6[_0x234afb(0x10c)]===_0xd35fa3),updateSongUI(_0x5bf41f),updateNextSongDisplay();currentWavesurfer&&currentWavesurfer[_0x234afb(0x129)]();music_coverUrl[_0x234afb(0x121)]=_0x2e93e3,music_songtitle[_0x234afb(0xf9)]=_0x359f99,music_subtitle[_0x234afb(0xf9)]=_0x465105;const _0x31c094=WaveSurfer[_0x234afb(0x100)]({'container':'#progress_wavesurfing','waveColor':_0x234afb(0xe4),'progressColor':_0x234afb(0x150),'barWidth':0x4,'barHeight':0x1,'barMinHeight':0x1,'height':0x1e,'responsive':!![],'hideScrollbar':!![],'barRadius':0x4});_0x31c094[_0x234afb(0x124)](_0xd35fa3),_0x31c094['on'](_0x234afb(0x136),()=>{const _0x303cdd=_0x234afb;_0x31c094[_0x303cdd(0x12c)](),playbtn[_0x303cdd(0x121)]=_0x303cdd(0xdd);music_player['classList'][_0x303cdd(0x10e)]('music_player_enlarge')&&(wavebar_animation_container[_0x303cdd(0xee)][_0x303cdd(0xfe)]='visible');if(currentPlayingElement){const _0x114f43=currentPlayingElement[_0x303cdd(0xe5)](_0x303cdd(0x11f));_0x114f43&&(_0x114f43[_0x303cdd(0x121)]=_0x303cdd(0xdd));}}),_0x31c094['on']('finish',()=>{const _0x13ead6=_0x234afb;console['log'](_0x13ead6(0x127)),updateSongUI(null),playNextSong();});const _0x4d856b=document[_0x234afb(0x145)]('startRunning'),_0x384151=document[_0x234afb(0x145)]('endRunning');_0x31c094['on']('audioprocess',()=>{const _0x370673=_0x234afb,_0x521df7=_0x31c094[_0x370673(0x10a)]();_0x4d856b['textContent']=_0x3450ce(_0x521df7);}),_0x31c094['on'](_0x234afb(0x136),()=>{const _0x4e25cb=_0x234afb,_0x54ecd3=_0x31c094['getDuration']();_0x384151[_0x4e25cb(0xf9)]=_0x3450ce(_0x54ecd3);});function _0x3450ce(_0x5a2946){const _0x4ff9aa=_0x234afb,_0x3d11d1=Math['floor'](_0x5a2946/0x3c),_0x4028ee=Math[_0x4ff9aa(0x10d)](_0x5a2946%0x3c);return _0x3d11d1[_0x4ff9aa(0xef)]()['padStart'](0x2,'0')+':'+_0x4028ee['toString']()[_0x4ff9aa(0x137)](0x2,'0');}return previousSong&&(previousSong[_0x234afb(0xe8)]=function(_0x34560e){_0x34560e['stopPropagation'](),playPreviousSong();}),nextSong&&(nextSong[_0x234afb(0xe8)]=function(_0x3ed639){const _0x4727f1=_0x234afb;_0x3ed639[_0x4727f1(0x104)](),playNextSong();}),backward&&(backward[_0x234afb(0xe8)]=function(_0x4a0002){const _0x18a8dc=_0x234afb;_0x4a0002[_0x18a8dc(0x104)]();const _0x24bfc7=_0x31c094[_0x18a8dc(0x10a)]();_0x31c094[_0x18a8dc(0xec)]((_0x24bfc7-0xa)/_0x31c094['getDuration']());}),forward&&(forward['onclick']=function(_0x593789){const _0x5e1b13=_0x234afb;_0x593789[_0x5e1b13(0x104)]();const _0x2b6f38=_0x31c094[_0x5e1b13(0x10a)]();_0x31c094[_0x5e1b13(0xec)](Math['min']((_0x2b6f38+0xa)/_0x31c094[_0x5e1b13(0x128)](),0x1));}),currentWavesurfer=_0x31c094,_0x31c094;}pausebtn[_0x3190c8(0xf4)](_0x3190c8(0x142),_0x5caa4b=>{const _0x1d86eb=_0x3190c8;_0x5caa4b[_0x1d86eb(0x104)]();if(currentWavesurfer){if(currentWavesurfer[_0x1d86eb(0x120)]()){currentWavesurfer[_0x1d86eb(0x12b)](),playbtn[_0x1d86eb(0x121)]='assets/play_button.png',wavebar_animation_container['style']['visibility']=_0x1d86eb(0x14c);if(currentPlayingElement){const _0x10f9dd=currentPlayingElement['querySelector'](_0x1d86eb(0xf7));_0x10f9dd&&(_0x10f9dd[_0x1d86eb(0x121)]=_0x1d86eb(0x105));}}else{currentWavesurfer[_0x1d86eb(0x12c)](),playbtn[_0x1d86eb(0x121)]='assets/pause_button.png';music_player['classList'][_0x1d86eb(0x10e)]('music_player_enlarge')&&(wavebar_animation_container['style']['visibility']='visible');if(currentPlayingElement){const _0x25f1e5=currentPlayingElement[_0x1d86eb(0xe5)]('img:last-child');_0x25f1e5&&(_0x25f1e5['src']=_0x1d86eb(0xdd));}}}else{if(allSongs[_0x1d86eb(0x106)]>0x0){const _0x6dd467=allSongs[0x0];playSong(_0x6dd467[_0x1d86eb(0x10c)],_0x6dd467[_0x1d86eb(0xf0)],_0x6dd467[_0x1d86eb(0x14b)],_0x6dd467[_0x1d86eb(0xfd)],_0x6dd467['element']);}}}),nextsongShow['addEventListener'](_0x3190c8(0x142),_0x3302b6=>{const _0x55a505=_0x3190c8;_0x3302b6[_0x55a505(0x104)](),showUpcomingSongs();}),updateNextSongDisplay(),loadAllSongs();function showUpcomingSongs(){const _0x4608c9=_0x3190c8;upcomingSongsDiv&&upcomingSongsDiv['remove']();upcomingSongsDiv=document[_0x4608c9(0x109)](_0x4608c9(0x125)),upcomingSongsDiv['id']='upcomingSongs',upcomingSongsDiv[_0x4608c9(0x13d)]=_0x4608c9(0x155);const _0x221484=document[_0x4608c9(0x109)](_0x4608c9(0x144));_0x221484['id']=_0x4608c9(0xe9),_0x221484[_0x4608c9(0xf9)]=_0x4608c9(0xd9),_0x221484[_0x4608c9(0xe8)]=()=>upcomingSongsDiv['remove'](),upcomingSongsDiv['appendChild'](_0x221484);const _0x3010c0=document[_0x4608c9(0x109)]('ul');_0x3010c0[_0x4608c9(0xee)]['listStyleType']=_0x4608c9(0x117),_0x3010c0[_0x4608c9(0xee)][_0x4608c9(0xfa)]='0';let _0x2957c6=isShuffleOn?[...playQueue]:allSongs[_0x4608c9(0x13c)](currentSongIndex+0x1);_0x2957c6['forEach']((_0x14225f,_0x1e3dd1)=>{const _0x56e2db=_0x4608c9,_0x4ea7a1=document[_0x56e2db(0x109)]('li');_0x4ea7a1[_0x56e2db(0xf9)]=_0x14225f['songName']+_0x56e2db(0xdc)+_0x14225f[_0x56e2db(0x14b)],_0x4ea7a1[_0x56e2db(0xe8)]=()=>{const _0x376a9a=_0x56e2db;playSong(_0x14225f[_0x376a9a(0x10c)],_0x14225f['songName'],_0x14225f[_0x376a9a(0x14b)],_0x14225f['imgUrl'],_0x14225f[_0x376a9a(0x12d)]),upcomingSongsDiv[_0x376a9a(0xeb)]();},_0x3010c0[_0x56e2db(0xf2)](_0x4ea7a1);}),upcomingSongsDiv[_0x4608c9(0xf2)](_0x3010c0),document[_0x4608c9(0xf6)][_0x4608c9(0xf2)](upcomingSongsDiv);}function updateNextSongDisplay(){const _0x23a06b=_0x3190c8;let _0x40c5ba;if(isShuffleOn)_0x40c5ba=playQueue[playQueue[_0x23a06b(0x106)]-0x1];else{const _0x2921ca=(currentSongIndex+0x1)%allSongs[_0x23a06b(0x106)];_0x40c5ba=allSongs[_0x2921ca];}_0x40c5ba?playnextsong['textContent']='Next:\x20'+_0x40c5ba[_0x23a06b(0xf0)]+_0x23a06b(0xdc)+_0x40c5ba[_0x23a06b(0x14b)]:playnextsong[_0x23a06b(0xf9)]=_0x23a06b(0x153);}function updateSongUI(_0x2c126f){const _0x54eaf8=_0x3190c8;if(currentPlayingElement){const _0x3fa8cc=currentPlayingElement[_0x54eaf8(0xe5)]('img:last-child');if(_0x3fa8cc)_0x3fa8cc[_0x54eaf8(0x121)]=_0x54eaf8(0x105);currentPlayingElement[_0x54eaf8(0xee)][_0x54eaf8(0x138)]='';}if(_0x2c126f){const _0x2ed5df=_0x2c126f[_0x54eaf8(0xe5)]('img:last-child');if(_0x2ed5df)_0x2ed5df[_0x54eaf8(0x121)]='assets/pause_button.png';_0x2c126f[_0x54eaf8(0xee)][_0x54eaf8(0x138)]=_0x54eaf8(0x150);}currentPlayingElement=_0x2c126f;}const shuffleButton=document['createElement'](_0x3190c8(0x144));shuffleButton['id']=_0x3190c8(0x108),shuffleButton[_0x3190c8(0xf9)]=_0x3190c8(0x147),shuffleButton[_0x3190c8(0xe8)]=toggleShuffle;const repeatButton=document[_0x3190c8(0x109)]('button');repeatButton['id']=_0x3190c8(0xff),repeatButton[_0x3190c8(0xf9)]='Repeat\x20Off',repeatButton[_0x3190c8(0xe8)]=toggleRepeat;const containerDiv=document['createElement']('div');containerDiv[_0x3190c8(0x13d)]=_0x3190c8(0xe6),containerDiv['appendChild'](shuffleButton),containerDiv[_0x3190c8(0xf2)](repeatButton),document[_0x3190c8(0xe5)](_0x3190c8(0x133))['after'](containerDiv);function toggleShuffle(){const _0x4efe80=_0x3190c8;isShuffleOn=!isShuffleOn,shuffleButton['textContent']=isShuffleOn?_0x4efe80(0x13a):_0x4efe80(0x147),isShuffleOn?shuffleArray(playQueue):playQueue=[...allSongs],updateNextSongDisplay();}function _0x2273(){const _0x3ffb16=['song\x20ended','getDuration','destroy','music_coverUrl_enlarge','pause','play','element','mini_close_container_enlarge','3vZqAzi','width','16373HozDUk','2801958VaTmLt','#progress_wavesurfing','.progress_container','15608kzbyTN','ready','padStart','backgroundColor','Song_Name','Shuffle\x20On','959696397808','slice','className','.wavebar_animation_container','count','121016SbPsxy','.song_content','click','controller_container_enlarge','button','getElementById','music_coverUrl','Shuffle\x20Off','false','pausebtn','AIzaSyCD48J3L4qUk8PUkYQ8vDWjQyI9Od-EaFU','subtitle','hidden','2856wHrvoq','titlesubtitle_container','playnextsong','hsl(283,\x20100%,\x2020%)','.music_player_title_container','Repeat\x20All','No\x20next\x20song','random','upcomingSongs','Close','display','flex','\x20-\x20','assets/pause_button.png','.nextsongShow','song_content','517uEOInz','music_player_container_enlarge','classList','.controller_container','hsl(283,\x20100%,\x2055%)','querySelector','shuffle_repeat_container','music_songtitle','onclick','closenextlistbtn','103340HHmTcP','remove','seekTo','data','style','toString','songName','pop','appendChild','height','addEventListener','createProfileElement','body','img:last-child','1.5em','textContent','padding','songs','3.5em','imgUrl','visibility','repeatButton','create','25012944SeiZtN','musicstreameronline-f1691.firebaseapp.com','252cXSwVR','stopPropagation','assets/play_button.png','length','playSong','shuffleButton','createElement','getCurrentTime','playPause','audioUrl','floor','contains','music_player_title_container_enlarge','music_player_enlarge','playbtn','forEach','img','60cxwlSV','211486cXskHd','.music_player_container','none','musicstreameronline-f1691','Repeat\x20Off','stop','visible','music_subtitle','.mini_close_container','querySelectorAll','img[src=\x22assets/play_button.png\x22]','isPlaying','src','alt','add','load','div','log'];_0x2273=function(){return _0x3ffb16;};return _0x2273();}function toggleRepeat(){const _0x2511b9=_0x3190c8;repeatMode=(repeatMode+0x1)%0x3;switch(repeatMode){case 0x0:repeatButton['textContent']=_0x2511b9(0x119);break;case 0x1:repeatButton[_0x2511b9(0xf9)]='Repeat\x20One';break;case 0x2:repeatButton[_0x2511b9(0xf9)]=_0x2511b9(0x152);break;}}function playNextSong(){const _0xecb4a2=_0x3190c8;if(repeatMode===0x1)currentWavesurfer['play'](0x0);else{let _0xd720fc;if(isShuffleOn){if(playQueue[_0xecb4a2(0x106)]===0x0){if(repeatMode===0x2)playQueue=[...allSongs],shuffleArray(playQueue),_0xd720fc=playQueue[_0xecb4a2(0xf1)]();else{endPlaylist();return;}}else _0xd720fc=playQueue[_0xecb4a2(0xf1)]();}else{if(currentSongIndex===allSongs[_0xecb4a2(0x106)]-0x1){if(repeatMode===0x2)currentSongIndex=0x0,_0xd720fc=allSongs[currentSongIndex];else{endPlaylist();return;}}else currentSongIndex=(currentSongIndex+0x1)%allSongs[_0xecb4a2(0x106)],_0xd720fc=allSongs[currentSongIndex];}_0xd720fc&&(wavebar_animation_container[_0xecb4a2(0xee)][_0xecb4a2(0xfe)]=_0xecb4a2(0x14c),playSong(_0xd720fc[_0xecb4a2(0x10c)],_0xd720fc['songName'],_0xd720fc[_0xecb4a2(0x14b)],_0xd720fc['imgUrl'],_0xd720fc[_0xecb4a2(0x12d)]));}}function endPlaylist(){const _0x45c4b6=_0x3190c8;currentWavesurfer[_0x45c4b6(0x11a)](),updateSongUI(null),playbtn[_0x45c4b6(0x121)]='assets/play_button.png';if(currentPlayingElement){const _0x3b096b=currentPlayingElement[_0x45c4b6(0xe5)](_0x45c4b6(0xf7));_0x3b096b&&(_0x3b096b[_0x45c4b6(0x121)]=_0x45c4b6(0x105),wavebar_animation_container[_0x45c4b6(0xee)][_0x45c4b6(0xfe)]=_0x45c4b6(0x14c));}}function playPreviousSong(){const _0x49d216=_0x3190c8,_0xd19493=new Date()['getTime'](),_0x6850ae=_0xd19493-lastClickTime;lastClickTime=_0xd19493;if(currentWavesurfer){if(_0x6850ae>0x12c||currentWavesurfer['getCurrentTime']()>0x3)currentWavesurfer['seekTo'](0x0);else{wavebar_animation_container['style'][_0x49d216(0xfe)]=_0x49d216(0x14c),currentSongIndex=(currentSongIndex-0x1+allSongs[_0x49d216(0x106)])%allSongs[_0x49d216(0x106)];const _0x46aea2=allSongs[currentSongIndex];playSong(_0x46aea2[_0x49d216(0x10c)],_0x46aea2[_0x49d216(0xf0)],_0x46aea2['subtitle'],_0x46aea2['imgUrl'],_0x46aea2[_0x49d216(0x12d)]);}}}function playRandomSong(){const _0x39ae14=_0x3190c8;if(allSongs[_0x39ae14(0x106)]>0x0){playQueue[_0x39ae14(0x106)]===0x0&&(playQueue=[...allSongs],shuffleArray(playQueue));const _0x2b10e6=playQueue[_0x39ae14(0xf1)]();playSong(_0x2b10e6[_0x39ae14(0x10c)],_0x2b10e6[_0x39ae14(0xf0)],_0x2b10e6[_0x39ae14(0x14b)],_0x2b10e6[_0x39ae14(0xfd)],_0x2b10e6[_0x39ae14(0x12d)]);}}function shuffleArray(_0x57f84){const _0x176038=_0x3190c8;for(let _0x32766c=_0x57f84[_0x176038(0x106)]-0x1;_0x32766c>0x0;_0x32766c--){const _0x1d81b8=Math[_0x176038(0x10d)](Math[_0x176038(0x154)]()*(_0x32766c+0x1));[_0x57f84[_0x32766c],_0x57f84[_0x1d81b8]]=[_0x57f84[_0x1d81b8],_0x57f84[_0x32766c]];}}music_player[_0x3190c8(0xf4)]('click',()=>{const _0x5f33f4=_0x3190c8,_0xb1d02f=document[_0x5f33f4(0x11e)]('.playerbtns');controller_container[_0x5f33f4(0xe2)]['add'](_0x5f33f4(0x143)),document[_0x5f33f4(0xe5)](_0x5f33f4(0x134))['style'][_0x5f33f4(0xda)]=_0x5f33f4(0xdb),document[_0x5f33f4(0xe5)]('.mini_close_container')[_0x5f33f4(0xee)]['visibility']=_0x5f33f4(0x11b),music_player_container[_0x5f33f4(0xe2)][_0x5f33f4(0x123)](_0x5f33f4(0xe1)),music_player_title_container['classList'][_0x5f33f4(0x123)](_0x5f33f4(0x10f)),document['querySelector'](_0x5f33f4(0x141))[_0x5f33f4(0xee)][_0x5f33f4(0xda)]=_0x5f33f4(0x117),nextsongShow[_0x5f33f4(0xee)]['display']=_0x5f33f4(0xdb),mini_close_container[_0x5f33f4(0xe2)][_0x5f33f4(0x123)](_0x5f33f4(0x12e)),music_player[_0x5f33f4(0xe2)][_0x5f33f4(0x123)](_0x5f33f4(0x110)),music_coverUrl[_0x5f33f4(0xe2)][_0x5f33f4(0x123)]('music_coverUrl_enlarge'),_0xb1d02f['length']>=0x3&&(_0xb1d02f[0x2][_0x5f33f4(0xee)][_0x5f33f4(0x130)]='3.5em',_0xb1d02f[0x2][_0x5f33f4(0xee)][_0x5f33f4(0xf3)]=_0x5f33f4(0xfc)),music_player[_0x5f33f4(0xe2)]['contains']('music_player_enlarge')&&playbtn[_0x5f33f4(0x121)]['includes'](_0x5f33f4(0xdd))?wavebar_animation_container[_0x5f33f4(0xee)]['visibility']=_0x5f33f4(0x11b):(wavebar_animation_container[_0x5f33f4(0xee)][_0x5f33f4(0xfe)]=_0x5f33f4(0x14c),console[_0x5f33f4(0x126)](_0x5f33f4(0x148)));}),minibtn[_0x3190c8(0xf4)](_0x3190c8(0x142),()=>{const _0x2779cd=_0x3190c8,_0x151a5b=document[_0x2779cd(0x11e)]('.playerbtns');controller_container[_0x2779cd(0xe2)][_0x2779cd(0xeb)](_0x2779cd(0x143)),document[_0x2779cd(0xe5)](_0x2779cd(0x134))['style'][_0x2779cd(0xda)]=_0x2779cd(0x117),document[_0x2779cd(0xe5)](_0x2779cd(0x141))[_0x2779cd(0xee)][_0x2779cd(0xda)]=_0x2779cd(0xdb),document['querySelector'](_0x2779cd(0x11d))[_0x2779cd(0xee)][_0x2779cd(0xfe)]=_0x2779cd(0x14c),nextsongShow[_0x2779cd(0xee)][_0x2779cd(0xda)]=_0x2779cd(0x117),music_player_container[_0x2779cd(0xe2)][_0x2779cd(0xeb)](_0x2779cd(0xe1)),music_player_title_container[_0x2779cd(0xe2)]['remove']('music_player_title_container_enlarge'),mini_close_container[_0x2779cd(0xe2)][_0x2779cd(0xeb)](_0x2779cd(0x12e)),music_player[_0x2779cd(0xe2)][_0x2779cd(0xeb)](_0x2779cd(0x110)),music_coverUrl[_0x2779cd(0xe2)][_0x2779cd(0xeb)](_0x2779cd(0x12a)),_0x151a5b['length']>=0x3&&(_0x151a5b[0x2][_0x2779cd(0xee)][_0x2779cd(0x130)]=_0x2779cd(0xf8),_0x151a5b[0x2][_0x2779cd(0xee)][_0x2779cd(0xf3)]=_0x2779cd(0xf8)),music_player['classList'][_0x2779cd(0x10e)]('music_player_enlarge')?wavebar_animation_container['style']['visibility']='visible':wavebar_animation_container[_0x2779cd(0xee)][_0x2779cd(0xfe)]='hidden';});
