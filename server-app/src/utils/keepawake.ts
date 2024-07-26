import Cron from "croner";
import axios from "axios";

const url: string = process.env.BASE || ''; // replace with your server's URL

const keepAliveJob = () => {
  const date = new Date();
  const time = date.toLocaleTimeString();
  const job = Cron("*/5 * * * *", () => {
    // Runs every 5 minutes
    axios
      .get(url)
      .then((response) => {
        console.log("Server is up and running, time:", time);
      })
      .catch((error) => {
        console.error("Error keeping server alive:", error.message);
      });
  });
};
export default keepAliveJob;