/**
 * Page guard for protected pages.
 *
 * Include on any page that requires login:
 *   <script src="guard.js"></script>
 *
 * To additionally restrict a page to specific roles, add a
 * data-roles attribute (comma separated, matches userType):
 *   <script src="guard.js" data-roles="staff,faculty,admin"></script>
 *
 * On success, sets window.currentUser to the stored user object.
 * Also exposes logout() for a Logout button to call.
 */
(function () {

    const token = sessionStorage.getItem("accessToken");
    const usrDetailsRaw = sessionStorage.getItem("usrDetails");

    if (!token || !usrDetailsRaw) {

        window.location.href = "/login";

        return;

    }

    let user;

    try {

        user = JSON.parse(usrDetailsRaw);

    } catch (error) {

        sessionStorage.clear();

        window.location.href = "/login";

        return;

    }

    const scriptTag = document.currentScript;

    const rolesAttr = scriptTag && scriptTag.dataset.roles;

    if (rolesAttr) {

        const allowedRoles = rolesAttr
            .split(",")
            .map(role => role.trim().toLowerCase())
            .filter(Boolean);

        const userRole = (user.userType || "").toLowerCase();

        if (allowedRoles.length && !allowedRoles.includes(userRole)) {

            window.location.href = "/login";

            return;

        }

    }

    window.currentUser = user;

})();

async function logout() {

    const token = sessionStorage.getItem("accessToken");

    try {

        if (token) {

            await fetch("/api/auth/logout", {

                method: "POST",

                headers: {
                    "Authorization": `Bearer ${token}`
                }

            });

        }

    } catch (error) {

        console.error("Logout error:", error);

    } finally {

        sessionStorage.clear();

        window.location.href = "/login";

    }

}
