url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json"

//check data
d3.json(url).then(function(data) {
    console.log(data);
  });

function init() {
    // Create dropdown
    let dropdown_menu = d3.select('#selDataset');

    // Pull dropdown data
    d3.json(url).then((data) => {
        let sample_names = data.names;
    
        // Append dropdown menu with each sample name
        sample_names.forEach((sample) => {
            // console.log(sample)
            dropdown_menu.append('option').text(sample).property('value',sample);
        });

        // Initialize with the first sample
        let first_sample = sample_names[0];
        optionChanged(first_sample)
    });
}

// update charts with each new selection
function optionChanged(new_sample) {
        BuildCharts(new_sample);
        MetaData(new_sample);
}

//Create charts
function BuildCharts(sample) {
    // Pull data
    d3.json(url).then((data) => {
        let sample_data = data.samples;

        // Filter by sample ID 
        let sample_filter = sample_data.filter((sample_object) => sample_object.id == sample);
        let sample_id = sample_filter[0];

        // set variables
        let sample_values = sample_id.sample_values;
        let otu_ids = sample_id.otu_ids;
        let otu_labels = sample_id.otu_labels;
        
        // Create trace for bar chart
        let trace = [{
            x: sample_values.slice(0, 10).reverse(),
            y: otu_ids.slice(0, 10).reverse().map((id) => `OTU ${id}`),
            text: otu_labels.slice(0, 10),
            type:'bar',
            orientation: 'h'
        }];

        // plot bar chart
        Plotly.newPlot('bar', trace);
        console.log(`${sample} bar chart loaded`);

        //Create trace for bubble chart
        let trace2 = [{
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: 'Picnic',
            }
        }];

        // define the layout for the bubble chart
        let layout = {
            xaxis: {title: 'OTU ID'}
        };

        // Plot the bubble chart
        Plotly.newPlot('bubble', trace2, layout);
        console.log(`${sample} bubble chart loaded`);
    });
}

function MetaData(sample) {
    // pull data
    d3.json(url).then((data) => {
        let sample_data = data.metadata;
        console.log(sample_data)
        // Filter by sample ID 
        let sample_filter = sample_data.filter((sample_object) => sample_object.id == sample);
        let sample_id = sample_filter[0];

        let demographic_info = d3.select('#sample-metadata');

        d3.selectAll('#sample-metadata p').remove()
        
        for (let result in sample_id){
            demographic_info.insert('p').text(`${result}: ${sample_id[result]}`);
        }
    });
        
}

// Initialize the page
init()