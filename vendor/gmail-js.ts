/**
 * gmail.js
 */
const service = require('gmail-js');

const Gmail = new service.Gmail();

/**
 * Override the email_data_post helper
 * catch the error and silence it
 */
const SuperEmailDataPost = Gmail.helper.get.email_data_post;

Gmail.helper.get.email_data_post = (data: any) => {
  let result = {};

  try {
    result = SuperEmailDataPost(data);
  } catch (e) {
    // SHHHHH!
  }

  return result;
};

export default Gmail;
