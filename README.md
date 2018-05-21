## Built in Node


## Running the Program:


Run the program from the command line using `node email-sorter.js` from the root folder
The result in logged in the terminal


## Testing:
Run `npm test` from the command line


## Some notes:


Email 14 is clearly a response to email 13 but does not have an "In-Reply-To" property in the metadata

Email 11 is a forwarded email of email 7 but there's no metadata to indicate so.

For these two edge cases I could try to use other data like the Subject or the conversation logs at the bottom of the email to try to organize these emails into conversations, but since neither of these data points are required to be unique it would likely cause bugs in the future. I would rather not include them in the conversations at all.


Given more time I would add error handling using Es6 Promise catch blocks and more checks that the email header formats are correct


## Sample output:

    [
        [ '<1@example>', '<2@example>', '<6@example>', '<7@example>', '<8@example>' ],
        [ '<3@example>' ],
        [ '<4@example>' ],
        [ '<5@example>' ],
        [ '<9@example>', '<10@example>' ],
        [ '<11@example>' ],
        [ '<12@example>', '<13@example>' ],
        [ '<14@example>' ],
        [ '<15@example>' ],
        [ '<16@example>' ],
        [ '<17@example>' ]
    ]
