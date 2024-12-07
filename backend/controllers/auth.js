const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require(`./../models/user`)

/**
 * @function login
 * @description Handles user login by validating credentials and issuing a JWT token.
 * @param {object} req - The request object, containing user credentials in the body.
 * @param {object} res - The response object, used to send responses back to the client.
 * @returns {void} Responds with a JSON object containing the token and user ID on success, or an error message on failure.
 * @throws {Error} Throws an error if user validation fails or if there is an issue during the token generation process.
 */
module.exports.login = async (req, res) => {
  try {
    const { username, password } = req.body

    const user = await User.findOne({ username })

    if (!user) {
      res.status(401).json({ error: { message: `Invalid Username` } })
      return
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      // bisognerebbe inserire un contatore allo status tipo (da active a password errata 1, poi due e al 3 lo si cambia in locked)
      res.status(401).json({ error: { message: `Invalid Password` } })
      return
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });

    res.status(200).json({ token: token, userId: user._id })

  } catch (err) {
    console.log(err.message)
    res.status(500).json({ status: process.env.RES_500 })
  }
}