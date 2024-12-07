const mongoose = require(`mongoose`)
const spotifyService = require(`../../services/spotify`)

const userValidation = {
  email: {
    pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    description: `Please use a valid email address`,
    isValid: (value) => {
      return userValidation.email.pattern.test(value)
    }
  },

  username: {
    pattern: /^[a-zA-Z0-9._-]{3,30}$/,
    description: `Username must be between 3 and 30 characters long and can contain letters, numbers, dots, underscores, and hyphens`,
    isValid: (value) => {
      return userValidation.username.pattern.test(value)
    }
  },

  password: {
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
    description: `Password must contain at least 8 characters, including an uppercase letter, a lowercase letter, a number, and one or more of the following special characters: @$!%*?&#`,
    isValid: (value) => {
      return userValidation.password.pattern.test(value)
    }
  },

  status: {
    pattern: /^(active|inactive|banned)$/,
    description: `Status must be either "active", "inactive", or "banned"`,
    isValid: (value) => {
      return userValidation.status.pattern.test(value)
    }
  },

  role: {
    pattern: /^(user|admin|superadmin)$/,
    description: `Role must be either "user", "admin", or "superadmin"`,
    isValid: (value) => {
      return userValidation.role.pattern.test(value)
    }
  },

  firstName: {
    pattern: /^[a-zA-Zà-ÿÀ-ß\s.'0-9-éèêëàáâãåæçèéêëìíîïñòóôõøùúûüýÿœ]{1,50}$/,
    description: `First name must be between 1 and 50 characters long and can contain letters (including accentuated ones like é, è, à), spaces, apostrophes, hyphens, periods, and numbers.`,
    isValid: (value) => {
      return userValidation.firstName.pattern.test(value);
    }
  },

  lastName: {
    pattern: /^[a-zA-Zà-ÿÀ-ß\s.'0-9-éèêëàáâãåæçèéêëìíîïñòóôõøùúûüýÿœ]{1,50}$/,
    description: `Last name must be between 1 and 50 characters long and can contain letters (including accentuated ones like é, è, à), spaces, apostrophes, hyphens, periods, and numbers.`,
    isValid: (value) => {
      return userValidation.lastName.pattern.test(value);
    }
  },

  info: {
    pattern: /^.{0,500}$/,
    description: `Info must be at most 500 characters long`,
    isValid: (value) => {
      return userValidation.info.pattern.test(value)
    }
  },

  preferences: {
    artists: {
      description: `Artists must be a valid array of artist id`,
      isValid: async (artists) => {
        return Array.isArray(artists) && artists.every((artist) => spotifyService.validateId(artist, `artist`))
      }
    },
    following: {
      description: `Following must be an array of User IDs`,
      isValid: (following) => {
        return Array.isArray(following) && following.every((follow) => mongoose.isValidObjectId(follow))
      }
    },
    genres: {
      description: `Genres must be a valid array of genre`,
      isValid: async (genres) => {
        const validGenres = spotifyService.genres
        return Array.isArray(genres) && genres.every((genre) => validGenres.includes(genre))
      }
    },
    playlists: {
      description: `Playlists must be a valid array of playlist id`,
      isValid: (playlists) => {
        return Array.isArray(playlists) && playlists.every((playlist) => mongoose.isValidObjectId(playlist))
      }
    }
  },

  // This is a check for single elements of preferences
  preference: {
    artist: {
      description: `Artist must be a valid id`,
      isValid: async (artist) => {
        return spotifyService.validateId(artist, `artist`)
      }
    },
    following: {
      description: `Follow must be a valid user id`,
      isValid: (following) => {
        return Array.isArray(following) && following.every((follow) => mongoose.isValidObjectId(follow))
      }
    },
    genre: {
      description: `Genre must be a valid genre`,
      isValid: async (genre) => {
        const validGenres = spotifyService.genres
        return validGenres.includes(genre)
      }
    },
    playlist: {
      description: `Playlist must be a valid playlist id`,
      isValid: (value) => {
        return mongoose.isValidObjectId(value)
      }
    }
  }
}

module.exports = userValidation