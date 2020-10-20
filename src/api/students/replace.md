# Create users

find: ^(.*)$
replace: {"name": "$1","id":"$1"},

# Abbreviate id
"id":"([A-Z])[a-z]* ([A-Z])[a-z]* ([A-Z])[a-z]*"
"id":"$1$2$3"

"id":"([A-Z])[a-z]* ([A-Z])[a-z]*"
"id":"$1$2"