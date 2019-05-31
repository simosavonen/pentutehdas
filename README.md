# pentutehdas
Full Stack harjoitustyö.

### Arkkitehtuuri

- back-end on Node.js Apollo GraphQL API, suoritetaan herokussa
- front-end on React sovellus, sijoitetaan surge.sh palveluun
- tietokantana MongoDB atlaksessa

Apollon välimuistissa lista koirista ja pesueista. 
Yksittäiset komponentit käyttävät **useState()** tilan ylläpitämiseen.
Tarvittaessa otetaan Context API avuksi, mikäli propseja välitetään liian monen komponentin kautta.

Käyttäjiä on kolmea tyyppiä

- **user** saa tehdä (rajallisen määrän) varauksia pennuista ja päivittää omat yhteystietonsa.
- **breeder** voi luoda/poistaa omia koiriaan ja pesueitaan, voi muokata pesueen tietoja.
- **admin** voi ylentää käyttäjän luokkaan breeder, voi poistaa kenen tahansa koiran tai pesueen.

Testaamiseen tunnus / salasana
- user / ananas
- breeder / ananas
- admin / ananas

Harkitaan mahdollisuutta varata pentuja ilman kirjautumista. Miten estetään häiriköivä käyttäjä?

Pesue voidaan luoda ennen synnytystä, jolloin sitä muokataan myöhemmin ja merkitään pentujen sukupuoli ja lukumäärä. Kun pentu on löytänyt uuden kodin, sen voi poistaa pesueesta.

Varaus on pelkkä yhteystieto tai käyttäjätunnus. Kasvattaja ottaa yhteyttä varaajaan ja sopii yksityiskohdista: haluaako varaaja nartun tai urospennun, minkä Prisman parkkipaikalle pentu toimitetaan?

Koiraroduista näytetään yleisiä tietoja esim. wikipediasta. Mietitään mahdollisuutta lisätä kuva omasta koirasta, tai sivu voisi hakea verkosta kuvan koirarodusta.

 
### Muistiinpanoja

Koska backend on git repon alikansiossa, käytä heroku deploy komentoa:
`C:\pentutehdas\git subtree push --prefix server heroku master`

Frontti surge.sh palveluun: käytä komentoa `C:\pentutehdas\client\npm run deploy`

backend url: https://pentutehdas.herokuapp.com 

frontend url: https://pentutehdas.surge.sh

### Valmiit toiminnot, Front / Back

| Feature     | Create | Read   | Update | Delete |
| :----       | :----: | :----: | :----: | :----: |
| Dog         | F, B   | F, B   |        | F, B   |
| Litter      | F, B   | F, B   |  F, B  |        |
| User        | F, B   | F, B   |  F, B  |        |
| Reservation |        | F, B   |        |        |

### työaikakirjanpito

| päivä | aika  | mitä tein |
| :----:| :----:| :-----    |
| 9.5.  | 6     | react frontend aloitus, graphql backend aloitus |
| 10.5. | 4     | react apollo client, bulma table, timeformat with moment |
| 11.5. | 11    | login with JSONWebToken, dogs and litter have link to user, navbar, heropalkki navbarin tilalle, add routing |
| 12.5. | 9     | async await bugi, userform, footer, dogform, optimize breed select |
| 13.5. | 6     | app.js handles user, fixed footer, start moving login away from navbar, random dog generator, actually add dogs |
| 14.5. | 5     | delete dogs, show breeders only their own dogs, prepare to show dog info from wiki |
| 15.5. | 1     | use cross-env on client |
| 16.5. | 4     | adding litters working 50%, no puppies yet  |
| 17.5. | 6     | progressbar, puppies listed on main page, bulma columns rock |
| 18.5. | 5     | prepare to edit litters, return to using navbar and place login on the page, NaN bug |
| 26.5. | 12     | clean up forms, return to using react-select for the dog breed combobox, remove randomDog(), createUser frontend working, get rid of unique index for user.phone and user.email, background image, updating user working |
| 27.5. | 6     | litter details show reservations, preparing to edit litter  |
| 28.5. | 9     | editing litters working but fontawesome icons causing errors when puppy list changes, use react-fontawesome, backend checks who is doing the updating, loginForm checks username availability when registering, puppies shown as a list of icons instead of true/false |
| 30.5. | 10     | trying to get table look decent failed, start frontpage redesign with divs, halfway done with redesign, totally done, pagination |
| 31.5. | 6     | graphql fragments and LITTER_ADDED subscription, react-toast and subscription now adds litter to apollo cache, social links to footer, heroku free server slowness causing websocket errors |
| yht   | 103    | | 
