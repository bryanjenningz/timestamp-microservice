const express = require("express");
const app = express();
const { resolve } = require("path");

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

const capitalize = word =>
  (word[0] || "").toUpperCase() + word.slice(1).toLowerCase();

const dateToNatural = date =>
  `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getYear() + 1900}`;

const errorResponse = res => res.json({ unix: null, natural: null });

const successfulResponse = (res, date) =>
  res.json({
    unix: date.getTime() / 1000,
    natural: dateToNatural(date)
  });

app.get("/", (req, res) => res.sendFile(resolve("./index.html")));

app.get("/:time", (req, res) => {
  const time = decodeURIComponent(req.params.time).trim();

  if (/^\d+$/.test(time)) {
    return successfulResponse(res, new Date(Number(time) * 1000));
  }

  try {
    const [, monthName, day, year] = time.match(/^([a-zA-Z]+) (\d+), (\d+)$/);

    if (!monthNames.includes(capitalize(monthName))) {
      return errorResponse(res);
    }

    return successfulResponse(
      res,
      new Date(
        Number(year),
        monthNames.indexOf(capitalize(monthName)),
        Number(day)
      )
    );
  } catch (err) {
    return errorResponse(res);
  }
});

const listener = app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${listener.address().port}`);
});
