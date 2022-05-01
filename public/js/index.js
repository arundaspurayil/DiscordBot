function getUTCDate(dateString) {
  const date = new Date(dateString);
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}

document.addEventListener('DOMContentLoaded', async () => {
  const response = await fetch('/api/messages');
  const totalMessages = await response.json();
  const startDate = getUTCDate(totalMessages[0].createdAt);

  const data = Array(7).fill(0);
  const indices = {};
  let currentIndex = 0;

  totalMessages.forEach((message) => {
    const utcDate = getUTCDate(message.createdAt);

    if (!indices.hasOwnProperty(utcDate)) {
      indices[utcDate] = currentIndex;
      currentIndex += 1;
    }

    const indexToPlace = indices[utcDate];
    data[indexToPlace] += 1;
  });

  const style = {
    style: {
      color: '#FFFFFF',
    },
  };

  Highcharts.chart('total-messages-per-day-container', {
    chart: {
      backgroundColor: '#202328',
    },
    title: {
      text: 'Total Messages per Day',
      ...style,
    },
    yAxis: {
      title: {
        text: 'Number of Messages',
      },
      labels: {
        step: 1,
        ...style,
      },
    },
    xAxis: {
      type: 'datetime',
      dateTimeLabelFormats: {
        day: '%d %b',
      },
      labels: {
        ...style,
      },
    },
    plotOptions: {
      series: {
        pointStart: startDate,
        pointInterval: 24 * 3600 * 1000, // one day
      },
    },
    series: [
      {
        name: 'Messages',
        data: data,
      },
    ],
    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 500,
          },
        },
      ],
    },
  });
});
