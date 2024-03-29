var yamlPlaceholder = `---
subject: Sistemi e reti
#  Ruolo di un sistemista, enti di standardizzazione, breve storia della rete internet, livello 1 fisico: mezzi trasmissivi, MAC address. 
info:
  notes: ''
  time:
    standard: 35m
    dsa: 40m
  marks:
    correct: 1
    wrong: -0.125
    omitted: 0.125
itemList:
- type: multiple-choice
  skills:
  - understanding
  bodies:
  - question: Quali di questi è un MAC address valido?
    answers:
    - "aa:bb:cc:dd:ee:ff"
    - "ab:cd:ef:gh:il:mn"
    - "aa:bb:cc:dd:ee"
    - "ab:cd:ef:gh:il:mn:op"
  - question: Quali di questi è un MAC address valido?
    answers:
    - "12:34:56:78:9a:bc"
    - "12:34:56:78:9a:bc:de"
    - "12:34:56:78:9a"
    - "1234:5678"
- type: multiple-choice
  skills:
  - knowledge
  bodies:
  - question: Da quanti bit è formato un MAC address?
    answers:
    - 48
    - 6
    - 12
    - 24
  - question: Da quanti byte è formato un MAC address?
    answers:
    - 6
    - 48
    - 12
    - 24
- type: open-answer
  skills:
  - application
  bodies:
  - question: "Descrivere come è fatto un indirizzo MAC, qual è il suo uso, da quale ente è gestito. Scrivere un esempio di un possibile indirizzo MAC valido."
  nRows: 4
  evaluation:
    hint: è fatto da 6 byte nella forma aa:bb:cc:dd:ee:ff, i primi 3 sono il manufacturer, gli altri id della scheda. Unico in tutto il mondo. Gestito da ICANN. Serve ad identificare in modo univoco un'interfaccia di rete.
    pointList:
    - description: esempio
      short: es
      points: 1
    - description: formato
      short: form
      points: 1
    - description: uso
      short: use
      points: 1
    - description: standard
      short: standard
      points: 1



`