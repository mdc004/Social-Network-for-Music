const usernameHello = document.getElementById('username-hello')

const hideAllSections = () => {
  const contents = document.querySelectorAll(`.content`)
  contents.forEach(content => {
    content.style.display = `none`
  })

  
}

const displayNav = async () => {
  const usernameLink = document.getElementById(`username-link`)
  const navbar = document.getElementById(`navbar`)

  const userId = localStorage.getItem(`userId`)

  const response = await fetchProtectedResource(`api/users/${userId}`, `GET`)
  if (response.ok){
    const user = await response.json()
    
    usernameHello.innerText = user.username
    
    usernameLink.onclick = () => displayUser(userId)

    navbar.style.visibility = `visible`
  } else {
    hideNav()
  }

  return
}

const displayPreview = () => {
  hideAllSections()

  const activeContent = document.getElementById(`preview`)
  activeContent.style.display = `block`

  
}

const hideNav = () => {
  const navbar = document.getElementById(`navbar`)

  navbar.style.visibility = `hidden`
}

const displayLogin = () => {
  hideAllSections()
  hideNav()

  const activeContent = document.getElementById(`login`)
  activeContent.style.display = `block`

  
}

const displayHome = async () => {
  hideAllSections()

  const activeContent = document.getElementById(`home`)
  activeContent.style.display = `block`

  const playlistsSection = document.getElementById('home-playlists-section')
  const playlistsContainer = document.getElementById('home-playlists')

  const userId = localStorage.getItem('userId')

  let response = await fetchProtectedResource(`api/users/${userId}`)
  const user = await response.json()

  response = await fetchProtectedResource(`api/users/${user._id}/playlists`)
  const playlists = await response.json()

  playlistsContainer.innerHTML = null

  if (!playlists.error) {
    playlistsSection.style.display = `block`

    playlists.forEach(playlist => {
      playlist.owner = user
      playlistsContainer.innerHTML += printPlaylist(playlist, user, false)
    })
  } else {
    playlistsSection.style.display = `none`
  }

  
}

const displaySearch = async () => {
  hideAllSections()

  const activeContent = document.getElementById(`search`)
  activeContent.style.display = `block`
}

const displayPlaylistSearch = async () => {
  hideAllSections()

  const activeContent = document.getElementById(`playlist-search`)
  activeContent.style.display = `block`

  const response = await fetchProtectedResource('api/search/spotify/genres/')
  const genres = await response.json()

  const genresContainer = document.getElementById('playlist-search-genres-container')

  genres.forEach(genre => {
    const active = genresFilter.includes(genre)
    genresContainer.innerHTML += `<button class="btn m-1 ${active ? 'btn-primary' : 'btn-secondary'}" onclick="${active ? 'remove' : 'add'}GenreFilter(event, '${genre}')">${genre}</button>`
  })
}

