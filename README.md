# LEESAH starter for TypeScript!

> Leesah-game er et hendelsedrevet applikasjonsutviklingspill som utfordrer spillerne til å bygge en hendelsedrevet applikasjon. 
> Applikasjonen håndterer forskjellige typer oppgaver som den mottar som hendelser på en Kafka-basert hendelsestrøm. 
> Oppgavene varierer fra veldig enkle til mer komplekse.


## Kom i gang
For å kunne bruke starteren trenger du Node v21+ og npm v10+

Hvis du vil bruke yarn istedenfor npm fungerer dette også fint.

### Installer pakker

```bash
npm install
```

### Hent Kafkasertifikat

Sertifikater for å koble seg på Kafka ligger tilgjengelig på [leesah-game-cert.ekstern.dev.nav.no/certs](https://leesah-game-cert.ekstern.dev.nav.no/certs), brukernavn og passord skal du få utdelt.

Unzip sertifikatet, da skal du ha en `student-certs.yaml` fil tilgjengelig. Plasser `student-certs.yaml` i `certs` mappen:

    .
    ├── certs                   
        └── *** PLASSER student-certs.yaml HER ***
    ├── node_modules
    ├── src
    ...

### Kjør starteren

```bash
npm run start
```

---
---
---

## For lokal utvikling

For å spinne opp docker-compose:

Sette opp host:

```bash
export HOST_IP=$(ifconfig | grep -E "([0-9]{1,3}\.){3}[0-9]{1,3}" | grep -v 127.0.0.1 | awk '{ print $2 }' | cut -f2 -d: | head -n1)
```

Sett miljøvariablen i .env til å peke mot lokal kjøring av kafka:
```bash
STUDENT_KURS=false
```

Kjør docker compose

```bash
docker compose up -d
```
