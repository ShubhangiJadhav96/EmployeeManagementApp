// common.js
var SUCCESS = "success";
var ERROR = "error";
var WARNING = "warning";

function showMessageDialog(message, type) {
    var title = "Notice";
    if (type === SUCCESS) title = "Success";
    else if (type === ERROR) title = "Error";
    else if (type === WARNING) title = "Warning";

    bootbox.alert({
        title: title,
        message: message
    });
}

// ------------------------------------------------------------------
// Decode a JWT and return its payload as a plain object.
// JWTs are 3 Base64Url parts separated by dots: header.payload.signature
// We only need the payload (the middle part) to read claims like Role.
// ------------------------------------------------------------------
function decodeJwt(token) {
    try {
        var payloadBase64 = token.split(".")[1];
        var decoded = atob(payloadBase64.replace(/-/g, "+").replace(/_/g, "/"));
        return JSON.parse(decoded);
    } catch (e) {
        return null;
    }
}

// ------------------------------------------------------------------
// Reads the role claim out of the current sessionStorage token.
// Returns null if no token exists or it can't be decoded.
// ------------------------------------------------------------------
function getCurrentUserRole() {
    var token = sessionStorage.getItem("authToken");
    if (!token) return null;

    var payload = decodeJwt(token);
    if (!payload) return null;

    // ASP.NET Core JWTs store the role under this long claim URI
    return payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]
        || payload["role"]
        || null;
}