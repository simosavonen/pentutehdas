# pentutehdas
Full Stack harjoitustyö.

### Arkkitehtuuri

- back-end on Node.JS Apollo GraphQL API, suoritetaan herokussa
- front-end on React.JS sovellus, sijoitetaan muualle
- tietokantana MongoDB atlaksessa

### Muistiinpanoja

Koska backend on git repon alikansiossa, käytä heroku deploy komentoa:
`C:\pentutehdas\git subtree push --prefix server heroku master`

Frontti surge.sh palveluun: käytä komentoa `npm run deploy`

backend url: https://pentutehdas.herokuapp.com 

frontend url: https://pentutehdas.surge.sh

### Valmiit toiminnot, Front / Back

| Feature     | Create | Read   | Update | Delete |
| :----       | :----  | :----  | :----  | :----  |
| Dog         | F, B   | F, B   |        |        |
| Litter      |        | F, B   |        |        |
| User        | B      | F, B   |        |        |
| Reservation |        | B      |        |        |

### työaikakirjanpito

| päivä | aika  | mitä tein |
| :----:| :---- | :-----    |
| 9.5.  | 6     | react frontend aloitus, graphql backend aloitus |
| 10.5. | 4     | react apollo client, bulma table, timeformat with moment |
| 11.5. | 11    | login with JSONWebToken, dogs and litter have link to user, navbar, heropalkki navbarin tilalle, add routing |
| 12.5. | 9     | async await bugi, userform, footer, dogform, optimize breed select |
| 13.5. | 6     | app.js handles user, fixed footer, start moving login away from navbar, random dog generator, actually add dogs |
| yht   | 37    | | 
