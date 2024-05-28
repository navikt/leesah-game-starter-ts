# LEESAH starter for TypeScript!

> Leesah-game er et hendelsedrevet applikasjonsutviklingspill som utfordrer spillerne til å bygge en hendelsedrevet applikasjon. 
> Applikasjonen håndterer forskjellige typer oppgaver som den mottar som hendelser på en Kafka-basert hendelsestrøm. 
> Oppgavene varierer fra veldig enkle til mer komplekse.


## Kom i gang
For å kunne bruke starteren trenger du Node v21+ og npm v10+

Hvis du vil bruke yarn istedenfor npm fungerer dette også fint.

### Hent Kafkasertifikat

Sertifikater for å koble seg på Kafka ligger tilgjengelig på [leesah-game-cert.ekstern.dev.nav.no/certs](https://leesah-game-cert.ekstern.dev.nav.no/certs), brukernavn og passord skal du få utdelt.

Unzip sertifikatet, da skal du ha en `student-certs.yaml` fil tilgjengelig. Plasser `student-certs.yaml` i `certs` mappen:

    .
    ├── certs                   
        └── *** PLASSER student-certs.yaml HER ***
    ├── src
    ...

### Installer pakker

```bash
npm install
```

### Sett opp lag i `main.ts`
Sett opp ditt lag ved å gi deg selv et lag-navn og hex-kode:
```js
// ./src/main.ts

const TEAM_NAME = "***your team name***";
const HEX_CODE = "***your team color***";
```

### Kjør starteren

```bash
npm run start
```

