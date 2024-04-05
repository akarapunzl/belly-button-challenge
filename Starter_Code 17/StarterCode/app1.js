url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json"

function init() {
    // Create dropdown
    let dropdown_menu = d3.select('#selDataset');

    // Pull dropdown data
    d3.json(url).then((data) => {
        let sample_names = data.names;
    
 