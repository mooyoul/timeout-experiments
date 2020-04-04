import * as http from "http";
import { AddressInfo } from "net";

const DEFAULT_DELAY_MS = 1000; // 1 sec

const DELAY_MS = parseInt(process.env.DELAY_MS!, 10) || DEFAULT_DELAY_MS;

const server = http.createServer((req, res) => {
  setTimeout(reply, DELAY_MS);

  function reply() {
    const buf = Buffer.from("Delayed Response Header", "utf8");

    const headers: http.OutgoingHttpHeaders = {
      "Content-Length": buf.length.toString(),
      "Content-Type": "text/plain",
    };

    if (req.headers.origin) {
      headers["Access-Control-Allow-Origin"] = req.headers.origin;
    }

    res.writeHead(200, headers);
    res.end(buf);
  }
});

server.listen(8001, () => {
  const { address, port } = server.address() as AddressInfo;

  console.log("listening in %s:%s", address, port);
});
