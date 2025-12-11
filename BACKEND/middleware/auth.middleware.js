// import jwt from 'jsonwebtoken';
const userModel = require('../models/user.model');
const utilityModel = require('../models/utility.model');
const user = require('../models/blacklistToken.model');
const blacklistTokenModel = require('../models/blacklistToken.model');
const jwt = require('jsonwebtoken');
//Token Extraction


module.exports.authUser = async (req , res , next) => {
 const token = req.cookies.token || req.headers.authorization?.split(' ')[ 1 ];
    if(!token ) {
        return res.status(401).json({message: 'Unauthorization02'});
    }
    
    const isBlacklisted  = await blacklistTokenModel.findOne({token: token});
    if(isBlacklisted) {
        return res.status(401).json({message: ' Unauthorized'});
    }
    try {
        const decoded =  jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded._id)
         if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        req.user = user;
       next();
    } catch (err) {
        //console.error(err);
    
        return res.status(401).json({message: 'Unauthorization01'});
    }
}

module.exports.authUtility = async (req , res , next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[ 1 ];

    if(!token) {
        //console.log(token)
        return res.status(401).json({message: 'Unauthorization02'});
       
    }
const isBlacklisted  = await blacklistTokenModel.findOne({token: token});
    if(isBlacklisted) {
        return res.status(401).json({message: ' Unauthorized'});
    }

   try {
        const decoded =  jwt.verify(token, process.env.JWT_SECRET);
        const utility = await utilityModel.findById(decoded._id)
if (!utility) {
            return res.status(401).json({ message: 'Utility not found' });
        }
        req.utility = utility;
        next();
       
    } catch (err) {
       // console.error(err);
        return res.status(401).json({message: 'Unauthorization01'});
    }
}