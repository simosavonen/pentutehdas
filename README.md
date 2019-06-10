# pentutehdas

Full Stack exercise project for University of Helsinki course
https://courses.helsinki.fi/en/aytkt21010/129098202

An fancy single page app for an imaginary puppy farm.

## Demo

Running at: https://pentutehdas.surge.sh

To test all functionality:
  - login as **breeder** pw: ananas
    - add a couple dogs
    - add a litter with an estimated due date in the future
    - edit the litter, change the due date for today, mark how many puppies were born
  - register as a new user or login as **user** pw: ananas
    - make a puppy reservation
  - login as **admin** pw: ananas
    - review all the litters and see the reservations
    - check user roles and statistics, promote a user
  - to test the subscriptions, open the website in 2 browsers or tabs
    - adding or editing a litter should pop up a toast notification in both browsers, and the list of litters should reflect the changes live
    - the demo website sometimes has problems connecting to the sleeping heroku backend, and it can require a page reload to get the subcriptions working

### Tech stack

- back-end is a Node.js Apollo GraphQL API, running at Heroku.com
- front-end made with React
- MongoDB running in atlas


- Data on dogs, litters and users (for the admin) is stored in the Apollo Client cache.
- User state is provided to child components via the Context API


### React client component diagram

![Component diagram](./component_diagram.svg)

### Completed functionality, Front / Back

| Feature     | Create | Read | Update | Delete |
| :---------- | :----: | :--: | :----: | :----: |
| Dog         |  F, B  | F, B |        |  F, B  |
| Litter      |  F, B  | F, B |  F, B  |  F, B  |
| User        |  F, B  | F, B |  F, B  |        |
| Reservation |  F, B  | F, B |  F, B  |  F, B  |


#### Missing by design
- Dogs can't be updated, can delete one and create another with correct info
- Users can't be deleted, admin can do it manually if needed
- User password can't be changed or get a reminder in email


#### Critical missing features
- User registering doesn't use any real bot prevention method, like reCAPTCHA
- GraphQL endpoint for creating a user is also left open


### time records

| date  | hours | time was spent on  |
| :---: | :---: | ------- |
| 9.5.  |  6    | react frontend aloitus, graphql backend aloitus |
| 10.5. |  4    | react apollo client, bulma table, timeformat with moment  |
| 11.5. |  11   | login with JSONWebToken, dogs and litter have link to user, navbar, heropalkki navbarin tilalle, add routing |
| 12.5. |  9    | async await bugi, userform, footer, dogform, optimize breed select |
| 13.5. |  6    | app.js handles user, fixed footer, start moving login away from navbar, random dog generator, actually add dogs |
| 14.5. |  5    | delete dogs, show breeders only their own dogs, prepare to show dog info from wiki |
| 15.5. |  1    | use cross-env on client |
| 16.5. |  4    | adding litters working 50%, no puppies yet |
| 17.5. |  6    | progressbar, puppies listed on main page, bulma columns rock |
| 18.5. |  5    | prepare to edit litters, return to using navbar and place login on the page, NaN bug |
| 26.5. |  12   | clean up forms, return to using react-select for the dog breed combobox, remove randomDog(), createUser frontend working, get rid of unique index for user.phone and user.email, background image, updating user working |
| 27.5. |  6    | litter details show reservations, preparing to edit litter |
| 28.5. |  9    | editing litters working but fontawesome icons causing errors when puppy list changes, use react-fontawesome, backend checks who is doing the updating, loginForm checks username availability when registering, puppies shown as a list of icons instead of true/false |
| 30.5. |  10   | trying to get table look decent failed, start frontpage redesign with divs, halfway done with redesign, totally done, pagination |
| 31.5. |  6    | graphql fragments and LITTER_ADDED subscription, react-toast and subscription now adds litter to apollo cache, social links to footer, heroku free server slowness causing websocket errors |
| 1.6.  |  11   | sort litters by puppies existing and puppy age, let users hide over 2 month old litters, newly added litters by user went to end of the list, remove litters with a button that asks to confirm, split typeDefs into separate files, split resolvers, error boundary |
| 2.6.  |  7    | start using ESLint, making and deleting reservations is working and we are feature complete, reservations loaded on a need to know basis |
| 3.6.  |  8    | start error handling redesign by implementing Sentry.io, prevent adding puppies before due date, add cancel buttons for mobile users, was sorting litters too early, updating reservation cache done automatically by returning a fully populated litter object, start clearing the bloated App.js |
| 4.6.  |  12   | cleanup continues, App.js got slim but now LitterList is bloated, reduced the many passed props down to user and login, resetStore() caused litters.loading to stay true, user roles management page with statistics, updating roles working |
| 5.6.  |  9    | Pagination component is now reusable, start using Prettier, Pagination uses divs for layout, Prettier made Router look messy, do the redirecting inside the components, ConfirmButton made reusable, install Cypress |
| 6.6.  |  9    | Cypress resets database beforeEach test, Cypress kept clearing localStorage after each tests, Cypress tests cover most functionality |
| 7.6.  |  11    | learning about Heroku Scheduler scripts, db-clean-up.js removes over 6 month old litters, separate LitterDetails as a component, move handling user state inside apollo cache and avoid passing it as a prop, app refactoring complete, Litter components into a subfolder, Loading animation of a running dog, Bug fix, translate readme.md |
| 8.6.  |  10    | component diagram, png looked blurry, basic honeypot for spambots, show users advice about a reservation, prevent username changing, import Bulma instead of loading CSS from CDN<br/> Apollo cache was causing issues when logging out and setting fetchPolicy to 'no-cache' caused every component to query the backend for current logged in user, so Context API to the rescue<br/> require either phone or email when registering, disallow changing role of usernames 'admin, breeder, user' |
| 9.6.  |  6    | move components into folders, user profile edits were not being updated to the context, Cypress test tweaks, add route for bad URL, subscribe to litter edits and use hooks for subs, persist user login accross reloads |
| 10.6. |  4    | bug hunting, admin now able to remove anyone's litters, heroku scheduler script to create mock litters weekly |
| total | 188   |   |
