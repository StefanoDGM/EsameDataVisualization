// definisce un padding per il grafico
const padding = 80

// seleziona l'elemento SVG con id 'chart' tramite d3
const svg = d3.select('#chart')
//const otherSvg = d3.select('#otherChart')
const svgDOM = document.getElementById('bar')
// definisce i colori per il grafico
const textColor = '#194d30'

// seleziona l'elemento SVG dalla pagina web con id 'chart'
//const svgDOM = document.querySelector('#chart')
//const otherSvgDOM = document.querySelector('#otherChart')

// ottiene le dimensioni dell'elemento SVG
let svgWidth = svgDOM.getAttribute('width') 
let svgHeight = svgDOM.getAttribute('height')

//let otherSvgWidth = otherSvgDOM.getAttribute('width') 
//let otherSvgHeight = otherSvgDOM.getAttribute('height')

// definisce un padding per il grafico
const vizPadding = 150
//const animalList = ['beef', 'lamb', 'pork', 'poultry', 'milk', 'cheese', 'eggs', 'fish']
//const plantList = ['apples', 'bananas', 'barley', 'beans', 'cassava', 'cocoa', 'coconut oil', 'coffee', 'groundnuts', 'maize', 'olive oil', 'onions', 'oranges', 'peanuts', 'peas', 'potatoes', 'rice', 'soybeans', 'sugar beet', 'sugar cane', 'sunflower oil', 'tomatoes', 'wheat']
const data = d3.csvParse(dataset, d => {
	return {
	  food: d.food,
	  landUse: +d['Land use change'],
	  animalFeed: +d['Animal Feed'],
	  farm: +d['Farm'],
	  processing: +d['Processing'],
	  transport: +d['Transport'],
	  packaging: +d['Packaging'],
	  retail: +d['Retail'],
	  
	}

})
const animalCO2Total = {
  landUse: 0,
  animalFeed: 0,
  farm: 0,
  processing: 0,
  transport: 0,
  packaging: 0,
  retail: 0
}

const plantCO2Total = {
  landUse: 0,
  animalFeed: 0,
  farm: 0,
  processing: 0,
  transport: 0,
  packaging: 0,
  retail: 0
}

const animalList = ['beef', 'lamb', 'pork', 'poultry', 'milk', 'cheese', 'eggs', 'fish'];
const plantList = ['apples', 'bananas', 'barley', 'beans', 'cassava', 'cocoa', 'coconut oil', 'coffee', 'groundnuts', 'maize', 'olive oil', 'onions', 'oranges', 'peanuts', 'peas', 'potatoes', 'rice', 'soybeans', 'sugar beet', 'sugar cane', 'sunflower oil', 'tomatoes', 'wheat'];

let animalCO2 = 0;
let plantCO2 = 0;

// somma i valori delle colonne per gli elementi della lista animale
animalList.forEach(animal => {
  const filtered = data.filter(item => item.food === animal);
  filtered.forEach(item => {
    animalCO2 += item['Land use change'] + item['Animal Feed'] + item['Farm'] + item['Processing'] + item['Transport'] + item['Packaging'] + item['Retail'];
  });
});

// somma i valori delle colonne per gli elementi della lista vegetale
plantList.forEach(plant => {
  const filtered = data.filter(item => item.food === plant);
  filtered.forEach(item => {
    plantCO2 += item['Land use change'] + item['Animal Feed'] + item['Farm'] + item['Processing'] + item['Transport'] + item['Packaging'] + item['Retail'];
  });
});

console.log('CO2 totale per gli animali:', animalCO2);
console.log('CO2 totale per le piante:', plantCO2);







//raggruppamento dei dati per paese e filtraggio dei dati con morti maggiori di 0
country_group = d3.rollups(data, v => {
	return {
	"Retail" : d3.sum(v, d => d.Retail),
    "Processing": d3.sum(v, d => d.Processing)}
	},  d => d.Retail);

