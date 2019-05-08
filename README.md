# pentutehdas
Ehdotus Full Stack harjoitustyön aiheeksi.

### Arkkitehtuuri

- back-end on Node.JS REST API, suoritetaan herokussa
- front-end on React.JS sovellus, sijoitetaan muualle, vaikka Zeit Now palveluun
- tietokantana MongoDB atlaksessa

Kirjautuminen toivottavasti Googlen oAuth, jos ei ala sujua niin tutumpi JSONWebToken.

GraphQl jäi hataralle pohjalle, ehkä käytän sitä back-endissä.
Koitan kerrata kurssilla esitellyt teknologiat, Redux jne.

Käyttöliittymän toteutus Bulmalla, varalla tuttu Bootstrap.

### Sivuston idea

Tehdään huumorilla 'liian hienot' kotisivut arvelluttavalle pentutehtailulle. Sivulla listataan tiineet koirat ja laskettu synnytyspäivä. Kävijät voivat varata pentuja joko anynyymisti tai halutessaan kirjautumisen kautta. Varaustieto on pelkkä puhelinnumeron loppuosa, johon emon omistaja voi soittaa sopiakseen toimituksesta Prisman parkkipaikalle.

Back-end huolehtii siitä, että sivustolla on aina päivittynyttä dataa, annetaan vaikutelma suuresta käyttäjämäärästä ja vilkkaasta bisneksestä.

### valinnaisia lisäominaisuuksia

- kävijät voisivat lisätä myyntiin tai luovutukseen omia pentujaan
- laajennetaan koiranpennuista kissanpoikiin, matelijoihin, mihin vaan.
- sähköpostiin ilmoitus jos joku tekee varauksen pennuistasi
