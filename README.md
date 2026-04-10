# DIP Projekt 2 – Chat Applikation (Express.js, Pug, HTML, CSS)

---

## Brugere

En bruger har: id, brugernavn, kodeord (hashed), bruger niveau (1-3):

* **Niveau 1 (User) =>**  Kan kun se chats som brugeren er en aktiv del af, og har ingen mulighed for at slette og/eller rette i eksisterende Chat-messages.
* **Niveau 2 (Moderator) =>**  Kan oprette med eksisterende brugere, samt slette eksisterende beskeder som brugeren selv er forfatter af.
* **Niveau 3 (Admin) =>**  Har adgang til samtlige funktionaliteter inklusiv rettelser/sletninger af eksisterende brugere og moderatorer. Kan derudover fortager sletninger af eksisterende brugere, og også ændre deres adgangsniveau.

## Test
For at simulere et konkret brugermiljø har vi valgt at oprette de følgende objekter på forhånd:

**NOTE**: Alle de nuværende brugere som er tilgængelige er har password: **123**. Vi har nemlig hashet vores passwords med bcrypt.

#### Users
* **Brugernavn: KAJ** => Admin
* **Brugernavn: TORBEN** => Moderator
* **Brugernavn: BEN** => Bruger

#### Chats
* **The Boys** => Oprettet af *KAJ*, og deltager er *TORBEN*
* **Ted Talk** => Oprettet af *TORBEN*, og deltager er *BENT*

#### Messages
Hver Chat vil bestå af en kort række af besker sendt af begge brugere.

## Yderligere information
Som anset i kodebasen så har vi igennem projektets gang brugt controller-klasserne oven i hinanden, selvom vi har forstået at dette valg af opbygning generelt bryder med den arkitektur-model **(MVC)** som vi forsøgte at anvende.</br>
Grunden til dette valgt var generelt tidspres kombineret med det faktum at vi ikke fuldt ud viste dette ikke var den korrekte tilgang før sent henne af den sidste arbejdsdag. Resultatet af dette er yderst høj kobling af logik på bagenden, som kunne være løst af et konkret mellem-lager mellem de eksisterende **Controller**-klasser, som håndterede logik på tværs af instanser.</br>
Som et eksempel på hvordan sådan et mellemlager kunne udformes og anvendes har vi kort forsøgt at implementere **MiddleLayer**-klassen i **Service**-folderen. Denne bruges til **safeDelete**- og **safeCreate**-metoderne i Message-Controller. 