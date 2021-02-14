// Uses google charts api to deisplay a pie chart which will later on implement the data from our database
google.charts.load("current", {
  packages: ["corechart"]
});
google.charts.setOnLoadCallback(drawChart);

function drawChart() {
  var data = google.visualization.arrayToDataTable([
    ['Genre', 'Amount'],
    ['Comedy', 12],
    ['Action', 9],
    ['Documentary', 12],
    ['Sci-Fi', 22],
    ['Adventure', 8],
    ['Drama', 9],
    ['Romance', 5],
    ['Animation', 15],
    ['Thriller', 9],
    ['Horror', 8]
  ]);

  // able to alter the looks of the pie chart
  var options = {
    title: 'GENRES WATCHED',
    legend: {
      position: 'right'
    },
    backgroundColor: '#cdc6df',
  };

  //draws the chart in the designated div which is called chart_div
  var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
  chart.draw(data, options);
}
