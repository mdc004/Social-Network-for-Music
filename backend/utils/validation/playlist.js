const mongoose = require('mongoose')
const spotifyService = require('../../services/spotify')

const playlistValidation = {
  title: {
    pattern: /^[a-zA-Z0-9\s'-]{1,30}$/,
    description: 'Title must be between 1 and 30 characters long and can contain letters, numbers, spaces, apostrophes, and hyphens',
    isValid: (value) => {
      return playlistValidation.title.pattern.test(value)
    }
  },

  description: {
    pattern: /^.{0,500}$/,
    description: 'Description must be at most 500 characters long',
    isValid: (value) => {
      return playlistValidation.description.pattern.test(value)
    }
  },

  // tag are spotify genres
  tag: {
    description: 'Tag must be a valid genre',
    isValid: async (tag) => {
      const validTags = spotifyService.genres
      return validTags.includes(tag)
    }
  },
  
  tags: {
    description: 'Tags must be an array of valid genres',
    isValid: async (tags) => {
      const validTags = spotifyService.genres
      return Array.isArray(tags) && tags.every(tag => validTags.includes(tag))
    }
  },

  song: {
    description: 'Song must be a valid Spotify track IDs',
    isValid: async (song) => {
      return spotifyService.validateId(song, 'track')
    }
  },

  songs: {
    description: 'Songs must be an array of valid Spotify track IDs',
    isValid: async (songs) => {
      return Array.isArray(songs) && songs.every(song => spotifyService.validateId(song, 'track'))
    }
  },

  owner: {
    description: 'Owner must be a valid user ID',
    isValid: (ownerId) => {
      return mongoose.isValidObjectId(ownerId)
    }
  },

  public: {
    description: 'Public status must be a boolean value',
    isValid: (value) => {
      return typeof value === 'boolean'
    }
  },

  createdAt: {
    description: 'Created at must be a valid date',
    isValid: (value) => {
      return !isNaN(Date.parse(value))
    }
  },

  updatedAt: {
    description: 'Updated at must be a valid date',
    isValid: (value) => {
      return !isNaN(Date.parse(value))
    }
  }
}

module.exports = playlistValidation