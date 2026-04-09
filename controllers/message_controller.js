//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// IMPORTS & MODULES
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// MESSAGE CONTROLLER FUNCTIONS
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

const filePath = "./data/messages.json";

export class MessageController {
    static #messages = [];
    static #initialized = false;

    static async initialize() {
        if (this.#initialized) return;

        try {
            const data = await fs.readFile(filePath, "utf-8");
            this.#messages = JSON.parse(data);
        } catch {
            this.#messages = [];
        }

        this.#initialized = true;
    }

    static async saveMessages() {
        await fs.writeFile(filePath, JSON.stringify(this.#messages, null, 2));
    }

    static findById(id) {
        return this.#messages.find(m => m.id == id);
    }

    static findByChat(chatID) {
        return this.#messages.filter(m => m.chatID == chatID);
    }

    // GET /chats/:id/messages
    static async getByChat(req, res) {
        await this.initialize();

        const msgs = this.findByChat(req.params.id);
        res.json(msgs);
    }

    // GET /chats/:id/messages/:mid
    static async getOne(req, res) {
        await this.initialize();

        const msg = this.findById(req.params.mid);
        if (!msg) return res.status(404).send("Ikke fundet");

        res.json(msg);
    }

    // POST /chats/:id/messages
    static async create(req, res) {
        await this.initialize();

        if (!req.session.user) return res.status(401).send("Log ind");

        if (req.session.user.level < 2) {
            return res.status(403).send("Ingen rettigheder");
        }

        const newMsg = new Message(
            req.body.text,
            new Date(),
            req.session.user.id,
            req.params.id
        );

        this.#messages.push(newMsg);
        await this.saveMessages();

        res.json(newMsg);
    }

    // DELETE /chats/:id/messages/:mid
    static async remove(req, res) {
        await this.initialize();

        const msg = this.findById(req.params.mid);
        if (!msg) return res.status(404).send("Ikke fundet");

        if (req.session.user.level < 3 && msg.owner != req.session.user.id) {
            return res.status(403).send("Ingen adgang");
        }

        this.#messages = this.#messages.filter(m => m.id != req.params.mid);
        await this.saveMessages();

        res.send("Slettet");
    }
}

