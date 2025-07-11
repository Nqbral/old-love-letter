﻿# Love Letter

Love Letter is a quick and strategic card game where players compete to win the affection of the Princess by delivering their love letters. Using deduction, risk, and a bit of luck, players eliminate opponents and try to be the last one standing or have the highest card at the end of the round.

You can find released game here:  
[https://old.love-letter.nqbral-games.fr/](https://old.love-letter.nqbral-games.fr/)

## Installation

To install project locally, make sure to have NodeJS and Yarn installed.

- Clone the project `git@github.com:Nqbral/love-letter.git`
- Enter project `cd love-letter/`
- Install dependencies `yarn`
- Start dev environment for client `yarn start:dev:client`
- Start dev environment for server `yarn start:dev:server`

## Stack

### Yarn Workspaces

Project makes use of Yarn `workspaces` to manage client and server projects but also to share some code between both.

### Next.js / React.js

Client application is built on top of Next.js.

### NestJS / NodeJS

Server side is built using NestJS to manage game instances and handle interactions with clients.

### Socket.IO

To handle realtime, project uses websockets and manage socket connections with Socket.IO.

### Docker

For deployment, I use docker containers.

## Credits

Created by [Nqbral](https://github.com/Nqbral).
