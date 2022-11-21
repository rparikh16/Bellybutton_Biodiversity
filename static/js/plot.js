function init() {
    var selector = d3.select("#selDataset");
  
    d3.json("samples.json").then((data) => {
      console.log(data);
      var sampleNames = data.names;
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
    })}
function optionChanged(newSample) {
    console.log(newSample);
}
function optionChanged(newSample) {
    buildMetadata(newSample);
    buildCharts(newSample);
  }
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}
// Bar and Bubble charts
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;
    var metadata = data.metadata;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var filteredSamples = samples.filter(sampleObj => sampleObj.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var filteredSample = filteredSamples[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = filteredSample.otu_ids;
    var otu_labels = filteredSample.otu_labels;
    var sample_values = filteredSample.sample_values;
    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    var yticks = otu_ids.slice(0, 10).map(otu_id => `OTU ${otu_id}`).reverse();

    // 8. Create the trace for the bar chart. 
    var barData = {
      x: sample_values.slice(0, 10).reverse(),
      y: yticks,
      text: otu_labels.slice(0, 10).reverse(),
      type: "bar",
      orientation: "h"
    };
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Microbial Species in the Belly Button",
      xaxis: {title: "Bacteria Sample Value"},
      yaxis: {title: "OTU IDs"},
      width: 400,
      height: 400
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", [barData], barLayout);

    // 1. Create the trace for the bubble chart.
    var bubbleData = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: "markers",
      marker: {
        color: otu_ids,
        size: sample_values
      }
    };

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Belly Button Samples",
      xaxis: {title: "OTU IDs"},
      yaxis: {title: "Sample Values"}
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", [bubbleData], bubbleLayout);
    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var filteredMetadata_Results = metadata.filter(sampleObj => sampleObj.id == sample);
    // 2. Create a variable that holds the first sample in the metadata array.
    var filteredMetadata = filteredMetadata_Results[0];
    // 3. Create a variable that holds the washing frequency.
    var washfreq = filteredMetadata.wfreq
    // 4. Create the trace for the gauge chart.
    var gaugeData = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: washfreq,
        title: { text: "Washing Frequency (Times per Week)" },
        type: "indicator",
        mode: "gauge+number",
        gauge: {
            bar: {color: 'black'},
            axis: { range: [null, 10] },
            steps: [
                { range: [0, 2], color: 'red' },
                { range: [2, 4], color: 'orange' },
                { range: [4, 6], color: 'yellow' },
                { range: [6, 8], color: 'green' },
                { range: [8, 10], color: 'darkgreen' },
              ]
            }
        }];
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 400,
      height: 400,
      margin: {t: 0, b: 0}     
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}
init();