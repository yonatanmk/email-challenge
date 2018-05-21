const { getEmails, sortEmailsByDate, organizeEmails } = require('./utils')

getEmails('raw_emails/')
  .then(emails => {
    return sortEmailsByDate(emails);
  })
  .then(emails => {
    console.log(organizeEmails(emails));
  });
