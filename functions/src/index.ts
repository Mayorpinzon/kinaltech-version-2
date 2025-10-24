import * as functions from "firebase-functions";
import cors from "cors";

const allow = cors({ origin: true }); 

// Ping de salud: GET /api/health
export const health = functions.https.onRequest((req, res) => {
  allow(req, res, () => res.status(200).json({ ok: true, service: "functions", env: "emulator" }));
});

// Endpoint del formulario: POST /api/contact
export const contact = functions.https.onRequest((req, res) => {
  allow(req, res, () => {
    if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

    // payload mínimo solo para probar la canalización
    const { name, email, subject, message } = req.body || {};
    if (!name || !email || !message) {
      return res.status(400).json({ ok: false, error: "missing_fields" });
    }

    // aquí luego irán validación fuerte, rate limit, captcha, envío de email, etc.
    return res.status(200).json({ ok: true, received: { name, email, subject, len: String(message).length } });
  });
});
