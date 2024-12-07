const addGenre = async (event, genre, type, id) => {
  const url = type === 'playlists' ? `api/${type}/${id}/tags/${genre}` : `api/${type}/genre/${genre}`

  const response = await fetchProtectedResource(url, 'POST')
  if (response.ok) {
    event.srcElement.classList.remove('btn-secondary')
    event.srcElement.classList.add('btn-primary')
    event.srcElement.onclick = () => removeGenre(event, genre, type, id)
  } else {
    console.log(await response.json())
  }
}

const addSong = async (playlistId, songId) => {
  await fetchProtectedResource(`api/playlists/${playlistId}/songs/${songId}`, 'POST')
  displayPlaylist(playlistId)
  return
}

const checkCompatibility = async (genres2) => {
  const userId = localStorage.getItem('userId')

  const response = await fetchProtectedResource(`api/users/${userId}`)
  const data = await response.json()
  const genres1 = await data.preferences.genres

  // Se entrambe le liste sono vuote, la compatibilità è del 100%
  if (genres1.length === 0 && genres2.length === 0) {
    return 100;
  }

  // Calcola l'intersezione delle due liste
  const intersection = genres1.filter(genre => genres2.includes(genre));

  // Calcola l'unione delle due liste
  const union = new Set([...genres1, ...genres2]);

  // Calcola la percentuale di somiglianza
  const similarityPercentage = Math.floor((intersection.length / union.size) * 100);

  return similarityPercentage;
};

const checkCompatibilityNoAsync = (genres1, genres2) => {

  // Se entrambe le liste sono vuote, la compatibilità è del 100%
  if (genres1.length === 0 && genres2.length === 0) {
    return 100;
  }

  // Calcola l'intersezione delle due liste
  const intersection = genres1.filter(genre => genres2.includes(genre));

  // Calcola l'unione delle due liste
  const union = new Set([...genres1, ...genres2]);

  // Calcola la percentuale di somiglianza
  const similarityPercentage = Math.floor((intersection.length / union.size) * 100);

  return similarityPercentage;
};

const createUnfillHeartButton = (type, id) => {
  const heartButton = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  heartButton.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  heartButton.setAttribute('width', '30');
  heartButton.setAttribute('height', '30');
  heartButton.setAttribute('fill', 'currentColor');
  heartButton.setAttribute('viewBox', '0 0 16 16');
  heartButton.setAttribute('class', 'like');

  // Aggiungi l'evento onclick
  heartButton.addEventListener('click', function (event) {
    like(event, type, id);
  });

  // Crea l'elemento <path>
  const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  pathElement.setAttribute('d', 'm8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15');
  heartButton.appendChild(pathElement);
  return heartButton;
}

const dislike = async (event, type, id) => {
  const likeContainer = document.getElementById(`like-${type}-${id}`)
  const response = await fetchProtectedResource(`/api/users/${type}/${id}`, `DELETE`)

  if (response.ok) likeContainer.innerHTML = printLikeHeart(type, id);
  else console.log(await response.json())

  return
}

const ellipsis = (s) => {
  return s.length > 17 ? s.substr(0, 17) + `...` : s
}

const like = async (event, type, id) => {
  const likeContainer = document.getElementById(`like-${type}-${id}`)
  const response = await fetchProtectedResource(`/api/users/${type}/${id}`, `POST`)
  
  if (response.ok) likeContainer.innerHTML = printDislikeHeart(type, id);
  else console.log(await response.json())

  return
}

const printAlbum = (album) => {
  return `<div class="col-12 col-lg-3">
          <div class="image-wrap-2">
            <div class="image-info">
              <h4 class="mb-2 text-white" title="${album.name}">${ellipsis(album.name)}</h4>
              <h5 class="mb-3" title="${album.artists[0].name}">${ellipsis(album.artists[0].name)}</h5>
            </div>
            <img src="${album.images[0].url}" alt="Image" class="img-fluid">
          </div>
        </div>
        `
}

