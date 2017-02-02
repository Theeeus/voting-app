var poll = this.poll_client;

var optArr = [];
var votesArr = [];
for (var i=0;i<poll.options.length;i++) {
  if (poll.options[i].votes > 0) {
  optArr.push(poll.options[i].option);
  votesArr.push(poll.options[i].votes);
  }
};

var ctx = document.getElementById('myChart').getContext('2d');

var data = {
    labels: optArr,
    datasets: [
        {
            data: votesArr,
            backgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
				"#2E8B57",
                "#8b2e34",
                "#340034",
                "#654321",
                "#696969",
                "#ffa500",
                "#FF0000"
            ],
            hoverBackgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
				"#2E8B57",
                "#8b2e34",
                "#340034",
                "#654321",
                "#696969",
                "#ffa500",
                "#FF0000"
            ]
        }]
};

var options = {
	legend: {
		position: 'bottom',
		labels: {
			boxWidth: 10,
			fontSize: 14
		}
	},
	responsive: false,
	maintainAspectRatio: true

};

var myDoughnutChart = new Chart(ctx, {
    type: 'doughnut',
    data: data,
	options: options
}); 