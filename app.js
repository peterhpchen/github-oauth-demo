const http = require("http");
const url = require("url");
const https = require("https");
const { env } = require("process");
const { clientId, clientSecret } = env;

const getReqGitHubIdentityUrl = (clientId) =>
  `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=user.email read:user`;

const exchangeCodeForToken = async (clientId, clientSecret, code) =>
  new Promise((resolve) => {
    const req = https.request(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      },
      (res) => {
        const body = [];
        res.on("data", (chunk) => {
          body.push(chunk);
        });
        res.on("end", () => {
          const { access_token } = JSON.parse(Buffer.concat(body).toString());
          resolve(access_token);
        });
      }
    );
    req.write(
      JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
      })
    );
    req.end();
  });

const useTokenAccessAPI = async (access_token) =>
  new Promise((resolve) => {
    const req = https.get(
      "https://api.github.com/user",
      {
        headers: {
          // https://docs.github.com/en/rest/overview/resources-in-the-rest-api#current-version
          Accept: "application/vnd.github.v3+json",
          // https://docs.github.com/en/rest/overview/resources-in-the-rest-api#authentication
          Authorization: `token ${access_token}`,
          // https://docs.github.com/en/rest/overview/resources-in-the-rest-api#user-agent-required
          // https://stackoverflow.com/a/21384582/9265131
          "User-Agent": "github-oauth-demo",
        },
      },
      (res) => {
        const body = [];

        res.on("data", (chunk) => {
          body.push(chunk);
        });
        res.on("end", () => {
          const { name } = JSON.parse(Buffer.concat(body).toString());
          resolve(name);
        });
      }
    );
    req.end();
  });

const useTokenAccessGQL = async (access_token) =>
  new Promise((resolve) => {
    const req = https.request(
      "https://api.github.com/graphql",
      {
        method: "POST",
        "Content-Type": "application/json",
        headers: {
          // https://docs.github.com/en/rest/overview/resources-in-the-rest-api#authentication
          Authorization: `token ${access_token}`,
          // https://docs.github.com/en/rest/overview/resources-in-the-rest-api#user-agent-required
          // https://stackoverflow.com/a/21384582/9265131
          "User-Agent": "github-oauth-demo",
        },
      },
      (res) => {
        const body = [];

        res.on("data", (chunk) => {
          body.push(chunk);
        });
        res.on("end", () => {
          const { data } = JSON.parse(Buffer.concat(body).toString());
          resolve(data.viewer.email);
        });
      }
    );
    req.write(
      JSON.stringify({
        query: "query { viewer { email }}",
        variables: {},
      })
    );
    req.end();
  });

http
  .createServer(async (req, res) => {
    const { code } = url.parse(req.url, true).query;
    res.writeHead(200, { "Content-Type": "text/html" });

    if (!code) {
      const href = getReqGitHubIdentityUrl(clientId);
      res.end(`<html><body><a href="${href}">login</a></body></html>`);
    } else {
      const access_token = await exchangeCodeForToken(
        clientId,
        clientSecret,
        code
      );
      const name = await useTokenAccessAPI(access_token);
      const email = await useTokenAccessGQL(access_token);
      res.end(
        `<html><body>Hello, ${name}!<br>Your email is ${email}.</body></html>`
      );
    }
  })
  .listen(3000);