const printArtist = (artist, user) => {
  let artistHTML = `
    <div class="col-12 col-md-8 col-lg-4 col-xl-2 text-center h-100">
      <div class="image-container mb-4">
        <img src="${artist.images.length > 0 ? artist.images[0].url : `/uploads/avatars/artists/0.jpg`}" alt="Image" class="img-fluid rounded-circle">
      </div>
        <h4 class="text-white font-weight-light ellipsis" title="${artist.name}">${ellipsis(artist.name)}</h4>
        <p class="text-primary"><strong class="font-weight-bold">${artist.popularity} / 100</strong> <i>popularity</i></p>
      <div class="like-section m-2" id="like-artist-${artist.id}">`
        
  if (user.preferences.artists.includes(artist.id)) artistHTML += printDislikeHeart('artist', artist.id)
  else artistHTML += printLikeHeart('artist', artist.id)
      
  artistHTML += `</div></div>`
  
  return artistHTML
}

const prettyDate = (date) => {
  const dateObj = new Date(date);

  // Opzione per formattare la data
  const options = {
    year: 'numeric', // Anno in formato numerico (e.g., "2024")
    month: 'long', // Nome completo del mese (e.g., "July")
    day: 'numeric' // Giorno del mese (e.g., "25")
  };

  // Creare un formatter con le opzioni specificate
  const formatter = new Intl.DateTimeFormat('en-US', options);

  // Formattare e stampare la data
  return formatter.format(dateObj);
}

