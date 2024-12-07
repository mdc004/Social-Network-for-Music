const usersContainer = document.getElementById('search-users-container')
const playlistsContainer = document.getElementById('search-playlists-container')
const artistsContainer = document.getElementById('search-artists-container')
const songsContainer = document.getElementById('search-songs-container')
const albumsContainer = document.getElementById('search-albums-container')

const usersSection = document.getElementById('search-users')
const playlistsSection = document.getElementById('search-playlists')
const artistsSection = document.getElementById('search-artists')
const songsSection = document.getElementById('search-songs')
const albumsSection = document.getElementById('search-albums')

usersSection.style.display = `none`
playlistsSection.style.display = `none`
artistsSection.style.display = `none`
songsSection.style.display = `none`
albumsSection.style.display = `none`

const search = async () => {
  const input = document.getElementById('search-input')
  const value = input.value

  if(!value) {
    return null
  }

  const loggedUserId = localStorage.getItem('userId')
  let response = await fetchProtectedResource(`api/users/${loggedUserId}`)
  const loggedUser = await response.json()

  response = await fetchProtectedResource(`api/search/${value}`, 'GET')
  
  let data = await response.json()
  
  if (!response || response === null) {
    console.log(data)
    return
  }

  usersContainer.innerHTML = null

  if (data.users && data.users.length !== 0){
    usersSection.style.display = `block`
    data.users.forEach(user => {
      usersContainer.innerHTML += printUser(user, loggedUser)
    })
  } else {
    usersSection.style.display = `none`
  }

  playlistsContainer.innerHTML = null

  if (data.playlists && data.playlists.length !== 0) {
    playlistsSection.style.display = `block`
    data.playlists.forEach(async playlist => {
      if (playlist.owner === loggedUserId) playlist.owner = loggedUser
      else {
        response = await fetchProtectedResource(`api/users/${playlist.owner}`)
        const owner = await response.json()
        playlist.owner = owner
      }

      playlistsContainer.innerHTML += printPlaylist(playlist, loggedUser)
    })
  } else {
    playlistsSection.style.display = `none`
  }

  response = await fetchProtectedResource(`api/search/spotify/${value}?types=album,artist,track`)

  data = await response.json()

  if (!response || response === null) {
    console.log(data)
    return
  }

  artistsContainer.innerHTML = null

  if (data.artists.length !== 0) {
    artistsSection.style.display = `block`
    data.artists.items.forEach(artist => artistsContainer.innerHTML += printArtist(artist, loggedUser))
  } else {
    artistsSection.style.display = `none`
  }

  songsContainer.innerHTML = null

  if (data.tracks.length !== 0) {
    songsSection.style.display = `block`
    data.tracks.items.forEach(track => songsContainer.innerHTML += printSong(track))
  } else {
    songsSection.style.display = `none`
  }

  albumsContainer.innerHTML = null

  if (data.albums.length !== 0) {
    albumsSection.style.display = `block`
    
    data.albums.items.forEach(album => {
      albumsContainer.innerHTML += printAlbum(album)
    })
  } else {
    albumsSection.style.display = `none`
  }
}