const data_group = d3.filter(country_group, function(d) { return d[1].deaths > 0 })

//casi massimi e morti massime
const maxCases = d3.max(data_group, d => d[1].Retail);
const maxDeaths = d3.max(data_group, d => d[1].Processing);

//dominio e codominio
const xDomain = d3.extent(data_group, d => d[1].Retail);
const yDomain = d3.extent(data_group, d => d[1].Processing);

// definisce la scala per l'asse x utilizzando d3.scaleLog
const xScale = 	d3.scaleLog()
	.domain(xDomain) // the number of records in the dataset (the bars)
	.range([vizPadding, svgWidth-vizPadding]) // the output range (the size of the svg except the padding)

// definisce la scala per l'asse y utilizzando d3.scaleLog
const yScale = d3.scaleLog()
	.domain(yDomain) // the dataset values' range (from 0 to its max)
	.range([svgHeight - vizPadding, vizPadding]) 	

// etichetta generale asse y
svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", vizPadding / 4)
        .attr("x",- (svgHeight / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Deaths");

// etichetta generale asse x
svg.append("text")
		.attr("x", svgWidth / 2 )
        .attr("y",  svgHeight - vizPadding/2)
        .style("text-anchor", "middle")
        .text("Positive cases");


// titolo del grafico
svg.append("text")
		.attr("x", svgWidth / 2 )
        .attr("y", vizPadding/2)
        .style("text-anchor", "middle")
        .text("case/death ratio");


// assegnazione del colore ai ticks
svg
	.selectAll('.tick line')
	.style('stroke-width', 0)
	//.style('stroke', '#D3D3D3')


// create the x-axis group
const xAxisGroup = svg.append('g')
  .attr('transform', `translate(0, ${svgHeight - vizPadding})`)
  .call(d3.axisBottom(xScale)
  .ticks(Math.E * 1.5)
  .tickSize(-5)
  .tickFormat(function(d){return parseInt(d);})
  )

  xAxisGroup
  .append('line')
  .attr('x1', xScale.range()[0])
  .attr('y1', 0)
  .attr('x2', xScale.range()[1])
  .attr('y2', 0)
  .attr('stroke', 'black')
  .attr('stroke-width', 2)
  .attr('marker-end','url(#arrow)')

xAxisGroup
  .append("defs")
  .append("marker")
  .attr("id", "arrow")
  .attr("viewBox", "0 -5 10 10")
  .attr("refX", 5)
  .attr("refY", 0)
  .attr("markerWidth", 4)
  .attr("markerHeight", 4)
  .attr("orient", "auto")
  .append("path")
  .attr("d", "M0,-5L10,0L0,5")
  .style("fill", "black");

// create the y-axis group
const yAxisGroup = svg.append('g')
  .attr('transform', `translate(${vizPadding}, 0)`)
  .call(d3.axisLeft(yScale)
  .ticks(Math.E * 1.5)
  .tickSize(-5)
  .tickFormat(function(d){return parseInt(d);})
  )

  yAxisGroup
  .append('line')
  .attr('x1', 0)
  .attr('y1', yScale.range()[0])
  .attr('x2', 0)
  .attr('y2', yScale.range()[1])
  .attr('stroke', 'black')
  .attr('stroke-width', 2)
  .attr('marker-end','url(#arrow)')

yAxisGroup
  .append("defs")
  .append("marker")
  .attr("id", "arrow")
  .attr("viewBox", "0 -5 10 10")
  .attr("refX", 0)
  .attr("refY", -5)
  .attr("markerWidth", 4)
  .attr("markerHeight", 4)
  .attr("orient", "auto")
  .append("path")
  .attr("d", "M-5,0L0,-10L5,0")
  .style("fill", "black");

// assegnazione del colore al testo dei ticks
svg
	.selectAll('.tick text')
	.style('color', textColor)

// nascondere le linee verticali dei ticks
svg
	.selectAll('path.domain')
	.style('stroke-width', 0)