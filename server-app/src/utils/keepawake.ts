import cron from 'node-cron';
import axios from 'axios';

const url: string = process.env.BASE || ''; // replace with your server's URL

const keepAliveJob = () => {
  const job = cron.schedule('*/5 * * * *', () => {
    // Runs every 5 minutes
    const date = new Date();
    const time = date.toLocaleTimeString();
    axios
      .get(url)
      .then((response) => {
        console.log("Server is up and running, time:", time);
      })
      .catch((error) => {
        console.error("Error keeping server alive:", error.message);
      });
  });

  // Start the job immediately
  job.start();
};

export default keepAliveJob;
