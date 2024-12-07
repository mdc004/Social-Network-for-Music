const signUp = async (event) => {
  event.preventDefault()

  const firstNameInput = document.getElementById('sign-up-first-name')
  const lastNameInput = document.getElementById('sign-up-last-name')
  const usernameInput = document.getElementById('sign-up-username')
  const emailInput = document.getElementById('sign-up-email')
  const infoInput = document.getElementById('sign-up-info')
  const passwordInput = document.getElementById('sign-up-password')

  const messageBox = document.getElementById('sign-up-message-box')

  const body = JSON.stringify({
    firstName: firstNameInput.value,
    lastName: lastNameInput.value,
    username: usernameInput.value,
    email: emailInput.value,
    info: infoInput.value,
    password: passwordInput.value
  });

  const response = await fetch('/api/users/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: body
  });
  const data = await response.json()

  if( data.error) {
    messageBox.innerText = data.error.message
  } else {
    displayLogin()
  }
  return
}