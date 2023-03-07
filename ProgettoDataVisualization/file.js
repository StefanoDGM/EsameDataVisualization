google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);

function drawChart() {
    var data = google.visualization.arrayToDataTable([
      ['Categoria', 'Valore1', 'Valore2'],
      ['Categoria 1', 100, 200],
      ['Categoria 2', 150, 250],
      ['Categoria 3', 200, 300],
      ['Categoria 4', 250, 350],
      ['Categoria 5', 300, 400]
    ]);
  
    var options = {
      title: 'Grafico a doppio asse con barre',
      series: {
        0: {axis: 'Valore1'},
        1: {axis: 'Valore2'}
      },
      vAxes: {
        // Definisci l'asse per la prima coppia di barre
        'Valore1': {title: 'Valore1'},
        // Definisci l'asse per la seconda coppia di barre
        'Valore2': {title: 'Valore2'}
      },
      // Aggiungi un terzo asse per il pallino colorato
      seriesType: 'scatter',
      series: {
        2: {
          type: 'line',
          visibleInLegend: false,
          enableInteractivity: false,
          pointSize: 10,
          pointShape: {type: 'circle', sides: 20},
          pointColor: 'red'
        }
      }
    };
  
    var chart = new google.visualization.ComboChart(document.getElementById('chart_div'));
    chart.draw(data, options);
  }
  
  
  





