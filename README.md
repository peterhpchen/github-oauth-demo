# github-oauth-demo

This is the demo for login app by GitHub's OAuth.

## Features

- Only use **Node.js standard modules**.
- Use **environment variables** to save properties.
- `async` functions.

## Requirement

- Installing Node.js.
- [Create a GitHub OAuth App](https://docs.github.com/en/developers/apps/building-oauth-apps/creating-an-oauth-app).
  - **Homepage URL** and **Authorization callback URL** set `http://localhost:3000`.

## Usage

1. Rename `app-env.sample` to `app-env`.
2. Fill `clientId` and `clientSecret`.
3. Execute `soure app-env` to set environment variables.
4. Execute `node app.js` to start server.
5. Open `http://localhost:3000` in browser.

## Demo

1. Click `login` link.
2. Signing GitHub and authorizing access right.
3. Redirect back to demo site(`http://localhost:3000`).
4. (Inside)Exchange code for access token.
5. (Inside)Use token to access GitHub API for user info.
6. Show the `Hello, {User Name}!` on page.

## References

* [GitHub Docs: Authorizing OAuth Apps](https://docs.github.com/en/developers/apps/building-oauth-apps/authorizing-oauth-apps)
* [GitHub Docs: Basics of authentication](https://docs.github.com/en/rest/guides/basics-of-authentication)
* [Soham Kamani: Implementing OAuth 2.0 with Node.js](https://www.sohamkamani.com/nodejs/oauth/)
* [Hackernoon: how to use Environment Variables keep your secret keys safe & secure!](https://medium.com/hackernoon/how-to-use-environment-variables-keep-your-secret-keys-safe-secure-8b1a7877d69c)