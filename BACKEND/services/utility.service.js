const utilityModel = require('../models/utility.model');

module.exports.createUtility = async ({
  firstname, lastname, email, password, contact, profession, experience
}) => {
  if (!firstname || !email || !password || !contact || !profession || !experience) {
    throw new Error('All fields are required');
  }

  const utility = await utilityModel.create({
    fullname: { firstname, lastname },
    email,
    password,
    contact,
    profession,
    experience,
    status: 'active',
  });

  return utility;
};
