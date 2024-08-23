import schedule from "node-schedule";
import needle from "needle";

/// Boilerplate cron values. You can check out more combinations at
// https://crontab.cronhub.io/
const everyHourCron = '0 * * * *'
const everyMinuteCron = '0 * * * * *'
const every5SecondsCron = '*/5 * * * * *'
const port = process.env.PORT;

const options = {
  headers: { Authorization: `Bearer ${process.env.DB_CREATE_AUTHORIZATION}` },
};

// Background schedule that creates users(Autobots) every hour.
// You can replace everyHourCron with any of the Boilerplate cron values
// above to modify the duration of the cron job. This will only run when the server
// has been started and running on the set PORT
const job = schedule.scheduleJob(everyHourCron, async function () {
  await needle("post", `http://localhost:${port}/api/v1/users/create`, {}, options);
});

export default job;
