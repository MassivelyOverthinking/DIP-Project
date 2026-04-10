# DIP Projekt 2 – Chat Server & Klient
I dette projekt laver vi en chat-app med en server og en klient.

# Der er 3 niveauer brugere på siden:

Niveau 1    Kan kun se chats (kan ikke slette/rette egne beskeder)
Niveau 2    Kan oprette egne chats + oprette/slette sine egne beskeder
Niveau 3 →  Kan det hele oprette/slette andres chats og se brugere og administere.

# Brugere
En bruger har: id, brugernavn, kodeord, oprettelses niveau (1-3)

Disse er vores HTTP kommandoer vi har brugt og opfyldt de endpoints der skal kræves:

**GET: hente data**
**POST: oprette noget nyt**

# chatRoute.js

# messageRoute.js

# userRoute.js

Vi bruger controller funktionerne i andre controller selvom det ikke er den korrekte metode, da vi fik det af vide sidst på dagen, at man skulle helst undgå det. 

Vi kan slette messages og ikke editere messages

# ALLE BRUGERE HAR PASSWORD: 123
**NOTE**: Vi har nemlig hashet vores passwords med bcrypt.