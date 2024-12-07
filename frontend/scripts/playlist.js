const removePlaylistAvatar = async (event) => {
  event.preventDefault()

  const avatarImg = document.getElementById(`edit-playlist-avatar-img`)

  const playlistIdContainer = document.getElementById('edit-playlist-playlistId')
  const playlistId = playlistIdContainer.innerText

  const response = await fetchProtectedResource(`api/playlists/${playlistId}/avatar`, `DELETE`)

  const removeAvatarMessage = document.getElementById(`edit-playlist-remove-avatar-message`)

  if (response.ok) {
    avatarImg.src = `uploads/avatars/playlists/0.jpg`
  } else {
    const data = await response.json()
    removeAvatarMessage.innerText = data.error.message
  }
}

const updatePlaylistAvatar = async (event) => {
  event.preventDefault()

  const avatarImg = document.getElementById(`edit-playlist-avatar-img`)
  const avatarImgInput = document.getElementById(`edit-playlist-avatar-img-input`)

  const avatar = avatarImgInput.files[0]

  const formData = new FormData();
  formData.append(`avatar`, avatar)

  const playlistIdContainer = document.getElementById('edit-playlist-playlistId')
  const playlistId = playlistIdContainer.innerText

  const response = await fetchProtectedResource(`api/playlists/${playlistId}/avatar`, `POST`, formData)

  const updateAvatarMessage = document.getElementById(`edit-playlist-update-avatar-message`)

  if (response.ok) {
    avatarImg.src = `/uploads/avatars/playlists/${playlistId}.jpg`
    updateAvatarMessage.innerText = `Avatar updated`
  } else {
    const data = await response.json()
    updateAvatarMessage.innerText = data.error.message
  }
}

const updatePlaylistInfo = async (event) => {
  event.preventDefault()

  const titleInput = document.getElementById(`edit-playlist-title`)
  const descriptionInput = document.getElementById(`edit-playlist-description`)

  const title = titleInput.value
  const description = descriptionInput.value ? descriptionInput.value : ``

  const body = {
    title: title,
    description: description,
  }
  const playlistIdContainer = document.getElementById('edit-playlist-playlistId')
  const playlistId = playlistIdContainer.innerText

  const response = await fetchProtectedResource(`api/playlists/${playlistId}/info`, `PATCH`, body)
  const updateProfileMessage = document.getElementById(`edit-playlist-info-message`)

  if (response.ok) {
    updateProfileMessage.innerText = `Playlist updated`
  } else {
    const data = await response.json()
    updateProfileMessage.innerText = data.error.message
  }
}

const changePlaylistVisibility = async (event, playlistId) => {
  const openLockerPath = `M11 1a2 2 0 0 0-2 2v4a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h5V3a3 3 0 0 1 6 0v4a.5.5 0 0 1-1 0V3a2 2 0 0 0-2-2`;
  const closedLockerPath = `M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2m3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2M5 8h6a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1`;

  // Target the <path> element inside the SVG
  const svgPath = event.currentTarget.querySelector('path');

  if (svgPath.getAttribute('d') === openLockerPath) {
    console.log("Closing the lock");
    svgPath.setAttribute('d', closedLockerPath);
  } else {
    console.log("Opening the lock");
    svgPath.setAttribute('d', openLockerPath);
  }
  await fetchProtectedResource(`api/playlists/${playlistId}/visibility`, `PATCH`)
}

const deletePlaylist = async (playlistId) => {
  await fetchProtectedResource(`api/playlists/${playlistId}`, 'DELETE')
  displayHome()
}

const createPlaylist = async (event) => {
  event.preventDefault()

  const titleInput = document.getElementById('create-playlist-title')
  const descriptionInput = document.getElementById('create-playlist-description')

  const messageBox = document.getElementById('create-playlist-message-box')

  const body = {
    title: titleInput.value,
    description: descriptionInput.value
  }

  const response = await fetchProtectedResource(`api/playlists/`, `POST`, body)

  const data = await response.json()

  if (data.error) {
    messageBox.innerText = data.error.message
  } else {
    displayPlaylist(data.playlistId)
    console.log(data)
  }
  return
}

let genresFilter = []
let songsFilter = []

const addGenreFilter = async (event, genre) => {
  const button = event.srcElement

  button.outerHTML = `<button class="btn m-1 btn-primary" onclick="removeGenreFilter(event, '${genre}')">${genre}</button>`

  genresFilter.push(genre)

  searchPlaylist()

  return
}

const removeGenreFilter = async (event, genre) => {
  const button = event.srcElement

  button.outerHTML = `<button class="btn m-1 btn-secondary" onclick="addGenreFilter(event, '${genre}')">${genre}</button>`

  genresFilter = genresFilter.filter(el => el !== genre)

  searchPlaylist()

  return
}

const searchPlaylist = async () => {

  const searchInput = document.getElementById('playlist-search-input')
  const value = searchInput.value

  const playlistsContainer = document.getElementById('playlist-search-container')

  playlistsContainer.innerHTML = null

  let response = await fetchProtectedResource(`api/search/${value}?types=playlist`, 'GET')

  if (!response.ok) return

  let data = await response.json()
  if (!data.playlists || data.error) return

  const loggedUserId = localStorage.getItem('userId')
  response = await fetchProtectedResource(`api/users/${loggedUserId}`)
  const loggedUser = await response.json()

  data.playlists = data.playlists.filter(playlist =>
    genresFilter.every(tag => playlist.tags.includes(tag))
  );


  data.playlists = data.playlists.filter(playlist =>
    songsFilter.every(songId => playlist.songs.includes(songId))
  );

  data.playlists.forEach(async playlist => {
    if (playlist.owner === loggedUserId) playlist.owner = loggedUser
    else {
      response = await fetchProtectedResource(`api/users/${playlist.owner}`)
      const owner = await response.json()
      playlist.owner = owner
    }

    playlistsContainer.innerHTML += printPlaylist(playlist, loggedUser)
  })
  return
}

const searchSong = async () => {
  const searchInput = document.getElementById('playlist-search-song-input')
  const value = searchInput.value

  const songsContainer = document.getElementById('playlist-search-songs-container')
  songsContainer.innerHTML = null

  const response = await fetchProtectedResource(`api/search/spotify/${value}?types=track`)
  const data = await response.json()

  data.tracks.items.forEach(track => {
    songsContainer.innerHTML += `
    <div class="col-12 col-md-6 col-lg-2 text-center mb-3">
      <div class="h-100 p-4 p-lg-5 site-block-feature-7">
        <div data-toggle="modal" data-target="#playlistModal">
          <img src="${track.album.images[0].url}" class="img-fluid mb-4 w-75">
          <h4 class="text-white h4" title="${track.name}">${ellipsis(track.name)}</h4>
          <p class="text-white" title="${track.artists[0].name}">${ellipsis(track.artists[0].name)}</p>
        </div>
        <div class="like-section">
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="like" viewBox="0 0 16 16" onclick="addSongFilter('${track.id}', '${track.name}')">
            <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
          </svg>
        </div>
      </div>
    </div>`
  })

  return
}

const addSongFilter = async (id, name) => {
  const songsContainer = document.getElementById('playlist-search-songs-filter-container')

  songsContainer.innerHTML += `<button class="btn m-1 btn-primary" onclick="removeSongFilter(event, '${id}')">${name}</button>`

  songsFilter.push(id)

  searchPlaylist()

  return
}

const removeSongFilter = (event, id) => {
  event.srcElement.outerHTML = null

  songsFilter = songsFilter.filter(songId => songId !== id)

  searchPlaylist()

  return
}