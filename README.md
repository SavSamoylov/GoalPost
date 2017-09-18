# GoalPost

This application will allow Users to create and share their Goals with other users.

## The "Big" Idea

>> What if we could create a place where users would be able to Create, Share, and Collaborate on personal Goals with each other in order to achieve more faster. 

## Tech Used

Front-end:
- Bootstrap - (Form elements and Modals)
- FontAwesome for Icons
- jQuery for manipulating the DOM and REST api calls.

Server-side:
- XPS - (Handling common middleware at setup).
- Express-Validator for registration validation.
- BCrypt for Hashing Passwords.
- Passport for session authentication.
- Morgan for HTTP logging.
- Connect-Flash for sending feedback messages.
- Express-Session, 
- Cookie-Parser, 
- Moment, 
- etc.

## Future Development Roadmap
- Allow for interactivity between users.
  - Following each other or specific goals.
  - Suggesting Tasks and leaving comments on other user’s goals.


- Allow users to create “Progress Updates” for each goal.


- Allow users to upload Profile Images and Profile Covers.


- Utilize transactional emails for account confirmations, password resets, etc.

- __Note__ This application was created within two weeks as a proof-of-concept prototype and will hold the Work-in-Progress label until further notice.


## Minimum Goals
- User will be able to Register for the application.
- User will be able to Log-in to the application.
- User will be able to create new Goals.
- User will be able to View, Update, and Delete Goals.
- Use will be able to view the goals of other Users'.

## Stretch Goals
- User will be able to update Profile Application.
  - Add Photos, Bio, etc.
- Each inidividual Goal can have multiple 'Tasks' or 'Steps' that the User will be able to Create and Edit.
- User will be able to provide "Status Updates" for each Goals. Kind of like a 'git commit'... but not.
- User will be able to comment on other peoples Goals.
- User can "watch"/"follow" other peoples Goals.

