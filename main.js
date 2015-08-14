var CSGO_RANKS = [
  'Unranked',
  'Silver I',
  'Silver II',
  'Silver III',
  'Silver IV',
  'Silver Elite',
  'Silver Elite Master',
  'Gold Nova I',
  'Gold Nova II',
  'Gold Nova III',
  'Gold Nova Master',
  'Master Guardian I',
  'Master Guardian II',
  'Master Guardian Elite',
  'Distinguished Master Guardian',
  'Legendary Eagle',
  'Legendary Eagle Master',
  'Supreme Master First class',
  'Global Elite'
]

$(document).ready(function(){
  var fileName = 'responses.csv';
  $.get(fileName, function(data){
    
  var responses = [];
  var lines = data.split('\r\n');
  for (line in lines){
    var values = lines[line].split(',');
    date = new Date(values[0]);
    rank = values[1];
    smurf = values[5];
    responses.push({'date': date, 'rank': rank, 'smurf': smurf});
  }

  //  Calculate!

  // Algorithm bad, but this makes it easy to understand the code.  O(n^2) could be O(n).
  var series = {
    name: 'data',
    data: []
  }
  var numberOfPlayers;
  var numberOfSmurfs;
  for (rank in CSGO_RANKS){
    numberOfPlayers = 0;
    numberOfSmurfs = 0;
    for (response in responses){
      if (responses[response]['rank'] == CSGO_RANKS[rank]){
        numberOfPlayers += 1;
        if (responses[response]['smurf'] == 'Yes' || responses[response]['smurf'] == 'Multiple Smurfs'){
          numberOfSmurfs += 1;
        }
      }
    }
    
    if (numberOfPlayers == 0){
      var smurfProb = 0;
    } else {
      var smurfProb = parseFloat(numberOfSmurfs/numberOfPlayers);
    }
    series.data.push([rank, smurfProb]);
  }

  console.log(series);

  //////

  var options = {
    chart: {
      renderTo: 'chart',
      type: 'spline',
    },
    title: {
      text: "Probability of a Player Having a Smurf, By Rank"
    },
    credits: {
      enabled: false
    },
    yAxis: {
      title: {
        text: 'Data'
      },
      min: 0,
      max: 1
    },
    xAxis: {
      tickInterval: 1,
      labels: { y: 30, rotation: 30, align: 'right' }
    },
    series: []
  };

  options.series.push(series);
  var chart = new Highcharts.Chart(options);

}, 'text');});