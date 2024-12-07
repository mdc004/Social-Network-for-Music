/**
 * Function to make protected requests with JWT authentication.
 * Automatically includes the JWT token stored in localStorage in all requests.
 * If the response is 401 (Unauthorized), it redirects the user to the login page.
 * 
 * @param {string} url - The URL of the resource to fetch.
 * @param {string} [method='GET'] - The HTTP method to use (GET, POST, etc.).
 * @param {Object|null} [body=null] - The request body, if any.
 * @returns {Promise<Response>} The fetch response.
 */
async function fetchProtectedResource(url, method = 'GET', body = null) {
  // Retrieve the authentication token from localStorage
  let token = localStorage.getItem('authToken');

  // Set up the request headers
  const headers = {
    'Authorization': `Bearer ${token}`,
  };

  // Add the 'Content-Type' header only if the body is not FormData
  if (!(body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  // Execute the fetch request
  let response = await fetch(url, {
    method: method,
    headers: headers,
    body: body && !(body instanceof FormData) ? JSON.stringify(body) : body,
  });

  // If the response is 401, redirect to the login page
  if (response.status === 401) {
    displayLogin(); // Function to show the login page
  }

  return response; // Return the response for further processing
}

/**
 * Function to refresh the authentication token.
 * Used to log in and save the new token in localStorage.
 * If the login fails, it displays an error message.
 * 
 * @param {Event} event - The form submit event.
 */
const refreshToken = async (event) => {
  event.preventDefault(); // Prevent the default form submission behavior

  // Retrieve the username and password values from input fields
  const usernameInput = document.getElementById('username-input');
  const passwordInput = document.getElementById('password-input');

  const username = usernameInput.value;
  const password = passwordInput.value;

  // Send a login request
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: username,
      password: password,
    }),
  });

  const data = await response.json(); // Parse the JSON response

  // If the response is not OK, display an error message
  if (!response.ok) {
    const loginError = document.getElementById('login-error');
    loginError.innerText = data.error.message;
    return;
  }

  // Save the token and user ID in localStorage
  localStorage.setItem('userId', data.userId);
  localStorage.setItem('authToken', data.token);

  // Redirect the user to the homepage
  location.href = './';

  return;
};

/**
 * Function to log out the user.
 * Removes the authentication token and user ID from localStorage.
 * Redirects the user to the preview page and hides the navigation bar.
 * 
 * @param {Event} event - The click event of the logout button.
 */
const logout = (event) => {
  event.preventDefault(); // Prevent the default button click behavior

  // Remove the token and user ID from localStorage
  localStorage.removeItem('authToken');
  localStorage.removeItem('userId');

  // Show the preview page and hide the navigation bar
  displayPreview(); // Function to show the preview page
  hideNav(); // Function to hide the navigation bar

  return;
};


// window.onload = async () => {
//   await refreshToken()

//   const apiUrl = 'http://localhost:3000/api/playlists/66a22460b89a79a5a98ffa22';

//   fetchProtectedResource(apiUrl, null, 'GET')
//     .then(data => {
//       // data.songs.forEach(song => {
//       //   fetchProtectedResource(`http://localhost:3000/api/search/spotify/track/${song}`, null, 'GET').then(data => {
//       //     console.log(data)
//       //     songsContainer.innerHTML += `        <div class="col-lg-4">

//       //               <div class="image-wrap-2">
//       //                 <div class="image-info">
//       //                   <h2 class="mb-2">${data.name}</h2>
//       //                   <h4 class="mb-3">${data.artists[0].name}</h4>
//       //                   <a href="single.html" class="btn btn-outline-white py-2 px-4">More Photos</a>
//       //                 </div>
//       //                 <img src="${data.album.images[0].url}" alt="Image" class="img-fluid">
//       //               </div>

//       //             </div>`
//       //   })
//       // })
//       const song = data.songs[0]
//       fetchProtectedResource(`http://localhost:3000/api/search/spotify/track/${song}`, null, 'GET').then(data => {
//         console.log(data)
//         songsContainer.innerHTML += `        <div class="col-lg-4">
        
        
//                   <div class="image-wrap-2">
                  
//                     <div class="image-info">
//                       <h2 class="mb-2">${data.name}</h2>
//                       <h4 class="mb-2">${data.artists[0].name}</h4>
//                                   <div class="like-section">
//               <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-heart like" viewBox="0 0 16 16" onclick="console.log('peppino')">
//                 <path
//                   d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15" />
//               </svg>

//               <!-- <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="red" class="bi bi-heart-fill dislike" viewBox="0 0 16 16">
//                 <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314" />
//               </svg> -->
//             </div>
//                       </div>
//                       <img src="${data.album.images[0].url}" alt="Image" class="img-fluid mt-3">
//                       </div>
                      
//                       </div>`
//       })
//       // <a href="single.html" class="btn btn-outline-white py-2 px-4">More Photos</a>
//     })
// }