const assert = require('assert');
const {
  getDateFromEmail,
  getMessageIdFromEmail,
  getReplyIdFromEmail,
  sortEmailsByDate,
  organizeEmails,
  getEmails,
} = require('../utils');

const testEmailString1 = 'From: Red Hot Deals!!! <promotions@example.com>\nTo: Carmella Draeger <carmella@example.com>\nMessage-ID: <16@example>\nSubject: Bargain Cruises\nContent-Type: text/plain; charset="us-ascii"\nDate: 6 Nov 2017 10:22:01 +0000\n\nFrom our cruise partner! Check it out!\n\nhttps://redhot.deals/g91js940/bargain-cruises-caribbean\n';
const testEmailString2 = 'From: Red Hot Deals!!! <promotions@example.com>\nTo: Carmella Draeger <carmella@example.com>\nMessage-ID: <16@example>\nSubject: Bargain Cruises\nContent-Type: text/plain; charset="us-ascii"\nDate: 7 Nov 2017 10:22:00 +0000\n\nFrom our cruise partner! Check it out!\n\nhttps://redhot.deals/g91js940/bargain-cruises-caribbean\n';
const testEmailString3 = 'From: Red Hot Deals!!! <promotions@example.com>\nTo: Carmella Draeger <carmella@example.com>\nMessage-ID: <16@example>\nSubject: Bargain Cruises\nContent-Type: text/plain; charset="us-ascii"\nDate: 7 Nov 2017 10:22:01 +0000\n\nFrom our cruise partner! Check it out!\n\nhttps://redhot.deals/g91js940/bargain-cruises-caribbean\n';

const conversationString1 = 'From: Carmella Draeger <carmella@example.com>\nTo: Celia Prince <celia@example.com>, Alisson Silva <alisson@example.com>\nCc: iyana@example.com\nMessage-ID: <1@example>\nSubject: Meeting\nContent-Type: text/plain; charset="us-ascii"\nDate: 2 Nov 2017 18:58:15 +0000\n\nHi both, can you let me know ideal times for meeting please?\n';
const conversationString2 = 'From: Celia Prince <celia@example.com>\nTo: Carmella Draeger <carmella@example.com>\nCc: iyana@example.com, Alisson Silva <alisson@example.com>\nMessage-ID: <2@example>\nIn-Reply-To: <1@example>\nSubject: RE: Meeting\nContent-Type: text/plain; charset="us-ascii"\nDate: 2 Nov 2017 20:38:12 +0000\n\nHey Carmella,\n\nTuesday would be best for me. I\'m otherwise very busy.\n\nBest,\nCelia\n\n> Hi both, can you let me know ideal times for meeting please?\n';

describe('utils', () => {
  describe('getDateFromEmail', () => {
    it('should return a date object', () => {
      const date = getDateFromEmail(testEmailString1);
      assert.equal(date instanceof Date, true);
    });

    it('should return the correct date', () => {
      const date = getDateFromEmail(testEmailString1);
      assert.equal(date.toString(), 'Mon Nov 06 2017 05:22:01 GMT-0500 (EST)');
    });
  });

  describe('getMessageIdFromEmail', () => {
    it('returns the correct messageId', () => {
      const messageId = getMessageIdFromEmail(testEmailString1);
      assert.equal(messageId, '<16@example>');
    });
  });

  describe('getReplyIdFromEmail', () => {
    it('returns the correct replyId', () => {
      const replyId = getReplyIdFromEmail(conversationString2);
      assert.equal(replyId, '<1@example>');
    });
  });

  describe('sortEmailsByDate', () => {
    it('sorts emails in correct order', () => {
      const emails = [testEmailString3, testEmailString2, testEmailString1];
      const sortedEmails = sortEmailsByDate(emails);
      assert.equal(sortedEmails[0], testEmailString1);
      assert.equal(sortedEmails[1], testEmailString2);
      assert.equal(sortedEmails[2], testEmailString3);
    });
  });

  describe('organizeEmails', () => {
    const emails = [conversationString1, conversationString2, testEmailString1];
    const organizedEmails = organizeEmails(emails);

    it('returns an array of arrays', () => {
      assert.equal(Array.isArray(organizedEmails), true);
      assert.equal(Array.isArray(organizedEmails[0]), true);
    });

    it('places emails of the same conversation together', () => {
      assert.equal(organizedEmails[0].length, 2);
      assert.equal(organizedEmails[0].includes('<1@example>'), true);
      assert.equal(organizedEmails[0].includes('<2@example>'), true);
    });

    it('creates a new conversation if an email is not a reply', () => {
      assert.equal(organizedEmails[1].length, 1);
      assert.equal(organizedEmails[1], '<16@example>');
    });
  });

  describe('getEmails', () => {
    it('should parse all emails into strings', done => {
      getEmails('test/test_raw_emails/')
        .then(emails => {
          assert.equal(emails.includes(conversationString1), true);
          done()
        })
    });
  });
});
