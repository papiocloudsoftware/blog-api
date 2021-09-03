import { App } from "../lib/app";

const port = 8080;

process.env.DOMAIN_NAME = "http://localhost:8080";
process.env.BLOG_TABLE = "BlogTable";
process.env.SUBSCRIBERS_TABLE = "BlogTableSubscriptions";

// Create the app
const app = App.createApp();

// Start the app
app.listen(port, () => {
  console.log(`customer-registration app listening at http://localhost:${port}`);
});
