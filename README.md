[![Actions Status: Node.js CI](https://github.com/ogbiyoyosky/zeus/workflows/Node.js%20CI/badge.svg)](https://github.com/ogbiyoyosky/zeus/actions?query=workflow%3A"Node.js+CI")

#Zeus App

I have a habit of name my repositories after greek gods.
What does this god do?

This god is an API that mock matches in a “**Mock Premier League**”

## Features

- **Admin accounts** which are used to
  - signup/login
  - manage teams (add, remove, edit, view)
  - create fixtures (add, remove, edit, view)
  - Generate unique links for fixture
- **Users accounts** who can
  - signup/login
  - view teams
  - view completed fixtures
  - view pending fixtures
  - robustly search fixtures/teams
- Only the search API should be availble to the public.

## Authentication and Session Management

1. Use redis as your session store.
2. Authentication and Authorization for admin and user accounts should be done using `Bearer token` and `JWT`.

## Tools/Stack

- NodeJs (JavaScript or TypeScript)
- MongoDB
- Redis
- Docker
- POSTMAN
- Jest
- Express

## Starting the application locally

1. Clone repo

`git clone https://github.com/ogbiyoyosky/zeus.git`

2. run `npm install`

3. create a .env

4. `npm run seed`

5. run `npm run dev`

#### Running test

    1. `npm test'
    2. 'npm run coverage`

## Starting application docker-compose

building the app

run `docker-compose up --build`

The above command spin up mongodb, redis and the application.

### API DOCUMENTATION URL

https://documenter.getpostman.com/view/6226738/TVRhbpHg

## AUTHOR

Ogbiyoyo, Emmanuel Ighosode
