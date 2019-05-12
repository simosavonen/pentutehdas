# pentutehdas
Full Stack harjoitustyö.

### Arkkitehtuuri

- back-end on Node.JS REST API, suoritetaan herokussa
- front-end on React.JS sovellus, sijoitetaan muualle, vaikka Zeit Now palveluun
- tietokantana MongoDB atlaksessa

Kirjautuminen toivottavasti Googlen oAuth, jos ei ala sujua niin tutumpi JSONWebToken.

GraphQl jäi hataralle pohjalle, ehkä käytän sitä back-endissä.
Koitan kerrata kurssilla esitellyt teknologiat, Redux jne.

Käyttöliittymän toteutus Bulmalla, varalla tuttu Bootstrap.

### Muistiinpanoja

Koska backend on git repon alikansiossa, käytä heroku deploy komentoa:
`C:\pentutehdas\git subtree push --prefix server heroku master`

Frontti surge.sh palveluun: käytä komentoa `npm run deploy`

backend url: https://pentutehdas.herokuapp.com 
(vain graphql POST toimii tällä hetkellä)

frontend url: https://pentutehdas.surge.sh
(pelkkä skeleton vielä)

### työaikakirjanpito

| päivä | aika | mitä tein  |
| :----:|:-----| :-----|
| 9.5.  | 6    | react frontend aloitus, graphql backend aloitus |
| 10.5.  | 4    | react apollo client, bulma table, timeformat with moment |
| 11.5.  | 11    | login with JSONWebToken, dogs and litter have link to user, navbar, heropalkki navbarin tilalle, add routing |
| 12.5.  | 9    | async await bugi, userform, footer, dogform, optimize breed select |
| yht   | 31    | | 
