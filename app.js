const http = require("http");
const url = require("url");
const https = require("https");
const { env} = require('process')
const { clientId, clientSecret } = env

const server = http.createServer((req, res) => {
  const { code } = url.parse(req.url, true).query;
  res.writeHead(200, { "Content-Type": "text/html" });

  if (!code) {
    res.end(
      `<html><body><a href="https://github.com/login/oauth/authorize?client_id=${clientId}">login</a></body></html>`
    );
  } else {
    const tokenReq = https.request(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      },
      (tokenRes) => {
        const tokenBody = [];
        tokenRes.on("data", (chunk) => {
          tokenBody.push(chunk);
        });
        tokenRes.on("end", () => {
          const { access_token } = JSON.parse(
            Buffer.concat(tokenBody).toString()
          );
          console.log(access_token);

          const userReq = https.get(
            "https://api.github.com/user",
            {
              headers: {
                Accept: "application/vnd.github.v3+json",
                Authorization: `token ${access_token}`,
                "User-Agent": "peter-test",
              },
            },
            (userRes) => {
              const userBody = [];

              userRes.on("data", (chunk) => {
                userBody.push(chunk);
              });
              userRes.on("end", () => {
                // const userData = JSON.parse(Buffer.concat(userBody).toString());
                const { name } = JSON.parse(Buffer.concat(userBody).toString());
                console.log(name);

                res.end(`<html><body>Hello, ${name}!</body></html>`);
              });
            }
          );
          console.log(userReq.getHeader("Authorization"));
          userReq.end();
        });
      }
    );
    tokenReq.write(
      JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
      })
    );
    tokenReq.end();
  }
});

server.listen(3000);
