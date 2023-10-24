# Create users

## Procedura

Scaricare la lista dei membri della classe da google admin.

Aggiungere colonne su Google Sheet in modo da dividere nome e cognome:

```text
=INDEX(SPLIT(A2," "),1,1) // Nome
=INDEX(SPLIT(A2," "),1,2) // Cognome
```

Rivedere a mano i nomi con spazi.

Ordinare in base al cognome

Quindi scaricare il file csv e qui fare:

- find: `^([A-Z].*),([A-Z].*),([a-z.]+@marconicloud.it)$`
- replace: `{"givenName": "$1","familyName":"$2","email": "$3"},`

## Altri metodi

Scaricando direttamente il `.csv.` da Google Admin:

- find: `^([A-Z].*),([a-z.]+@marconicloud.it),MEMBER,.*USER$`
- replace: `{"name": "$1","email": "$2"},`

### Nome-cognome

Split di nome e cognome:

- "name": "([\w']+) ([\w\s]+)",
- "givenName":"$1","familyName":"$2",

### Deprecati

#### Da lista nomi a JSON

find:
^ .([A-Z].*)$
replace:
{"name": "$1","id": "$1"},

#### Abbreviate id

find: `"id": "([A-Z])[a-z]* ([A-Z])[a-z]* ([A-Z])[a-z]*"`
replace: `"id": "$1$2$3"``

find: `"id": "([A-Z])[a-z]* ([A-Z])[a-z]*"`
replace: `"id": "$1$2"`
