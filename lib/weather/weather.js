let logWeather = (log) => {
  let time = new Date(log.time*1000);
  let h = (time.getMinutes() < 10) ? `0${time.getHours()}` : time.getHours();
  let m = (time.getMinutes() < 10) ? `0${time.getMinutes()}` : time.getMinutes();
  let shift = h <= 12 ? 'AM' : 'PM';
  time = `${h}:${m}${shift}`

  console.log(`Right now at ${time}, the weather looks ${log.summary}. It's currently ${log.temperature} and feels like ${log.apparentTemperature}.`);
  console.log(`\nSee the forecast for this week:\n${log.daily}`);
};

module.exports = { logWeather };
