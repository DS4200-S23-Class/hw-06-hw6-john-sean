// Constants
const FRAME_HEIGHT = 500;
const FRAME_WIDTH = 500;
const MARGINS = { left: 50, right: 50, top: 50, bottom: 50 };

//Set vis height and width using the frame and margin sizes
const VIS_HEIGHT = FRAME_HEIGHT - MARGINS.top - MARGINS.bottom;
const VIS_WIDTH = FRAME_WIDTH - MARGINS.left - MARGINS.right;

// vis1 frame 
const FRAME1 = d3.select("#vis1")
    .append("svg")
    .attr("height", FRAME_HEIGHT)
    .attr("width", FRAME_WIDTH)
    .attr("class", "frame");

// vis1 scatterplot
function build_vis1() {

    d3.csv("data/iris.csv").then((data) => {

        // set scales and x,y maxes
        const MAX_X1 = d3.max(data, (d) => { return parseInt(d.Sepal_Length); });
        const MAX_Y1 = d3.max(data, (d) => { return parseInt(d.Petal_Length); });

        const X_SCALE1 = d3.scaleLinear()
            .domain([0, (MAX_X1 + 1)])
            .range([0, VIS_WIDTH]);

        const Y_SCALE1 = d3.scaleLinear()
            .domain([0, (MAX_Y1 + 1)])
            .range([VIS_HEIGHT, 0]);

        // create x and y axis for the first scatter plot
        FRAME1.append("g")
            .attr("transform", "translate(" + MARGINS.left +
                "," + (VIS_HEIGHT + MARGINS.top) + ")")
            .call(d3.axisBottom(X_SCALE1).ticks(10))
            .attr("font-size", '12px');
        FRAME1.append("g")
            .attr("transform",
                "translate(" + MARGINS.left + "," + (MARGINS.bottom) + ")")
            .call(d3.axisLeft(Y_SCALE1).ticks(10))
            .attr("font-size", "12px");
        //set the color
        const color = d3.scaleOrdinal()
            .domain(["setosa", "versicolor", "virginica"])
            .range(["green", "blue", "orange"])

        // Add points
        let scatter1 = FRAME1.selectAll("points")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", (d) => { return (X_SCALE1(d.Sepal_Length) + MARGINS.left); })
            .attr("cy", (d) => { return (Y_SCALE1(d.Petal_Length) + MARGINS.top); })
            .attr("r", 5)
            .attr("fill", function (d) { return color(d.Species); })
            .attr("opacity", 0.5)
            .attr("stroke", "none")
            .attr("class", "point");
    })
}

build_vis1()

// vis2 frame
const FRAME2 = d3.select("#vis2")
    .append("svg")
    .attr("height", FRAME_HEIGHT)
    .attr("width", FRAME_WIDTH)
    .attr("class", "frame");

