const _ = require('lodash');
const fs = require('fs');
const util = require('util');

const readDir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);

const getEmails = dirName => {
  return readDir(dirName)
    .then(fileNames => fileNames.map(fileName => {
      return readFile(dirName + fileName, 'utf-8')
    }))
    .then(filePromises => Promise.all(filePromises));
}

const sortEmailsByDate = emails => {
  return emails.sort((a, b) => {
    const dateA = getDateFromEmail(a);
    const dateB = getDateFromEmail(b);

    return dateA < dateB ? -1 : 1;
  })
}

const organizeEmails = (inputArr, outputArr = []) => {
  if (inputArr.length === 0) {
    return outputArr;
  }
  const email = inputArr.shift();
  const emailLines = email.split('\n');
  const messageId = getMessageIdFromEmail(email);
  const replyId = getReplyIdFromEmail(email);

  if (replyId) {
    const newOutput = outputArr.map(conversation => {
      if (conversation.includes(replyId)) {
        return [...conversation, messageId];
      }
      return conversation;
    })
    return organizeEmails(inputArr, newOutput);
  }

  return organizeEmails(inputArr, [...outputArr, [messageId] ]);
}

const getMessageIdFromEmail = email => {
  const emailLines = email.split('\n');
  const messageId = emailLines.find(line => line.startsWith('Message-ID:'));
  return messageId ? messageId.split(" ").pop() : null;
}

const getReplyIdFromEmail = email => {
  const emailLines = email.split('\n');
  const replyId = emailLines.find(line => line.startsWith('In-Reply-To:'))
  return replyId ? replyId.split(" ").pop() : null;
}

const getDateFromEmail = email => {
  const dateLine = email.split('\n')
    .find(line => line.startsWith('Date:'));
  const dateString = dateLine.substring(6, dateLine.length);
  return new Date(dateString);
}

module.exports = {
  getEmails,
  sortEmailsByDate,
  getDateFromEmail,
  getMessageIdFromEmail,
  getReplyIdFromEmail,
  organizeEmails,
};
