# ip

See your public IP address and country.

**License:** [MIT](LICENSE)

Live: [https://ip.dmosk.net/](https://ip.dmosk.net/)

## curl

When the `User-Agent` contains `curl/`, the response is plain text with just the IP:

```bash
curl http://ip.dmosk.net/
curl https://ip.dmosk.net/
```

For curl, HTTP on port 80 has no redirect to HTTPS. Browsers still redirect to HTTPS.

## Stack

Vite + TypeScript, Node API `GET /api/me`, nginx. Country comes from Traefik GeoIP (`X-GeoIP2-Country`, DB-IP Lite).

## Local

```bash
npm install
npm run dev
```

Build: `npm run build`.
