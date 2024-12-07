const removeAvatar = async (event) => {
  event.preventDefault()

  const avatarImg = document.getElementById(`avatar-img`)
  const avatarImgInput = document.getElementById(`avatar-img-input`)

  const response = await fetchProtectedResource(BASE_URL + `api/users/avatar`, `DELETE`)

  const removeAvatarMessage = document.getElementById(`remove-avatar-message`)

  if (response.ok) {
    avatarImg.src = `uploads/avatars/users/0.jpg`
  } else {
    const data = await response.json()
    removeAvatarMessage.innerText = data.error.message
  }
}

const updateAvatar = async (event) => {
  event.preventDefault()

  const avatarImg = document.getElementById(`avatar-img`)
  const avatarImgInput = document.getElementById(`avatar-img-input`)

  const avatar = avatarImgInput.files[0]

  const formData = new FormData();
  formData.append(`avatar`, avatar)

  const response = await fetchProtectedResource(`api/users/avatar`, `POST`, formData)

  const updateAvatarMessage = document.getElementById(`update-avatar-message`)

  if (response.ok) {
    const userId = localStorage.getItem(`userId`)
    avatarImg.src = `/uploads/avatars/users/${userId}.jpg`
    updateAvatarMessage.innerText = `Avatar updated`
  } else {
    const data = await response.json()
    updateAvatarMessage.innerText = data.error.message
  }
}

const updatePassword = async (event) => {
  event.preventDefault()

  const oldPasswordInput = document.getElementById(`old-password`)
  const newPasswordInput = document.getElementById(`new-password`)

  const oldPassword = oldPasswordInput.value
  const newPassword = newPasswordInput.value

  const body = {
    oldPassword: oldPassword,
    newPassword: newPassword
  }

  const response = await fetchProtectedResource(`api/users/password`, `PATCH`, body)
  const updatePasswordMessage = document.getElementById(`update-password-message`)

  if (response.ok) {
    updatePasswordMessage.innerText = `Password updated`
  } else {
    const data = await response.json()
    updatePasswordMessage.innerText = data.error.message
  }
}

const updateProfile = async (event) => {
  event.preventDefault()

  const lastNameInput = document.getElementById(`update-first-name`)
  const firstNameInput = document.getElementById(`update-last-name`)
  const infoInput = document.getElementById(`update-info`)

  const lastName = lastNameInput.value
  const firstName = firstNameInput.value
  const info = infoInput.value ? infoInput.value : ``

  const body = {
    lastName: lastName,
    firstName: firstName,
    info: info,
  }

  const response = await fetchProtectedResource(`api/users/profile`, `PATCH`, body)
  const updateProfileMessage = document.getElementById(`update-profile-message`)

  if (response.ok) {
    updateProfileMessage.innerText = `Profile updated`
  } else {
    const data = await response.json()
    updateProfileMessage.innerText = data.error.message
  }
}

const deleteProfile = async () => {
  await fetchProtectedResource('api/users/', 'DELETE')
  displayPreview()
}