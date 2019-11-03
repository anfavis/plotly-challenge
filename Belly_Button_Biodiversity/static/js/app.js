function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  var metadataUrl = `/metadata/${sample}`;
  d3.json(metadataUrl).then(function(data){
    var dict = Object.entries(data)
    // console.log(data)

    // Use d3 to select the panel with id of `#sample-metadata`
    var metadataPanel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    metadataPanel.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    dict.map((d, i) => {
      // console.log(d, i)
      // Add new p for each item in dictionary
      var item = metadataPanel.append("p");
      item.html(`<b>${d[0]}:</b> ${d[1]}`);
    })

  });


    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
};

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var samplePath = `/samples/${sample}`;
  d3.json(samplePath).then(data => {
    console.log(data)
    
    // Slice top 10 from each array
    var sample_values = data.sample_values.slice(0, 10);
    var otu_ids = data.otu_ids.slice(0, 10);
    var otu_labels = data.otu_labels.slice(0, 10);
    console.log(sample_values, otu_ids, otu_labels);

    // PLOT PIE CHART
    var pieData = {
      labels: otu_ids,
      values: sample_values,
      hovertext: otu_labels,
      type: 'pie'
    };
    var pieLayout = {
      title: `Samples for #${sample}`,
    };
    Plotly.newPlot("pie", [pieData], pieLayout);

    // PLOT BUBBLE CHART
    var bubbleData = {
      x: otu_ids,
      y: sample_values,
      mode: 'markers',
      marker: {
        color: otu_ids,
        size: sample_values
      },
      text: otu_labels
    };
    var bubbleLayout = {
      title: `Frequency of Bacteria for Sample#${sample}`,
      xaxis: {title: "OTU ID's"},
      yaxis: {title: "Frequency of Bacteria/Archaea Found"},
      showlegend: false,
    };
    Plotly.newPlot('bubble', [bubbleData], bubbleLayout);
  });
}

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
};

// Initialize the dashboard
init();
