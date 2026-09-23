async function checkLoginType() {

    const prefix =
        document
            .getElementById("emailPrefix")
            .value
            .trim()
            .toLowerCase();

    const domain =
        document
            .getElementById("emailDomain")
            .value
            .trim()
            .toLowerCase();

    const loginError =
        document.getElementById("loginError");

    loginError.innerText = "";


    // No username
    if (!prefix) {

        loginError.innerText =
            "Please enter your CMC mail ID.";

        return;
    }


    // Only allow username/local-part
    const validUsername =
        /^[a-zA-Z0-9._-]+$/;

    if (!validUsername.test(prefix)) {

        loginError.innerText =
            "Please enter a valid mail ID.";

        return;
    }


    // Build complete email
    const email =
        prefix + domain;


    console.log("Login email:", email);


    try {

        const response =
            await fetch(
                "/api/auth/checkUser",
                {
                    method: "POST",

                    headers: {
                        "Accept":
                            "application/json",

                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        email: email
                    })
                }
            );


        const result =
            await response.json();


        console.log(
            "User check:",
            result
        );


        if (
            !response.ok ||
            !result.registered
        ) {

            loginError.innerText =
                result.message ||
                "Not a registered user.";

            return;
        }


        sessionStorage.setItem(
            "usrDetails",
            JSON.stringify(result.user)
        );


        /*
         * Since the domain is fixed to
         * @cmc.edu.in, Google login will be used.
         *
         * If you later need Microsoft users as well,
         * we can make this domain dynamically selectable.
         */

        const provider =
            getLoginProvider(email);


        if (provider === "microsoft") {

            msSignIn();

        } else {

            googleSignIn();

        }

    } catch (error) {

        console.error(
            "User check error:",
            error
        );


        loginError.innerText =
            "Unable to verify user. Please try again.";
    }
}

/** Google Account Config */
// Production Id
// const googleClientId = '959291764323-g8rqgq7uilr22nb7tjs96fr6doa0em42.apps.googleusercontent.com';

//Testing Id
const googleClientId = '700237935126-cpavtlq2rkqfmn9vof4tm89n2cpaispt.apps.googleusercontent.com';

/** Microsoft Account Config */
/**
 * Configuration object to be passed to MSAL instance on creation. 
 * For a full list of MSAL.js configuration parameters, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/configuration.md 
 */
var redirectURI = window.location.origin + '/home/';
const msalConfig = {
    auth: {
        clientId: "a625ac7e-8531-460f-b1cc-032264cdbf15",// 'Application (client) ID' of app registration in Azure portal - this value is a GUID
        authority: "https://login.microsoftonline.com/4d80bca5-ffd0-416d-9d68-210f85db0ed1",// Full directory URL, in the form of https://login.microsoftonline.com/<tenant-id>
        redirectUri: redirectURI,// Full redirect URL, in form of http://localhost:3000
    },
    cache: {
        cacheLocation: "sessionStorage", // This configures where your cache will be stored
        storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
    },
    system: {
        loggerOptions: {
            loggerCallback: (level, message, containsPii) => {
                if (containsPii) { return; }
                switch (level) {
                    case msal.LogLevel.Error: console.error(message); return;
                    case msal.LogLevel.Info: console.info(message); return;
                    case msal.LogLevel.Verbose: console.debug(message); return;
                    case msal.LogLevel.Warning: console.warn(message); return;
                }
            }
        }
    }
};
const msLoginRequest = { scopes: ['openid', 'profile', 'user.read'] };

// Create the main myMSALObj instance
const myMSALObj = new msal.PublicClientApplication(msalConfig);

function selectMSAccount() {
    /**
     * See here for more info on account retrieval: 
     * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-common/docs/Accounts.md
     */
    const currentAccounts = myMSALObj.getAllAccounts();
    if (currentAccounts.length === 0) {
        return;
    } else if (currentAccounts.length > 1) {
        //Add choose account code here
        console.warn("Multiple accounts detected.");
    } else if (currentAccounts.length === 1) {
        //console.log(currentAccounts[0]);
        signIn(currentAccounts[0].username, 'microsoft');
    }
}

function handleResponse(response) {
    /**
     * To see the full list of response object properties, visit:
     * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/request-response-object.md#response
     */
    if (response !== null) {
        //    console.log('reponse is', response.account);
        signIn(response.account.username, 'microsoft')
        sessionStorage.setItem('msUserEmail', JSON.stringify(response.account.username));
        
    }

}

function msSignIn() {

    myMSALObj
        .loginPopup(msLoginRequest)
        .then(handleResponse)
        .catch(error => {

            console.error(
                "Microsoft login failed:",
                error
            );

        })
        .finally(() => {

            console.log(
                "Microsoft login popup closed."
            );

        });

}
function googleSignIn() {

    google.accounts.id.initialize({
        client_id: googleClientId,
        callback: handleGoogleResponse
    });

    const button =
        document.getElementById("googleSignInButton");

    if (!button) {
        console.error(
            "Google Sign-In button not found."
        );
        return;
    }

    // Render Google button
    google.accounts.id.renderButton(
        button,
        {
            type: "standard",
            theme: "outline",
            size: "large",
            text: "signin_with"
        }
    );

    // Wait for Google button to render
    setTimeout(() => {

        const clickableElement =
            button.querySelector(
                '[role="button"]'
            );

        if (clickableElement) {

            console.log(
                "Attempting to click Google button..."
            );

            clickableElement.click();

        } else {

            console.warn(
                "Google button is inside an iframe and cannot be clicked programmatically."
            );

        }

    }, 500);

}

