# Gator

An rss feed aggregator, aggregates posts from multiple rss feeds and stores them in a postgres database to view later.

## Commands

### Login

Set a user from the database to the current user

`npm run start login <username>`

### register

Adds a user to the database
`npm run start register <username>`

### users

List all users in the database

### addfeed

Adds a feed given a name and url of the feed

### followfeed

### following

### unfollow

### aggregate

Scrapes the added feeds and creates posts in the database

### browse

### reset

Deletes users and related records from the databse