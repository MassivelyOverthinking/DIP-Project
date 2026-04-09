//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
import { error, timeLog, timeStamp } from 'console';
import fs from 'fs/promises';
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// MESSAGE CONTROLLER FUNCTIONS
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
const filePath = './data/messages.json';

// Sørger for at besked-filen findes på disk.
// Hvis filen ikke findes endnu, oprettes den med et tomt array ([]),
// så resten af controlleren altid kan læse/skrive sikkert til samme fil.
async function ensureMessagesFile(params) {
    try {
        await fs.access(filePath);
    } catch {
        await fs.writeFile(filePath, '[]', 'utf8');
    }
}

// Læser alle beskeder fra JSON-filen.
// 1) Kalder først ensureMessagesFile() for at garantere at filen findes.
// 2) Læser filens indhold som tekst.
// 3) Returnerer [] hvis filen er tom, ellers parses JSON-data til array.
async function loadMessage() {
    await ensureMessagesFile();

    const data = await fs.readFile(filePath,'utf8');

    if(!data || !data.trim()){
        return [];
    }
    return JSON.parse(data);
}

// Gemmer hele besked-listen tilbage til disk.
// Vi gemmer med indryk (null, 2), så filen er nem at læse manuelt.
async function saveMessages(messages) {
    await fs.writeFile(filePath, JSON.stringify(messages, null, 2), 'utf8');
}

// Finder den bruger, der laver requestet.
// Prioritet:
// 1) session.username (hvis bruger er logget ind via session)
// 2) requesterId i body/query
// 3) x-user-id eller x-username i headers
// Returnerer null hvis ingen identitet findes.
function getRequesterId(id){
    return (
        request.session?.username || 
        request.body?.requesterId ||
        request.query?.requesterId ||
        request.headers['x-user-id'] ||
        request.headers['x-username'] ||
        null
    );
}

// Opretter og gemmer en ny besked.
// Kræver senderId, senderNavn, receiverId og text i request.body.
// Tildeler automatisk:
// - id (inkrementeret ud fra eksisterende beskeder)
// - timestamp (ISO-format)
// Returnerer den oprettede besked.

export async function sendMessage(request, response) {
    try {
        const { senderId, senderNavn, receiverId, text} = request.body;

        if (!senderId || !senderNavn || !receiverId || !text) {
            return response.status(400).JSON({
                error: 'senderId, senderNavn, receiverId og text er påkrevet'
            });
        }

        const messages = await loadMessages();

        const newMessages = {
            id: messages.length ? Math.max(...messages.map(message => messages.id || 0)) 
+ 1 : 1,
            senderId,
            senderNavn,
            receiverId,
            text,
            timeStamp: new Date().toISOString()
        };

        messages.push(newMessages);
        await saveMessages(messages);

        return response.status(201).JSON(newMessages);
    } catch (error) {
        console.error('error in sendMessage:', error);
        return response.status(500).JSON({ error: 'Kunnde ikke sende besked' });
    }
}

// Henter beskeder som den aktuelle bruger må se.
// En bruger må kun se beskeder hvor vedkommende er afsender eller modtager.
// Hvis query-parametret otherUserId er sat, filtreres der til kun samtalen
// mellem requester og den bruger.
export async function getMessage(request, response) {
    try {
        const requesterId = getRequesterId(request);
        const otherUserId = request.query.otherUserId;

        if (!requesterId) {
            return response.status(400).json({
                error: 'requesterId eller session-bruger skal angives'
            });
        }

        const messages = await loadMessages();

        const allowedMessages = messages.filter(message => {
            const isParticipant = message.senderId === requesterId || message.reciverId === requesterId;

            if ( !isParticipant) {
                return false;
            }

            if (!otherUserId) {
                return true;
            }

            return (
                (message.senderId === requesterId && message.receiverId === otherUserId) ||
                (message.senderId === otherUserId && message.receiverId === requesterId) 
            );
        });

        return response.status(200).JSON(allowedMessages);
    } catch (error) {
        console.error('Error in getMessages:', error);
        return response.status(500).JSON({ error: ' Kunnde ikke hente beskeder'});
    }
}

// Redigerer én specifik besked (via route-param :id).
// Kun beskedens afsender må redigere den.
// Opdaterer text (hvis angivet) og sætter editedAt timestamp.
export async function editMessage(request, response) {
    try {
        const requesterId = getRequesterId(request);
        const messageId = Number(request.params.id);
        const { text } = request.body;

        if (!requesterId) {
            return response.status(400).json({
                error: 'requesterId eller session-bruger skal angives'
            });
        }

        const messages = await loadMessages();
        const messageIndex = messages.findIndex(message => message.id === messageId);

        if (messageIndex === -1) {
            return response.status(404).json({ error: 'Besked ikke fundet' });
        }

        const message = messages[messageIndex];

        if (message.senderId !== requesterId) {
            return response.status(403).json({ error: 'Du må kun redigere egne beskeder' });
        }

        messages[messageIndex] = {
            ...message,
            text: text ?? message.text,
            editedAt: new Date().toISOString()
        };

        await saveMessages(messages);

        return response.status(200).json(messages[messageIndex]);
    } catch (error) {
        console.error('Error in editMessage:', error);
        return response.status(500).json({ error: 'Kunne ikke redigere besked' });
    }
}

// Sletter én specifik besked (via route-param :id).
// Kun beskedens afsender må slette den.
export async function deleteMessage(request, response) {
    try {
        const requesterId = getRequesterId(request);
        const messageId = Number(request.params.id);

        if (!requesterId) {
            return response.status(400).json({
                error: 'requesterId eller session-bruger skal angives'
            });
        }

        const messages = await loadMessages();
        const message = messages.find(savedMessage => savedMessage.id === messageId);

        if (!message) {
            return response.status(404).json({ error: 'Besked ikke fundet' });
        }

        if (message.senderId !== requesterId) {
            return response.status(403).json({ error: 'Du må kun slette egne beskeder' });
        }

        const filteredMessages = messages.filter(savedMessage => savedMessage.id !== messageId);

        await saveMessages(filteredMessages);

        return response.status(200).json({ message: 'Besked slettet' });
    } catch (error) {
        console.error('Error in deleteMessage:', error);
        return response.status(500).json({ error: 'Kunne ikke slette besked' });
    }
}

// Sletter alle beskeder sendt af requester.
// Beskeder modtaget af requester påvirkes ikke.
// Returnerer hvor mange beskeder der blev fjernet (removedCount).
export async function deleteAllSentMessages(request, response) {
    try {
        const requesterId = getRequesterId(request);

        if (!requesterId) {
            return response.status(400).json({
                error: 'requesterId eller session-bruger skal angives'
            });
        }

        const messages = await loadMessages();
        const keptMessages = messages.filter(message => message.senderId !== requesterId);
        const removedCount = messages.length - keptMessages.length;

        await saveMessages(keptMessages);

        return response.status(200).json({
            message: 'Alle sendte beskeder er slettet',
            removedCount
        });
    } catch (error) {
        console.error('Error in deleteAllSentMessages:', error);
        return response.status(500).json({ error: 'Kunne ikke slette alle sendte beskeder' });
    }
}














