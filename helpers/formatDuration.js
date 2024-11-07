function formatDurationToHours(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secondsRemaining = seconds % 60;

  return `${hours}h ${minutes}m ${secondsRemaining}s`;
}

module.exports = { formatDurationToHours };