const printDislikeHeart = (type, id) => {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="red" class="like" 
      viewBox="0 0 16 16" onclick="dislike(event, '${type}', '${id}')">
      <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314" />
    </svg>`
}

const printGenresList = async (type, element, container) => {
  const response = await fetchProtectedResource('api/search/spotify/genres/')
  const genres = await response.json()

  const genresList = type === 'playlists' ? element.tags : element.preferences.genres

  genres.forEach(genre => {
    const contains = genresList.includes(genre)
    container.innerHTML += `<button class="btn m-1 ${contains ? 'btn-primary' : 'btn-secondary'}" onclick="${contains ? 'removeGenre' : 'addGenre'}(event, '${genre}', '${type}', '${element._id}')">${genre}</button>`
  })
}

const printLikeHeart = (type, id) => {
return `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="like" 
      viewBox="0 0 16 16" onclick="like(event, '${type}', '${id}')">
      <path
        d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15" />
    </svg>`
}

const printPlaylist = (playlist, user, author = true) => {
  let playlistHTML = `<div class="col-12 col-md-6 col-lg-3 text-center mb-3"><div class="h-100 p-4 p-lg-5 site-block-feature-7">
                  <div onclick="displayPlaylist('${playlist._id}')">
                    <img src="/uploads/avatars/playlists/${playlist._id}.jpg" class="img-fluid mb-4 w-75">
        
                    <h4 class="text-white h4" title="${playlist.title}">${ellipsis(playlist.title)}</h4>`
        
  if (author) {
    playlistHTML += `<a class="text-white" title="${playlist.owner.username}" onclick="displayUser('${playlist.owner._id}')">${ellipsis(playlist.owner.username)}</a>`
  }
                    
  playlistHTML += `<p class="font-weight-bold text-primary">${playlist.songs.length} songs</strong></p></div>`

  if (playlist.owner._id !== user._id) {
    playlistHTML += `<div class="like-section m-2" id="like-playlist-${playlist._id}">`
    
    if (user.preferences.playlists.includes(playlist._id)) playlistHTML += printDislikeHeart('playlist', playlist._id)
    else playlistHTML += printLikeHeart('playlist', playlist._id)

    playlistHTML += `</div>`
  }
                  
  playlistHTML += `</div></div>`

  return playlistHTML
}

const printPlaylistAddSong = (playlist, songId) => {
  return `<div class="col-12 col-md-6 col-lg-3 text-center mb-3">
            <div class="h-100 p-4 p-lg-5 site-block-feature-7" onclick="addSong('${playlist._id}', '${songId}')">
                  <div>
                    <img src="/uploads/avatars/playlists/${playlist._id}.jpg" class="img-fluid mb-4 w-75">
        
                    <h4 class="text-white h4" title="${playlist.title}">${ellipsis(playlist.title)}</h4>
        
                    <p class="font-weight-bold text-primary">${playlist.songs.length} songs</strong></p></div>
                  </div>
                </div></div>`
}

const printSong = (track) => {
  return `
    <div class="col-12 col-md-6 col-lg-3 text-center mb-3">
      <div class="h-100 p-4 p-lg-5 site-block-feature-7">
        <img src="${track.album.images[0].url}" class="img-fluid mb-4 w-75">
        <h4 class="text-white h4" title="${track.name}">${ellipsis(track.name)}</h4>
        <p class="text-white" title="${track.artists[0].name}">${ellipsis(track.artists[0].name)}</p>
        <div class="like-section">
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="like" viewBox="0 0 16 16" onclick="displayAddToPlaylist('${track.id}')">
            <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15" />
          </svg>
        </div>
      </div>
    </div>`
}

const printSongPlaylist = (track, playlistId, ownerId) => {
  songHTML = `
    <div class="col-12 col-md-6 col-lg-3 text-center mb-3">
      <div class="h-100 p-4 p-lg-5 site-block-feature-7">
        <img src="${track.album.images[0].url}" class="img-fluid mb-4 w-75">
        <h4 class="text-white h4" title="${track.name}">${ellipsis(track.name)}</h4>
        <p class="text-white" title="${track.artists[0].name}">${ellipsis(track.artists[0].name)}</p>
        <div class="like-section">
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="like m-1" viewBox="0 0 16 16" onclick="displayAddToPlaylist('${track.id}')">
            <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15" />
          </svg>`
    
    const userId = localStorage.getItem('userId')

    if(userId == ownerId){
      
      songHTML += `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="like m-1" viewBox="0 0 16 16" onclick="removeSong(event, '${track.id}', '${playlistId}')">
  <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
</svg>`
    }

  songHTML += `</div></div></div>`
  return songHTML
}

const printUser = (user, userLogged) => {
  let userHTML = `
    <div class="col-12 col-md-4 col-lg-2 col-xl-2 text-center h-100">
      <div onclick="displayUser('${user._id}')">
        <div class="image-container mb-4">
          <img src="/uploads/avatars/users/${user._id}.jpg" alt="Image" class="img-fluid rounded-circle">
        </div>
        <h4 class="text-white font-weight-light" title="${user.username}">${ellipsis(user.username)}</h4>
        <p title="${user.firstName} ${user.lastName}">${ellipsis(user.firstName + ` ` + user.lastName)}</p>
      </div>`

  if (userLogged._id !== user._id) {
    userHTML += `<div class="like-section m-2" id="like-following-${user._id}">`
      
    if (userLogged.preferences.following.includes(user._id)) userHTML += printDislikeHeart('following', user._id)
    else userHTML += printLikeHeart('following', user._id)
  
    userHTML += `</div>`
  }

  userHTML += `</div>`

  return userHTML
}

const removeGenre = async (event, genre, type, id) => {
  const url = type === 'playlists' ? `api/${type}/${id}/tags/${genre}` : `api/${type}/genre/${genre}`

  const response = await fetchProtectedResource(url, 'DELETE')
  if(response.ok){
    event.srcElement.classList.remove('btn-primary')
    event.srcElement.classList.add('btn-secondary')
    event.srcElement.onclick = () => addGenre(event, genre, type, id)
  } else {
    console.log(await response.json())
  }
}

const removeSong = async (event, songId, playlistId) => {
  event.target.parentElement.parentElement.parentElement.outerHTML = null
  await fetchProtectedResource(`api/playlists/${playlistId}/songs/${songId}`, 'DELETE')
  return
}