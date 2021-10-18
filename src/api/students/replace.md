# Create users

find:
^ .([A-Z].*)$
replace:
{"name": "$1","id": "$1"},

# Abbreviate id
"id": "([A-Z])[a-z]* ([A-Z])[a-z]* ([A-Z])[a-z]*"
"id": "$1$2$3"

"id": "([A-Z])[a-z]* ([A-Z])[a-z]*"
"id": "$1$2"

# email
scaricando la lista dei membri della classe da google admin
find: ^([A-Z].*),([a-z.]+@marconicloud.it),MEMBER,USER
replace: {"name": "$1","email": "$2"},