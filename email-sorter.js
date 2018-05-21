const _ = require('lodash');
const fs = require('fs');
const util = require('util');

const readdir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);

const getEmails = dirName => {
  return readdir(dirName)
    .then(fileNames => fileNames.map(fileName => readFile(dirName + fileName, 'utf-8')))
    .then(filePromises => Promise.all(filePromises));
}

const sortEmailsByDate = emails => {
  return emails.sort((a, b) => {

    const dateA = getDateFromEmail(a);
    const dateB = getDateFromEmail(b);

    return dateA < dateB ? -1 : 1;
  })
}

const getDateFromEmail = email => {
  const dateLine = email.split('\n')
    .find(line => line.startsWith('Date:'));
  const dateString = dateLine.substring(6, dateLine.length)
  return Date.parse(dateString)
}

const organizeEmails = (inputArr, outputArr) => {
  if (inputArr.length === 0) {
    return outputArr;
  }
  const email = inputArr.shift();
  const emailLines = email.split('\n');
  const messageId = emailLines.find(line => line.startsWith('Message-ID:')).split(" ").pop();

  const replyIdLine = emailLines.find(line => line.startsWith('In-Reply-To:'));

  if (replyIdLine) {
    const replyId = replyIdLine.split(" ").pop();
    const newOutput = outputArr.map(conversation => {
      if (_.last(conversation) === replyId) {
        return [...conversation, messageId];
      }
      return conversation;
    })
    return organizeEmails(inputArr, newOutput);
  }

  return organizeEmails(inputArr, [...outputArr, [messageId] ]);
}

getEmails('raw_emails/')
  .then(emails => {
    return sortEmailsByDate(emails);
  })
  .then(emails => {
    console.log(organizeEmails(emails, []));
  })