const displayUser = async (userId) => {
  const activeContent = document.getElementById(`user`)
  const info = document.getElementById(`user-info`)

  const followedUsers = document.getElementById('user-following-section')
  const followedArtists = document.getElementById('user-followed-artists-section')
  const playlistsSection = document.getElementById('user-playlists-section')
  const followedPlaylists = document.getElementById('user-followed-playlists-section')

  const followedUsersContainer = document.getElementById('user-following')
  const followedArtistsContainer = document.getElementById('user-followed-artists')
  const playlistsContainer = document.getElementById('user-playlists')
  const followedPlaylistsContainer = document.getElementById('user-followed-playlists')
  
  let response = await fetchProtectedResource(`api/users/${userId}`)
  const user = await response.json()
  
  response = await fetchProtectedResource(`api/users/${user._id}/playlists`)
  const playlists = await response.json()

  const loggedUserId = localStorage.getItem('userId')
  response = await fetchProtectedResource(`api/users/${loggedUserId}`)
  const loggedUser = await response.json()

  hideAllSections()

  info.innerHTML = `    
          <div class="row justify-content-center align-items-center">
            <div class="col-md-3">
              <img src="/uploads/avatars/users/${user._id}.jpg" alt="Image" class="img-fluid w-100 rounded-circle mb-4">
            </div>
            <div class="col-md-6">
              <h1 class="text-white font-weight-light">${user.username}</h1>
              <h5 class="text-white font-weight-light">${user.firstName + ' ' + user.lastName}</h5>
              <p class="font-weight-bold text-primary overflow-orizzontal">
                ${await checkCompatibility(user.preferences.genres)}% compatible
              </p>
              <p>${user.info ? user.info : ``}</p>
              <p class="text-white">${playlists.error ? 0 : playlists.length} playlist created, ${user.preferences.artists.length} following artists, ${user.preferences.playlists.length} following playlists, ${!user.preferences.following ? 0 : user.preferences.following.length} following users</p>
              <p>Account created ${prettyDate(user.createdAt)}</p>
            </div>
          
        </div>`

  followedUsersContainer.innerHTML = null

  if (user.preferences.following && user.preferences.following.length !== 0) {
    followedUsers.style.display = `block`

    user.preferences.following.forEach(async userFollowedId => {
      const response = await fetchProtectedResource(`api/users/${userFollowedId}`)
      const userFollowed = await response.json()

      followedUsersContainer.innerHTML += printUser(userFollowed, loggedUser)
    })
  } else {
    followedUsers.style.display = `none`
  }

  followedArtistsContainer.innerHTML = null

  if (user.preferences.artists.length !== 0) {
    followedArtists.style.display = `block`

    user.preferences.artists.forEach(async artistId => {
      const response = await fetchProtectedResource(`api/search/spotify/artist/${artistId}`)
      const artist = await response.json()

      followedArtistsContainer.innerHTML += printArtist(artist, loggedUser)
    })
  } else {
    followedArtists.style.display = `none`
  }

  playlistsContainer.innerHTML = null

  if (!playlists.error) {
    playlistsSection.style.display = `block`

    playlists.forEach(playlist => {
      playlist.owner = user
      playlistsContainer.innerHTML += printPlaylist(playlist, loggedUser, false)
    })
  } else {
    playlistsSection.style.display = `none`
  }

  followedPlaylistsContainer.innerHTML = null

  if (user.preferences.playlists.length !== 0) {
    followedPlaylists.style.display = `block`
    console.log(user)
    user.preferences.playlists.forEach(async playlistId => {
      const response = await fetchProtectedResource(`api/playlists/${playlistId}`)
      const playlist = await response.json()
      
      if (!playlist.error) {
        if (playlist.owner !== user._id) {
          const response = await fetchProtectedResource(`api/users/${playlist.owner}`)
          const owner = await response.json()

          playlist.owner = await owner
        } else {
          playlist.owner = user
        }
        followedPlaylistsContainer.innerHTML += printPlaylist(playlist, loggedUser)
      }
    })
  } else {
    followedPlaylists.style.display = `none`
  }

  activeContent.style.display = `block`

  return
}

const displayPlaylist = async (playlistId) => {
  hideAllSections()

  const activeContent = document.getElementById(`playlist`)
  const songsContainer = document.getElementById('playlist-container')
  const playlistInfo = document.getElementById('playlist-info')

  let response = await fetchProtectedResource(`api/playlists/${playlistId}`)
  const playlist = await response.json()

  const ownerId = await playlist.owner

  songsContainer.innerHTML = null

  playlist.songs.forEach(async songId => {
    const response = await fetchProtectedResource(`api/search/spotify/track/${songId}`)
    const song = await response.json()

    songsContainer.innerHTML += printSongPlaylist(song, playlistId, ownerId)
  })

  response = await fetchProtectedResource(`api/users/${playlist.owner}`)
  const owner = await response.json()
  playlist.owner = owner

  const openLocker = `<path d="M11 1a2 2 0 0 0-2 2v4a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h5V3a3 3 0 0 1 6 0v4a.5.5 0 0 1-1 0V3a2 2 0 0 0-2-2"/>`
  const closedLocker = `<path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2m3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2M5 8h6a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1"/>`

  info = `          <div class="row justify-content-center align-items-center">
            <div class="col-md-3 m-4">
              <img src="/uploads/avatars/playlists/${playlist._id}.jpg" alt="Image" class="img-fluid w-100">
            </div>
            <div class="col-md-6">
              <h1 class="text-white font-weight-light" title="${playlist.title}">${ellipsis(playlist.title)}</h1>
              <p>${playlist.description ? playlist.description : ''}</p>
              <p>Playlist created ${prettyDate(playlist.createdAt)}</p>
              <p class="font-weight-bold text-primary overflow-orizzontal">${await checkCompatibility(playlist.tags)}% compatible</p>
              <a class="text-white" title="${playlist.owner.username}" onclick="displayUser('${playlist.owner._id}')">${ellipsis(playlist.owner.username)}</a>
              <p class="text-primary">${playlist.songs.length} <i>songs</i></p>
              <p>Playlist updated ${prettyDate(playlist.updatedAt)}</p>
    <svg xmlns="http://www.w3.org/2000/svg" width="35" height="30" fill="currentColor" title="private" class="like m-2" viewBox="0 0 16 16" onclick="changePlaylistVisibility(event, '${playlistId}')">${playlist.public ? openLocker : closedLocker}</svg>`

  const userId = localStorage.getItem('userId')
  if (playlist.owner._id === userId){
    info += `<a class="btn btn-outline-white py-2 px-4" onclick="displayEditPlaylist('${playlistId}')">Edit</a>`
  }

  info += `</div></div>`

  playlistInfo.innerHTML = info

  activeContent.style.display = `block`
  
}

