
const { OAuth2Client } = require('google-auth-library');
const userModel = require('../models/user.model');
const utilityModel = require('../models/utility.model'); // Import the utility model
const jwt = require('jsonwebtoken');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.googleAuth = async (req, res) => {
  const { idToken, role } = req.body; // Expecting 'role' from frontend

  try {
    if (process.env.DEBUG_GOOGLE === 'true') {
      console.log('Received idToken (first 64 chars):', typeof idToken === 'string' ? idToken.slice(0, 64) : idToken);
    }
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (process.env.DEBUG_GOOGLE === 'true') {
      console.log('Verified token payload:', { aud: payload.aud, iss: payload.iss, sub: payload.sub, email: payload.email });
    }
    const { name, email, picture } = payload;

    // Ensure firstname/lastname satisfy schema validation
    const nameParts = (name || '').trim().split(/\s+/).filter(Boolean);
    const emailLocal = (email || '').split('@')[0] || 'user';
    let firstname = nameParts.length ? nameParts[0] : emailLocal;
    if (typeof firstname !== 'string' || firstname.length < 3) {
      firstname = (emailLocal || 'user').slice(0, 3).padEnd(3, 'x');
    }
    const lastnameCandidate = nameParts.length > 1 ? nameParts.slice(1).join(' ') : undefined;
    const lastname = (lastnameCandidate && lastnameCandidate.length >= 3) ? lastnameCandidate : undefined;

    let entity; // Can be a user or a provider
    let Model; // Mongoose model to use

    if (role === 'provider') {
      Model = utilityModel;
    } else {
      Model = userModel;
    }

    entity = await Model.findOne({ email });

    if (!entity) {
      // Create new entity if not found
      if (role === 'provider') {
          entity = new utilityModel({
              fullname: lastname ? { firstname, lastname } : { firstname },
              email,
              profileImage: picture,
              isGoogleUser: true,
              // Do not set `profession` or other enum fields here — utility schema enforces enum only for non-Google users.
            });
      } else {
        entity = new userModel({
            fullname: lastname ? { firstname, lastname } : { firstname },
            email,
            profileImage: picture,
            isGoogleUser: true,
          });
      }
      await entity.save();
    }

    // Generate JWT token for the entity (user or provider)
    const token = jwt.sign({ id: entity._id, role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
      message: `Google authentication successful for ${role}`,
      token,
      user: { id: entity._id, name: entity.fullname.firstname, email: entity.email, profileImage: entity.profileImage, role },
    });
  } catch (error) {
    console.error('Google authentication error:', error);
    res.status(401).json({ message: 'Google authentication failed' });
  }
};
