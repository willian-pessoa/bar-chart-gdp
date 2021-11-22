function App(){
    const [gdpData, setGdpData] = React.useState([]);

    React.useEffect(() => {
        async function fetchData(){
            const response = await fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json");
            const data = await response.json();
            setGdpData(data.data);
        }
        fetchData();
    }, []);

    return (
        <div className="container">
        <div className="visMolder">
        <BarChart data={gdpData} height={500} widthBar={4} width={gdpData.length * 4}/>
        </div>
        </div>
    );
}


function BarChart({data, height, width, widthBar}){
    React.useEffect(() =>{
        createBarChart();
    }, [data]);

    const createBarChart = () => {
        const gdp = data.map(gdp => gdp[1]);
        const year = data.map(year => year[0]);
        console.log(gdp);

        const gdpMax = d3.max(gdp)
        const yScale = d3.scaleLinear().domain([0, gdpMax]).range([0, height])

        let yAxisScale = d3.scaleLinear().domain([0,gdpMax]).range([height, 0]);
        let yAxis = d3.axisLeft(yAxisScale);



        let tooltip = d3.select(".visMolder")
        .append("div")
        .attr("id", "tooltip")
        .style("opacity", 0);

        d3.select("svg").selectAll("rect").data(gdp).enter().append("rect")
        d3.select("svg")
        .selectAll("rect")
        .data(gdp)
        .style("fill", "green")
        .attr("x", (d, i) => 55 + i * widthBar)
        .attr("y", (d) => height - yScale(d))
        .attr("height", (d, i) => yScale(d))
        .attr("width", widthBar)
        .on("mouseover", (d, i) => {
            tooltip.style("opacity", 0.9);
            tooltip.html("Year: " + year[i].substring(0,4) + "<br/> Month: " + year[i].substring(5,7) + "<br/> GDP: " + d)
            .style("left", i * widthBar + 20 + "px")
            .style("top", d3.event.pageY - 170 + "px");
        });

        d3.select("svg")
        .append("g")
        .call(yAxis)
        .attr("id", "y-axis")
        .attr("transform", "translate(55,0)")
        .style("font-color", "white")

    }

    return (
        <>
            <svg width={width} height={height}></svg>
        </>
    );

}

ReactDOM.render(<App />, document.getElementById("root"));
