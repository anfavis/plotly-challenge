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
      if (d[0] == "Washing Frequency") {
        var item = metadataPanel.append("p").attr("id", "wash");
        item.html(`<b>${d[0]}:</b> ${d[1]}`);
      }
      else {
        var item = metadataPanel.append("p");
        item.html(`<b>${d[0]}:</b> ${d[1]}`);
      }
    })
    
    // BUILD THE GAUGE CHART //
    //Select html element to place the visualization
    var gaugeChart = d3.select("#gauge");

    //clear data from existing gauge
    gaugeChart.html("");

    //find the value to plot on the gauge
    dict.map((d, i) => {
      if(d[0] == "Washing Frequency") {
        buildGauge(d[1]);
      }
    }); 
  });
};


/////////////////////////////////////////////////////////////
function buildGauge(d) {

  var data = [
    {
      domain: { x: [0, 1], y: [0, 1] },
      value: d,
      title: { text: "Belly Button Washing Frequency", font: {size: 24}},
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: { range: [null, 9], tickwidth: 1, tickcolor: "darkblue" },
        steps: [
          { range: [0, 1], color: "#F7FFE7" },
          { range: [1, 2], color: "#EAFFC1" },
          { range: [2, 3], color: "#DEEE90" },
          { range: [3, 4], color: "#CEEE90" },
          { range: [4, 5], color: "#BFEE90" },
          { range: [5, 6], color: "#90EE90" },
          { range: [6, 7], color: "#5BC85B" },
          { range: [7, 8], color: "#31A231" },
          { range: [8, 9], color: "#137B13" }                
        ]
      }
    }
  ];

var layout = {
  width: 600, 
  height: 450, 
  margin: { t: 0, b: 0 } 
};

Plotly.newPlot("gauge", data, layout);
}
/////////////////////////////////////////////////////////////
// function buildGauge(d) {
//   //Plotting:
//   var scrubs = d;
//   console.log(scrubs);

//   // Trig to calc meter point
//   var degrees = 180 - scrubs,
//       radius = .5;
//   var radians = degrees * Math.PI / 180;
//   var x = radius * Math.cos(radians);
//   var y = radius * Math.sin(radians);

//   // Path: may have to change to create a better triangle
//   var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
//       pathX = String(x),
//       space = ' ',
//       pathY = String(y),
//       pathEnd = ' Z';
//   var path = mainPath.concat(pathX,space,pathY,pathEnd);

//   var data = [{ type: 'scatter',
//     x: [0], y:[0],
//       marker: {size: 28, color:'850000'},
//       showlegend: false,
//       name: 'speed',
//       text: scrubs,
//       hoverinfo: 'text+name'},
//     { values: [50/6, 50/6, 50/6, 50/6, 50/6, 50/6, 50],
//     rotation: 90,
//     text: ['TOO FAST!', 'Pretty Fast', 'Fast', 'Average',
//               'Slow', 'Super Slow', ''],
//     textinfo: 'text',
//     textposition:'inside',
//     marker: {colors:['rgba(14, 127, 0, .5)', 'rgba(110, 154, 22, .5)',
//                           'rgba(170, 202, 42, .5)', 'rgba(202, 209, 95, .5)',
//                           'rgba(210, 206, 145, .5)', 'rgba(232, 226, 202, .5)',
//                           'rgba(255, 255, 255, 0)']},
//     labels: ['151-180', '121-150', '91-120', '61-90', '31-60', '0-30', ''],
//     hoverinfo: 'label',
//     hole: .5,
//     type: 'pie',
//     showlegend: false
//   }];

//   var layout = {
//     shapes:[{
//         type: 'path',
//         path: path,
//         fillcolor: '850000',
//         line: {
//           color: '850000'
//         }
//       }],
//     title: '<b>Gauge</b> <br> Speed 0-100',
//     height: 1000,
//     width: 1000,
//     xaxis: {zeroline:false, showticklabels:false,
//               showgrid: false, range: [-1, 1]},
//     yaxis: {zeroline:false, showticklabels:false,
//               showgrid: false, range: [-1, 1]}
//   };

//   Plotly.newPlot('gauge', data, layout);

// }

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var samplePath = `/samples/${sample}`;
  d3.json(samplePath).then(data => {
    // console.log(data)
    
    // Slice top 10 from each array
    var sample_values = data.sample_values.slice(0, 10);
    var otu_ids = data.otu_ids.slice(0, 10);
    var otu_labels = data.otu_labels.slice(0, 10);
    // console.log(sample_values, otu_ids, otu_labels);

    // PLOT PIE CHART
    var pieData = {
      labels: otu_ids,
      values: sample_values,
      hovertext: otu_labels,
      type: 'pie'
    };
    var pieLayout = {
      title: `Samples Collected from Participant #${sample}`,
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
      title: `Bacteria/Archaea Found in Participant #${sample}`,
      xaxis: {title: "OTU (Bacteria/Archaea) ID's"},
      yaxis: {title: "Sample Frequency"},
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
