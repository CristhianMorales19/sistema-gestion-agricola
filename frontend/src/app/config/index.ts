if (!process.env.REACT_APP_AUTH0_CLIENT_ID) {
  throw new Error("Missing Auth0 Client ID");
}
if (!process.env.REACT_APP_AUTH0_DOMAIN) {
  throw new Error("Missing Auth0 Domain");
}

export const auth0Config = {
  domain: process.env.REACT_APP_AUTH0_DOMAIN,
  clientId: process.env.REACT_APP_AUTH0_CLIENT_ID,
  audience: process.env.REACT_APP_AUTH0_AUDIENCE,
  redirectUri: `${window.location.origin}/callback`,
  scope: "openid profile email",
};
