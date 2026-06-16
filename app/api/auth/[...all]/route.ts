import { auth } from "@/app/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
 
/*
    This API route handles all authentication requests.
 
    It uses the Better Auth library for this purpose.
 
    The actual configuration (such as login, registration,
    sessions, and security) is located in auth.ts.
 
    This route only acts as a "pass-through" between Next.js
    and the authentication logic.
*/
 
/*
    toNextJsHandler()
 
    Converts the Better Auth configuration to an API handler
    that is compatible with the Next.js App Router.
 
    This eliminates the need to manually
    program GET and POST requests.
*/
 
export const {
   
    /*
        GET requests are used for actions such as:
 
        - checking an existing session;
 
        - retrieving user information;
 
        - other read actions within authentication.
    */
    GET,
   
    /*
        POST requests are used for actions where
        data is sent.
 
        For example:
 
        - logging in;
 
        - logging out;
 
        - registering;
 
        - renewing sessions;
 
        - other authentication actions.
    */
    POST,
 
 } = toNextJsHandler(auth);