const displaySignUp = () => {
  hideAllSections()

  const activeContent = document.getElementById(`sign-up`)
  activeContent.style.display = `block`
  
  
}

const displayEditProfile = async () => {
  hideAllSections()

  const activeContent = document.getElementById(`edit-profile`)
  const avatarImg = document.getElementById(`avatar-img`)
  const firstName = document.getElementById(`update-first-name`)
  const lastName = document.getElementById(`update-last-name`)
  const info = document.getElementById(`update-info`)
  const genresContainer = document.getElementById('update-profile-genres-list')

  const userId = localStorage.getItem(`userId`)
  avatarImg.src = `/uploads/avatars/users/${userId}.jpg`

  const response = await fetchProtectedResource(`api/users/${userId}`, `GET`)

  const user = await response.json()

  firstName.value = user.firstName
  lastName.value = user.lastName
  info.value = user.info ? user.info : ``

  await printGenresList('users', user, genresContainer)

  activeContent.style.display = `block`
  
}

const displayAddToPlaylist = async songId => {
  hideAllSections()
  const activeContent = document.getElementById(`add-to-playlist`)
  const playlistsContainer = document.getElementById('add-to-playlist-playlists')

  const userId = localStorage.getItem('userId')


  const response = await fetchProtectedResource(`api/users/${userId}/playlists/`)
  const playlists = await response.json()

  if(!playlists.error) {
    playlists.forEach(playlist => {
      playlistsContainer.innerHTML += printPlaylistAddSong(playlist, songId)
    })
  } else {
    const title = document.getElementById('add-to-playlist-title')
    title.innerText = 'Before you need to create a playlist'
  }


  activeContent.style.display = `block`
  
}

const displayCreatePlaylist = async () => {
  hideAllSections()

  const activeContent = document.getElementById(`create-playlist`)

  activeContent.style.display = `block`
  
}

const displayEditPlaylist = async playlistId => {
  hideAllSections()

  const playlistIdContainer = document.getElementById('edit-playlist-playlistId')

  playlistIdContainer.innerText = playlistId

  const titleInput = document.getElementById(`edit-playlist-title`)
  const descriptionInput = document.getElementById(`edit-playlist-description`)

  const response = await fetchProtectedResource(`api/playlists/${playlistId}`)
  const playlist = await response.json()

  titleInput.value = playlist.title
  descriptionInput.value = playlist.description 

  const deleteContainer = document.getElementById('edit-playlist-delete-container')
  deleteContainer.innerHTML += `<button class="btn btn-danger py-2 px-4 text-white" onclick="deletePlaylist('${playlistId}')">Delete Playlist</button>`

  const genresContainer = document.getElementById('update-playlist-genres-list')
  
  await printGenresList('playlists', playlist, genresContainer)
  
  const activeContent = document.getElementById(`edit-playlist`)

  activeContent.style.display = `block`
  
}

// display home aggiorna il contatore ultima scheda con home
displayHome()
displayNav()