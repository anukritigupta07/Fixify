
const { OAuth2Client } = require('google-auth-library');
const userModel = require('../models/user.model');
const utilityModel = require('../models/utility.model'); // Import the utility model
const jwt = require('jsonwebtoken');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.googleAuth = async (req, res) => {
  const { idToken, role } = req.body; // Expecting 'role' from frontend

  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { name, email, picture } = ticket.getPayload();

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
          fullname: { firstname: name, lastname: "" },
          email,
          profileImage: picture,
          isGoogleUser: true,
          // For providers, you might need to add default profession, experience, contact if not provided by Google
          profession: 'other', // Default profession
          experience: 0, // Default experience
          contact: 'N/A', // Default contact
        });
      } else {
        entity = new userModel({
          fullname: { firstname: name, lastname: "" },
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
