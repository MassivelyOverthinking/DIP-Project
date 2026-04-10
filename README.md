# DIP Projekt 2 – Chat Applikation (Express.js, Pug, HTML, CSS)

## Brugere

En bruger har: id, brugernavn, kodeord (hashed), bruger niveau (1-3):

**Niveau 1 (User) =>**  Kan kun se chats som brguerene er en aktiv del af (kan ikke slette/rette egne beskeder)
**Niveau 2 (Moderator) =>**  Kan oprette egne chats + oprette/slette sine egne beskeder.
**Niveau 3 (Admin) =>**  Har adgang til samtlige funktionaliteter inklusiv rettelser/sletninger af eksisterende brugere og moderatorer. 

## Yderligere information
Som anset i kodebasen så har vi igennem projektets gang brugt controller-klasserne oven i hinanden, selvom vi har forstået at dette valg af opbygning generelt bryder med den arkitektur-model som vi forsøgte at anvende.
Grunden til dette valgt ver generelt tidspres kombineret med det faktum at vi ikke havde fuldt ud viste dette ikke var den korrekte tilgang før sent henne af den sidste arbejdsdag. Resultatet af dette er yderst høj kobling af logik på bagenden, som kunne være løst af et konkret mellem-lager mellem de eksisterende **Controller**-klasser, som håndterede logik på tværs af instanser.

De individuelle burgere kan sletter beskeder, baseret på deres anvendelses niveau, men der er ikke mulighed for at kunne redigere eksisterende beskeder efter de er blevet sendt.

**NOTE**: Alle de nuværende brugere som er tilgængelige er har password: **123**. Vi har nemlig hashet vores passwords med bcrypt.