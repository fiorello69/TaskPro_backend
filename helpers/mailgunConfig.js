import FormData from "form-data";
import Mailgun from "mailgun.js";
import "dotenv/config";

const { MAILGUN_API_KEY, MAILGUN_API_URL } = process.env;

const mailgun = new Mailgun(FormData);
const mg = mailgun.client({
  username: "api",
  key: MAILGUN_API_KEY,
  url: MAILGUN_API_URL || "https://api.mailgun.net",
});

export default mg;
