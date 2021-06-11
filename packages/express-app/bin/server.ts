import { App } from "../lib/app";

const port = 8080;

// Create the app
const app = App.createApp();

// Start the app
app.listen(port, () => {
  console.log(`customer-registration app listening at http://localhost:${port}`);
});