// vis 2 
function build_vis2() {

    d3.csv("data/iris.csv").then((data) => {

        // set scales and x,y maxes for the second scatter plot
        const MAX_X2 = d3.max(data, (d) => { return parseInt(d.Sepal_Width); });
        const MAX_Y2 = d3.max(data, (d) => { return parseInt(d.Petal_Width); });

        const X_SCALE2 = d3.scaleLinear()
            .domain([0, MAX_X2 + 0.6])
            .range([0, VIS_WIDTH]);

        const Y_SCALE2 = d3.scaleLinear()
            .domain([0, (MAX_Y2 + 1)])
            .range([VIS_HEIGHT, 0]);

        // Create x and y axis for the graph
        FRAME2.append("g")
            .attr("transform", "translate(" + MARGINS.left +
                "," + (VIS_HEIGHT + MARGINS.top) + ")")
            .call(d3.axisBottom(X_SCALE2).ticks(10))
            .attr("font-size", '12px');
        FRAME2.append("g")
            .attr("transform",
                "translate(" + MARGINS.left + "," + (MARGINS.bottom) + ")")
            .call(d3.axisLeft(Y_SCALE2).ticks(10))
            .attr("font-size", "12px");

        const colors = {
            'setosa': 'green',
            'versicolor': 'blue',
            'virginica': 'orange'
        };
        // Enter data and append points to graph
        let scatter2 = FRAME2.selectAll("points")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", (d) => { return (X_SCALE2(d.Sepal_Width) + MARGINS.left); })
            .attr("cy", (d) => { return (Y_SCALE2(d.Petal_Width) + MARGINS.top); })
            .attr("r", 5)
            .attr("stroke", "none")
            .attr("fill", function (d) { return colors[d.Species]; })
            .attr("opacity", 0.5)
            .attr("class", "point");
    });

    //Brushing using d3.brush funtion
    FRAME2.call(d3.brush()
        .extent([[0, 0], [FRAME_WIDTH, FRAME_HEIGHT]])
        .on("start brush", updateChart));

    //update when brushed
    function updateChart(event) {
        let extent = event.selection;
        scatter1.classed("selected", function (d) { return isBrushed(extent, X_SCALE2(d.Sepal_Width) + MARGINS.left, Y_SCALE2(d.Petal_Width) + MARGINS.top); });
        scatter2.classed("selected", function (d) { return isBrushed(extent, X_SCALE2(d.Sepal_Width) + MARGINS.left, Y_SCALE2(d.Petal_Width) + MARGINS.top); });
        bar.classed("selected", function (d) { return isBrushed(extent, X_SCALE2(d.Sepal_Width) + MARGINS.left, Y_SCALE2(d.Petal_Width) + MARGINS.top); });
    }

    //Boolean to determine if a point is currently selected
    function isBrushed(brush_xy, cx, cy) {
        var x0 = brush_xy[0][0],
            x1 = brush_xy[1][0],
            y0 = brush_xy[0][1],
            y1 = brush_xy[1][1];
        return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;
    }
}
build_vis2()

// vis 3 frame
const FRAME3 = d3.select("#vis3")
    .append("svg")
    .attr("height", FRAME_HEIGHT)
    .attr("width", FRAME_WIDTH)
    .attr("class", "frame");

// vis 3
function build_vis3() {

    d3.csv("data/iris.csv").then((data) => {

        // Create the mapping that will be visualized in the bar chart
        var fdata = [{ 'setosa': 50 }, { 'versicolor': 50 }, { 'virginica': 50 }]
        var map1 = fdata.map(d => {
            return {
                species: Object.keys(d)[0],
                count: d[Object.keys(d)[0]]
            }
        });

        // set scales and x,y maxes for vis3
        const MAX_X3 = d3.max(map1, (d) => { return parseInt(d.species); })

        const MAX_Y3 = d3.max(map1, (d) => { return parseInt(d.count); })

        const X_SCALE3 = d3.scaleBand()
            .domain(Object.keys(color))
            .range([MARGINS.left, VIS_WIDTH])
            .padding(0.3);

        const Y_SCALE3 = d3.scaleLinear()
            .domain([0, (MAX_Y3 + 1)])
            .range([VIS_HEIGHT, 0]);
        // set the color to match other vis
        const color = {
            'setosa': 'green',
            'versicolor': 'blue',
            'virginica': 'orange'
        };
        // Add bars 
        let bar = FRAME3.selectAll("bar")
            .data(map1)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", (d) => { return X_SCALE3(d.species); })
            .attr("y", (d) => { return MARGINS.top + Y_SCALE3(d.count); })
            .attr('id', (d) => { return d.species })
            .attr("width", X_SCALE3.bandwidth())
            .attr("height", (d) => { return (VIS_HEIGHT - Y_SCALE3(d.count)); })
            .attr("fill", (d) => { return color[d.species]; })
            .attr("opacity", 0.5);


        // Adds x and y axis
        FRAME3.append("g")
            .attr("transform", "translate(0," + (VIS_HEIGHT + MARGINS.top) + ")")
            .call(d3.axisBottom(X_SCALE3));
        FRAME3.append("g")
            .attr("transform", "translate(" + MARGINS.left +
                "," + MARGINS.top + ")")
            .call(d3.axisLeft(Y_SCALE3));
    });
}

build_vis3();