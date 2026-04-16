# Gator

An rss feed aggregator, aggregates posts from multiple rss feeds and stores them in a postgres database to view later.

## Usage

`npm run start <command> <args>`

## Commands

### Login

Set the current user, user must already exist

`npm run start login <username>`

### register

Add a user to the database

`npm run start register <username>`

### users

List all users in the database

`npm run start users`

### addfeed

Add a feed given a name and url of the feed

`npm run start addfeed <feed name> <feed url>`

### followfeed

Follow a feed for the current user

`npm run start follow <feed url>`

### following

List feeds the current user is following

`npm run start following`

### unfollow

Unfollow a feed for the current user

`npm run start unfollow <feed url>`

### aggregate

Scrape the added feeds and creates posts in the database

`npm run start agg`

### browse

List the saved posts

`npm run start browse`

### reset

Deletes users and related records from the databse

`npm run start reset`