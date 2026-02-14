# DevTinder APIs and Other Info

## Authentication APIs

- POST /signup
- POST /login
- POST /logout

## Profile APIs

- GET /profile/view
- PATCH /profile/edit
- POST /profile/password ==> Forget password api

## Connection Request APIs

- POST /request/send/:status/:userId
- POST /request/review/:status/:requestId

## User APIs

- GET /user/requests/received
- GET /user/connections
- GET /user/feed ==> Gets you the profiles of other users on platform

## Status: ignored, interested, accepted, rejected

## Feed API thought process

### User should see all the cards except

- 1 - His own card
- 2 - His connections
- 3 - Ignored people
- 4 - Already sent connection request

### Example - kiddo => [Vansh, Mohan, Sanjay, Sakshi]

- Kiddo => Vansh (rejected)
- Kiddo => Mohan (accepted)
- Vansh should not see my card again as he rejected my request

### Pagination Logic

- /feed?page=1&lmit=10 => 1 to 10 user => .skip(0) & .limit(10)
- /feed?page=2&lmit=10 => 11 to 20 user => .skip(10) & .limit(10)
- /feed?page=1&lmit=10 => 21 to 30 user => .skip(20) & .limit(10)
- /feed?page=1&lmit=10 => 31 to 40 user => .skip(30) & .limit(10)
