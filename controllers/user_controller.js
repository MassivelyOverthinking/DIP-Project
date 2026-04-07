//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// IMPORTS & MODULES
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

import { validateUser } from "../utility/utils";

//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// CONTROLLER FUNCTIONS
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

export async function login(request, response) {
    try {
        const { username, password } = request.body;
        const isValidUser = await validateUser(username, password);

        if (isValidUser) {
            request.session.isValidUser = true;
            request.session.username = username;
            response.redirect('/');
        } else {
            response.render('noAccess');
        }
    } catch (error) {
        console.error("Error during login:", error);
        response.status(500).send("Internal Server Error");
    }
}