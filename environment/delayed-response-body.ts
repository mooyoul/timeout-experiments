import * as http from "http";
import { AddressInfo } from "net";

const DEFAULT_DELAY_MS = 1000; // 1 sec

const DELAY_MS = parseInt(process.env.DELAY_MS!, 10) || DEFAULT_DELAY_MS;

const server = http.createServer((req, res) => {
  const chunks = "Delayed Response Body".split("");

  const headers: http.OutgoingHttpHeaders = {
    "Content-Length": chunks.length.toString(),
    "Content-Type": "text/plain",
  };

  if (req.headers.origin) {
    headers["Access-Control-Allow-Origin"] = req.headers.origin;
  }

  res.writeHead(200, headers);

  send();

  function send() {
    const chunk = chunks.shift();

    if (chunk) {
      res.write(Buffer.from(chunk, "utf8"), (e) => {
        if (e) {
          console.error(e.stack);
          return;
        }

        setTimeout(send, DELAY_MS);
      });
    } else {
      res.end((e: Error) => {
        if (e) {
          console.error(e.stack);
          return;
        }
      });
    }
  }
});

server.listen(8002, () => {
  const { address, port } = server.address() as AddressInfo;

  console.log("listening in %s:%s", address, port);
});
