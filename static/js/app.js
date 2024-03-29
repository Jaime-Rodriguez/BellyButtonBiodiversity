function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
    var url = `/metadata/${sample}`;
    d3.json(url).then(function(sample) {
      var sample_metadata = d3.select("#sample-metadata");

    
    // Use `.html("") to clear any existing metadata
      sample_metadata.html("");

      
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
      Object.entries(sample).forEach(function([key, value]) {
        var row = sample_metadata.append('p');
        row.text(`${key}: ${value}`);
    });
    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
    d3.json(url).then(function(data) {
      var wash = data.WFREQ;
    
   
    var data = [{domain: {x: [0, 1], y: [0, 1]}, value: wash, title: {text: "Belly Button Wash Frequency"},
    type: "indicator", mode: "gauge+number"}];

    var layout = {width: 500, height: 500, margin: {t: 0, b: 0}};
    Plotly.newPlot('gauge',data,layout);
    })
    });
};

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var url = `/samples/${sample}`;
  d3.json(url).then(function(sample) {

    // @TODO: Build a Bubble Chart using the sample data
    var x = sample.otu_ids;
    var y = sample.sample_values;
    var size = sample.sample_values;
    var markerColor = sample.otu_ids; 
    var textValues = sample.otu_labels;

    var trace = {
      mode: "markers",
      x: x,
      y: y,
      text: textValues,
      marker:{
        size:size,
        color:markerColor
      }
    };

    var data = [trace];

    var layout = {
      title: "OTU ID"
      }
      
      Plotly.newPlot("bubble", data, layout);
  
    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    d3.json(url).then(function(sample) {  

    var values = sample.sample_values.slice(0,10);
    var labels = sample.otu_ids.slice(0,10);
    var hovertext = sample.otu_labels.slice(0,10);

    var trace = {
      values: values,
      labels: labels,
      hovertext: hovertext,
      type: 'pie'
    };

    var data = [trace];

    Plotly.newPlot('pie',data);

    });
  });
};


function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();