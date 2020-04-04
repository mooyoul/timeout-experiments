import * as dgram from "dgram";

const DEFAULT_DELAY_MS = 1000; // 1 sec
const DEFAULT_UPSTREAM_DNS_SERVER = "1.1.1.1";

const DELAY_MS = parseInt(process.env.DELAY_MS!, 10) || DEFAULT_DELAY_MS;
const UPSTREAM_DNS_SERVER = process.env.UPSTREAM_DNS_SERVER || DEFAULT_UPSTREAM_DNS_SERVER;

const server = dgram.createSocket("udp4");

server.on("error", (e) => {
  console.error(e.stack);
});

server.on("message", (buf, rinfo) => {
  setTimeout(proxy, DELAY_MS);

  function proxy() {
    const upstream = dgram
      .createSocket("udp4");

    const onMessage = (reply: Buffer) => {
      server.send(reply, rinfo.port, rinfo.address, () => {
        upstream.close();
      });
    };
    const onError = (e: Error) => {
      console.error(e.stack);
      upstream.close();
    };

    upstream
      .on("message", onMessage)
      .on("error", onError)
      .send(buf, 53, UPSTREAM_DNS_SERVER);
  }
});

server.bind(53, () => {
  const { address, port } = server.address();
  console.log("bound to %s:%s", address, port);
});
