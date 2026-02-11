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
