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
    // event.preventDefault();
    /**
     * You can pass a custom request object below. This will override the initial configuration. For more information, visit:
     * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/request-response-object.md#request
     */
    myMSALObj.loginPopup(msLoginRequest).then(handleResponse).catch(error => { console.error(error); });
}


function googleSignIn() {
    google.accounts.id.initialize({ client_id: googleClientId, callback: handleGoogleResponse });
    google.accounts.id.renderButton(document.getElementById("googleSignInButton"), { text: 'signin', size: "large", theme: "filled_white" });
    google.accounts.id.renderButton(document.getElementById("googleSignInButtonmb"), { text: 'signin', size: "large", theme: "outline" });
    google.accounts.id.renderButton(document.getElementById("googleSignInButtonhp"), { text: 'signin', size: "large", theme: "outline" });
    google.accounts.id.prompt();
};


function handleGoogleResponse(response) {
    const data = JSON.parse(atob(response.credential.split(".")[1]));
    console.log('google data is', data);
    userEmail = data.email;

    // Store email in sessionStorage to persist login across refresh
    sessionStorage.setItem('googleUserEmail', userEmail);

    signIn(userEmail, 'google');
}


function msAndGoogleSignOut(event) {
    console.log("loginType", event.currentTarget.getAttribute('id'));
    var userData = event.currentTarget.getAttribute('id').split(':');

    if (userData[1] === "microsoft") {
        sessionStorage.clear();
        myMSALObj.logoutPopup({
            account: myMSALObj.getAccountByUsername(userData[0]),
            postLogoutRedirectUri: window.location.origin,
            mainWindowRedirectUri: window.location.origin,
        });
    } else if (userData[1] === "google") {
        sessionStorage.clear(); // Clear local storage to remove user data

        const signoutWindow = window.open(
            "https://www.google.com/accounts/Logout",
            "Google Sign out",
            "scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=600,height=500,left=100,top=100"
        );

        setTimeout(() => {
            window.location.href = window.location.origin;
            signoutWindow.close();
        }, 2000);
    }

    loadHeaderContent(context = { preLogin: true });
    navigateTo('home');
    googleSignIn();
    document.getElementById('content').classList.replace('postLog', 'preLog');
}

window.addEventListener('popstate', function (event) {
    if (event.state && event.state.page) {
        const { page, context, callbacks } = event.state;
        loadPage(page, context, callbacks, false); // No history push on popstate
    }
});

function navigateTo(pageName, context = {}, callbacks = []) {
    sessionStorage.setItem('lastPage', pageName);
    sessionStorage.setItem('lastContext', JSON.stringify(context));
    sessionStorage.setItem('lastCallbacks', JSON.stringify(callbacks));
    //console.log('Navigating to:', pageName, context, callbacks);
    loadPage(pageName, context, callbacks);
}


window.addEventListener('load', function () {
    const defaultPage = 'home';
    const savedGoogleEmail = sessionStorage.getItem('googleUserEmail');
    const savedMSAccount = sessionStorage.getItem('msUserEmail');

    if (savedGoogleEmail || savedMSAccount) {

        const lastPage = sessionStorage.getItem('lastPage') || defaultPage;
        const lastContext = JSON.parse(sessionStorage.getItem('lastContext') || '{}');
        const lastCallbacks = JSON.parse(sessionStorage.getItem('lastCallbacks') || '[]');
        const headerContent = JSON.parse(sessionStorage.getItem('headerContent')) || {};
        document.getElementById('content').classList.replace('preLog', 'postLog');

        //console.log('Restoring:', lastPage, lastContext, lastCallbacks);
        //console.log('Restoring header content:', headerContent);
        loadHeaderContent(headerContent); // Load header content from sessionStorage
        loadPage(lastPage, lastContext, lastCallbacks, false); // false = don't push to history again
    }
});

