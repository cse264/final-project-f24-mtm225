# Madix Marlatt - CSE 264 Final Project 

## Tools used (or tools that I planned on using)

Here are the tools, dependencies, and libraries that actually are utilized in the project:
* SvelteKit (front-end)
* Node.js (back-end)
* Tailwind css (formatting)
* Auth0 (for user account creation and authentication, kind of)
* Chart.js (library for creating pokemon stat distribution radar chart)
* Axios (for api requests)
* Express (theoretically is used for routing to the database, but the database is never actually used)

Technically, the code is in place to connect to the postgreSQL database, but because i could not get Auth0 working properly, i didn't get to test if it would actually work. The routes for connecting to the database can be found in src/routes/api/pokemon-info/+server.cjs. Also, the schema.sql file can be found in the db folder on the root directory. This file was used to create the database that would be named "instadex". 

To set up the database, I installed postgreSQL from the official website, and then ran the following:
psql -U postgres (you will asked for the password, which i made "pokemon123")
CREATE DATABASE instadex
\c instadex (changes directory to database )
psql -U postgres -d instadex -f db/schema.sql (this creates the database based on the schema)

Also, you must add "C:/Program Files/PostgreSQL/17/bin" to your system path (not user path). If your version of postgreSQL is something other than 17, replace 17 with that version number.

## How to run/use app
Please read the above section before coming here. 

First and foremost, have Node.js running on your machine.

You will then need to run 'npm install' in the project folder. This will install all of the necessary dependencies.

If the postgreSQL database was being used, you would need to launch the backend by running "node src/routes/api/pokemon-info/+server.cjs". This is not necessary in reality though, because of Auth0 not fully working.

So, you only need to run 'npm run dev' and it will either open the website automatically, or you can ctrl-click into the website. The website SHOULD be localhost:5173.

There, you can search for any pokemon or ability, as well as display a type chart. Refer to the Auth0 section below for information about it and the log in button on the top of the page.

After logging in, you are supposed to be able to enter information about the pokemon. When you try to click "save info", it doesn't work. But just know that that was the intended fucntionality - the user can log in, enter info, and others could see it. Obviously, too, I would have had an admin account that could manage the data people entered. 

## Auth0 Notes
I was not able to check whether the way postgreSQL is set up actually works. This is because Auth0 was honestly a nightmare. I don't know if either my home-wifi or laptop was acting up (probably the ladder, my laptop has been having major issues), but it takes forever for it to log me in. It DOES let me log in eventually. I was not able to get to the button of why it eventually works, but I usually clicked the button twice and waited like 5 minutes. Then it eventually worked.

So, with that said, the log in button on the website SHOULD redirect you to the Auth0 website. This will have you make an account. After you log in intially and get redirected to the Auth0 page, it will no longer do that redirect you on subsequences runs of the app. It SHOULD just log you in automatically after a few minutes as long as you did the intitial sign in on the website. 
