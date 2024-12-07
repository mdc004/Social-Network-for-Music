require('dotenv').config();

const validTypes = ["album", "artist", "audiobook", "episode", "playlist", "show", "track"];
module.exports.validTypes = validTypes;

const genres = [
  "acoustic", "afrobeat", "alt-rock", "alternative", "ambient", "anime", "black-metal", "bluegrass", "blues",
  "bossanova", "brazil", "breakbeat", "british", "cantopop", "chicago-house", "children", "chill", "classical",
  "club", "comedy", "country", "dance", "dancehall", "death-metal", "deep-house", "detroit-techno", "disco",
  "disney", "drum-and-bass", "dub", "dubstep", "edm", "electro", "electronic", "emo", "folk", "forro",
  "french", "funk", "garage", "german", "gospel", "goth", "grindcore", "groove", "grunge", "guitar", "happy",
  "hard-rock", "hardcore", "hardstyle", "heavy-metal", "hip-hop", "holidays", "honky-tonk", "house", "idm",
  "indian", "indie", "indie-pop", "industrial", "iranian", "j-dance", "j-idol", "j-pop", "j-rock", "jazz",
  "k-pop", "kids", "latin", "latino", "malay", "mandopop", "metal", "metal-misc", "metalcore", "minimal-techno",
  "movies", "mpb", "new-age", "new-release", "opera", "pagode", "party", "philippines-opm", "piano", "pop",
  "pop-film", "post-dubstep", "power-pop", "progressive-house", "psych-rock", "punk", "punk-rock", "r-n-b",
  "rainy-day", "reggae", "reggaeton", "road-trip", "rock", "rock-n-roll", "rockabilly", "romance", "sad",
  "salsa", "samba", "sertanejo", "show-tunes", "singer-songwriter", "ska", "sleep", "songwriter", "soul",
  "soundtracks", "spanish", "study", "summer", "swedish", "synth-pop", "tango", "techno", "trance", "trip-hop",
  "turkish", "work-out", "world-music"
];
module.exports.genres = genres;

/**
 * Token storage object for Spotify API.
 * @typedef {Object} Token
 * @property {string|null} access_token - The OAuth access token for Spotify API.
 * @property {number|null} expires - The expiration time of the access token (timestamp in seconds).
 */
let token = {
  access_token: null,
  expires: null
};

/**
 * Updates the access token if it is expired or not present.
 * This function requests a new token from the Spotify API using client credentials.
 * @returns {Promise<void>}
 */
const updateToken = async () => {
  if (Date.now() > token.expires || !token.expires) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic ' + Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString('base64')
      },
      body: new URLSearchParams({ grant_type: 'client_credentials' })
    };

    const response = await fetch(process.env.URL_SPOTIFY_TOKEN, options);
    const data = await response.json();

    token.access_token = data.access_token;
    token.expires = Date.now() + (data.expires_in * 1000); // Update expiration time
  }
};

/**
 * Wrapper function for making fetch requests to the Spotify API.
 * Automatically includes the Bearer token in the Authorization header.
 * @param {string} url - The URL to fetch.
 * @param {Object} [options={}] - The fetch options (method, headers, body, etc.).
 * @returns {Promise<Response>} The fetch response.
 */
const fetchWrapper = async (url, options = {}) => {
  await updateToken();

  options.headers = options.headers || {};
  options.headers['Authorization'] = 'Bearer ' + token.access_token;

  return fetch(url, options);
};
module.exports.fetchWrapper = fetchWrapper;

/**
 * Retrieves the available genre seeds from Spotify.
 * @returns {Promise<string[]>} A promise that resolves to an array of genre strings.
 */
module.exports.getGenres = async () => {
  try {
    const url = `https://api.spotify.com/v1/recommendations/available-genre-seeds`;
    const response = await fetchWrapper(url);
    const data = await response.json();
    return data.genres;
  } catch (error) {
    console.error(error.message);
    console.log('*************************************');
    return [];
  }
};

/**
 * Validates an array of types to ensure all are valid according to predefined validTypes.
 * @param {string[]} types - Array of type strings to validate.
 * @returns {boolean} True if all types are valid, otherwise false.
 */
const validateTypes = (types) => {
  return types.every(type => validTypes.includes(type));
};
module.exports.validateTypes = validateTypes;

/**
 * Searches for items on Spotify based on query, types, limit, and page.
 * @param {string} query - The search query string.
 * @param {string|string[]} types - The types of items to search for.
 * @param {number} [limit=10] - The number of results to return.
 * @param {number} [page=0] - The page number for pagination.
 * @returns {Promise<Object>} An object with HTTP status code and response content.
 */
module.exports.search = async (query, types, limit = 10, page = 0) => {
  const offset = Math.abs(page * limit);
  const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=${types}&limit=${limit}&offset=${offset}`;

  const response = await fetchWrapper(url);
  const data = await response.json();

  if (!response.ok) {
    return { code: 424, content: { error: { message: `Failed dependency: External service failure. ${data.error.message}` } } };
  } else {
    return { code: 200, content: data };
  }
};

/**
 * Validates an ID for a specific type by checking its existence on Spotify.
 * @param {string} id - The ID of the item to validate.
 * @param {string} type - The type of the item (e.g., 'album', 'artist').
 * @returns {Promise<boolean>} True if the ID is valid, otherwise false.
 */
module.exports.validateId = async (id, type) => {
  if (!validTypes.includes(type)) {
    return false;
  }

  const url = `https://api.spotify.com/v1/${type}s/${id}`;
  const response = await fetchWrapper(url);

  return response.ok;
};

/**
 * Retrieves a specific element from Spotify by ID and type.
 * @param {string} id - The ID of the element to retrieve.
 * @param {string} type - The type of the element (e.g., 'album', 'artist').
 * @returns {Promise<Object>} An object with HTTP status code and response content.
 */
module.exports.getElement = async (id, type) => {
  if (!validTypes.includes(type)) {
    return { code: 400, content: { error: { message: `${type} is not a valid type` } } };
  }

  const url = `https://api.spotify.com/v1/${type}s/${id}`;
  const response = await fetchWrapper(url);
  const data = await response.json();

  if (response.ok) {
    return { code: 200, content: data };
  } else {
    return { code: 424, content: { error: { message: `Failed dependency: External service failure. ${data.error.message}` } } };
  }
};