async function handleGoogleResponse(response) {

    try {

        console.log(
            "Google login response received:",
            response
        );

        // Decode Google credential
        const data = JSON.parse(
            atob(
                response.credential.split(".")[1]
            )
        );

        console.log(
            "Google user details:",
            data
        );

        // Get Google user email
        const userEmail = data.email;

        // Store Google email
        sessionStorage.setItem(
            "googleUserEmail",
            userEmail
        );

        // Login through backend
        await signIn(
            userEmail,
            "google"
        );

        // Redirect after successful login
        console.log(
            "Google login completed. Redirecting..."
        );

    } catch (error) {

        console.error(
            "Google login failed:",
            error
        );

    }

}

let usrDetails;

async function signIn(username, type) {

    if (!navigator.onLine) {

        console.warn(
            "User is offline. Cannot perform login."
        );

        return;

    }


    try {

        const response =
            await fetch(
                "/api/auth/login",
                {

                    method: "POST",

                    headers: {

                        "Accept":
                            "application/json",

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify({

                            email:
                                username,

                            provider:
                                type

                        })

                }
            );


        const resp =
            await response.json();


        if (!response.ok) {

            console.error(
                "Login failed:",
                resp.message
            );

            return;

        }


        // Store JWT
        sessionStorage.setItem(
            "accessToken",
            resp.token
        );


        // Store login type
        sessionStorage.setItem(
            "loginType",
            type
        );


        // Store user details
        sessionStorage.setItem(
            "usrDetails",
            JSON.stringify(
                resp.user
            )
        );


        usrDetails =
            resp.user;


        console.log(
            "JWT authentication successful."
        );


        console.log(
            "User:",
            usrDetails
        );


        // Redirect only after JWT is stored
        window.location.href =
            "/home.html";


    } catch (error) {

        console.error(
            "Login error:",
            error
        );

    }

}

function getLoginProvider(email) {

    const domain =
        email
            .split("@")[1]
            ?.toLowerCase();


    if (
        domain &&
        domain.includes("cmcvellore.ac.in")
    ) {

        return "microsoft";

    } else if (domain &&
        domain.includes("edu.in")) {
        return "google";
    }
    else {
        return "external"
    }


}

function closeExternalUserPopup() {

    const modal =
        document.getElementById("externalUserModal");

    if (!modal) {
        return;
    }

    modal.classList.remove("show");

    setTimeout(() => {
        modal.remove();
    }, 300);
}

function sanitizeEmailPrefix(value) {

    return value
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "")
        .replace(/@.*$/, "");
}

async function loginGoogleUser() {

    const input =
        document.getElementById("googleEmailPrefix");

    const error =
        document.getElementById("googleLoginError");

    error.innerText = "";

    // Field now accepts the full email address
    // (same behavior as the Microsoft field).
    const email =
        input.value
            .trim()
            .toLowerCase();

    if (!email) {

        error.innerText =
            "Please enter your CMC student email.";

        input.focus();

        return;
    }

    const emailRegex =
        /^[^\s@]+@[^\s@]+$/;

    if (!emailRegex.test(email)) {

        error.innerText =
            "Please enter a valid email address.";

        input.focus();

        return;
    }

    const domain =
        email.split("@")[1];

    // Allowed student domain(s). Add more here
    // if additional Google domains are supported later.
    const allowedDomains = [
        "cmc.edu.in"
    ];

    if (!allowedDomains.includes(domain)) {

        error.innerText =
            "Please use your CMC student email.";

        input.focus();

        return;
    }

    console.log(
        "Google login email:",
        email
    );

    await checkUserAndLogin(
        email,
        "google"
    );
}

async function loginMicrosoftUser() {

    const input =
        document.getElementById("microsoftEmail");

    const error =
        document.getElementById("microsoftLoginError");

    error.innerText = "";

    const email =
        input.value
            .trim()
            .toLowerCase();

    if (!email) {

        error.innerText =
            "Please enter your CMC Microsoft email.";

        return;
    }

    const emailRegex =
        /^[^\s@]+@[^\s@]+$/;

    if (!emailRegex.test(email)) {

        error.innerText =
            "Please enter a valid email address.";

        return;
    }

    const domain =
        email.split("@")[1];

    const allowedDomains = [
        "cmcvellore.ac.in",
        "cmcvellore.edu.in",
        "cmc.in"
    ];

    if (!allowedDomains.includes(domain)) {

        error.innerText =
            "Please use your CMC Microsoft email.";

        return;
    }

    console.log(
        "Microsoft login email:",
        email
    );

    await checkUserAndLogin(
        email,
        "microsoft"
    );
}

async function checkUserAndLogin(email, provider) {

    try {

        const response =
            await fetch(
                "/api/auth/checkUser",
                {
                    method: "POST",

                    headers: {
                        "Accept":
                            "application/json",

                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        email: email
                    })
                }
            );


        const result =
            await response.json();


        console.log(
            "User check:",
            result
        );


        if (
            !response.ok ||
            !result.registered
        ) {

            const errorId =
                provider === "google"
                    ? "googleLoginError"
                    : "microsoftLoginError";

            document.getElementById(
                errorId
            ).innerText =
                result.message ||
                "Not a registered user.";

            return;
        }


        // Store temporary user details
        sessionStorage.setItem(
            "usrDetails",
            JSON.stringify(result.user)
        );


        // Open identity provider
        if (provider === "microsoft") {

            msSignIn();

        } else if (provider === "google") {

            googleSignIn();

        }

    } catch (error) {

        console.error(
            "User check error:",
            error
        );

        const errorId =
            provider === "google"
                ? "googleLoginError"
                : "microsoftLoginError";

        document.getElementById(
            errorId
        ).innerText =
            "Unable to verify user. Please try again.";
    }
}

// newRegistration() lives in js/public-registration.js