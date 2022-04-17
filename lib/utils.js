const cron = require('node-cron');

const scheduleCronJob = (expression, cb) => {
  cron.schedule(expression, cb, {
    scheduled: true,
    timezone: 'America/New_York',
  });
};

const sendMessageInAllChannels = (client, message) => {
  const channels = client.channels.cache.filter(
    (c) => c.guild && c.type === 'text'
  );

  channels.forEach(async (c) => {
    const permissions = await c.permissionsFor(client.user);
    const hasPermissions = permissions.has(
      ['SEND_MESSAGES', 'VIEW_CHANNEL'],
      true
    );

    if (hasPermissions) c.send(message);
  });
};

module.exports = { scheduleCronJob, sendMessageInAllChannels };
