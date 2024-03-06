/**
 * gmail.js
 */
import jQuery from 'jquery';

const service = require('gmail-js');

/**
 * Override the jQuery object
 */

jQuery.isArray = Array.isArray;

if ((window as any).trustedTypes && (window as any).trustedTypes.createPolicy) {
  const htmlPrefilter = (window as any).trustedTypes.createPolicy('myEscapePolicy', {
    createHTML: (string: string) => string.replace(/</g, '&lt;'),
  });

  jQuery.extend({ htmlPrefilter });
}

const Gmail = new service.Gmail(jQuery);

/**
 * Override the email_data_post helper
 * catch the error and silence it
 */
const SuperEmailDataPost = Gmail.helper.get.email_data_post;

Gmail.helper.get.email_data_post = (data: any) => {
  let result = {};

  try {
    result = SuperEmailDataPost(data);
  } catch {
    // SHHHHH!
  }

  return result;
};

export default Gmail;
