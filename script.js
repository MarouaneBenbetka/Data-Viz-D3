const dataPath = "./data";
const maladies = "Asthma,Diabetes,Hypertension,None,Others".split(",");
const colorsNormal = ["#66CCCC", "#FF9933", "#FF5733", "#99CC99", "#9966CC"];
const colorsBlindPeople = [
	"#4A90E2",
	"#FF8C00",
	"#6A8A82",
	"#CCCCCC",
	"#FFD700",
];

let colorBlind = false;
let maladieSelectedIndex = 0;

const radarChartAxisData = {
	Age: {
		max: 27.5,
		label: "years",
	},
	"Fruit Consumption": {
		max: 3.5,
		label: "times per week",
	},
	"Vegetable Consumption": {
		max: 4,
		label: "times per week",
	},
	"Physical Activity": {
		max: 2,
		label: "times per week",
	},
	"Sitting Time": {
		max: 10.5,
		label: "hours per day",
	},
};

const healthConditions = {
	asthma: "Chronic respiratory condition characterized by inflammation of the airways, leading to recurrent episodes of breathlessness, wheezing, and coughing.",
	diabetes:
		"Metabolic disorder resulting in elevated blood sugar levels, either due to insufficient insulin production (Type 1) or ineffective use of insulin by the body (Type 2).",
	hypertension:
		"Commonly known as high blood pressure, it occurs when the force of blood against the artery walls is consistently too high, potentially leading to serious health problems.",
	none: "Indicates the absence of any specified medical conditions or diseases.",
	others: "Refers to a category encompassing various health conditions not explicitly listed, requiring further specification for a detailed description.",
};

function main() {
	const sexe = ["homme", "femme"];
	const margin = { top: 10, right: 250, bottom: 50, left: 50 },
		width = 850 - margin.left - margin.right,
		height = 450 - margin.top - margin.bottom;

	// append the svg object to the body of the page
	const svg = d3
		.select("#my_dataviz")
		.append("svg")
		.attr("id", "mysvg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", `translate(${margin.left},${margin.top})`);

	// We use these to get the relative coordinates of mouse events to the svg
	const svg_el = document.getElementById("mysvg");
	const svgRect = svg_el.getBoundingClientRect();

	// ----------------
	// We create a tooltip
	// ----------------
	const rec = d3
		.select("#mysvg")
		.append("rect")
		.attr("id", "myrec")
		.attr("width", "100")
		.attr("height", "15")
		.attr("fill", "white")
		.attr("stroke-width", "1px")
		.attr("opacity", 0)
		.attr("pointer-events", "none")
		.attr("rx", 5)
		.attr("ry", 5);

	const tooltip = d3
		.select("#mysvg")
		.attr("id", "mytool")
		.append("text")
		.attr("opacity", 0)
		.attr("fill", "black")
		.attr("stroke", "solid")
		.attr("pointer-events", "none")
		.style("stroke-width", "1px")
		.style("font-size", "12px")
		.style("font-family", "Arial");

	//We create the buttons to switch between data
	const button1 = document.getElementById("activite_physique");
	const button2 = document.getElementById("frequence_consommation_fruit");
	const button3 = document.getElementById("frequence_consommation_legume");
	const button4 = document.getElementById("activite");
	const button5 = document.getElementById("age");
	const button6 = document.getElementById("matiere_grasse");

	const colorToggleButton = document.getElementById("toggleButton");

	//Legend for the x axis
	const xLabel = svg
		.append("text")
		.attr("x", width - 40)
		.attr("y", height + 20)
		.style("font-size", "12px")
		.style("font-weight", "600")
		.text("Age")
		.style("font-family", "sans-serif");
	//Legend for the y axis
	const ylabel = svg
		.append("text")
		.attr("x", 10)
		.attr("y", 5)
		.style("font-weight", "600")
		.style("font-size", "12px")
		.style("font-family", "sans-serif");

	//Event Handler
	function handleClick(event) {
		// Remove the class from all buttons
		event.preventDefault();
		const clickedButton = event.target;
		var allButtons = document.querySelectorAll("button");
		allButtons.forEach(function (button) {
			if (button !== clickedButton) {
				button.classList.remove("activeVariable");
			}
		});

		// add active class for the clicked button
		event.target.classList.add("activeVariable");

		const path = [
			`${dataPath}/group_${event.target.id}_femme.csv`,
			`${dataPath}/group_${event.target.id}_homme.csv`,
		];
		console.log(event.target.id);
		xLabel.text(event.target.textContent);
		switch (event.target.id) {
			case "activite_physique":
				ylabel.text(
					"Distribution des personnes selon l'activité physique"
				);
				break;
			case "frequence_consommation_fruit":
				ylabel.text(
					"Distribution des personnes selon la frequence du consommation des fruits "
				);
				break;
			case "frequence_consommation_legume":
				ylabel.text(
					"Distribution des personnes selon la frequence consommation des legumes"
				);
				break;
			case "activite":
				ylabel.text(
					"Distribution des personnes selon l'activite occupée"
				);
				break;
			case "age":
				ylabel.text("Distribution des personnes selon l'age");
				break;
			case "matiere_grasse":
				ylabel.text(
					"Distribution des personnes selon la matiere grasse"
				);
				break;
			default:
				ylabel.text("Distribution des personnes selon l'activite");
				break;
		}

		// Parse the Data
		path.forEach((path, index) => {
			d3.csv(path).then(function (data) {
				// List of subgroups = header of the csv files = soil condition here
				const subgroups = data.columns.slice(1);
				// List of groups = species here = value of the first column called group -> I show them on the X axis
				const groups = data.map((d) => d[data.columns[0]]);

				// Add X axis
				const x = d3
					.scaleBand()
					.domain(groups)
					.range([0, width])
					.padding([0.4]);

				// Add Y axis

				const findMaxValue = (array) => {
					// Initialize max value with the smallest possible integer value
					total = 0;
					// Iterate through the array of objects
					for (const obj of array) {
						total =
							Math.max(
								total,
								Object.values(obj)
									.slice(1)
									.reduce(
										(acc, current) =>
											acc + parseInt(current),
										0
									)
							) + 4;
					}
					return total;
				};
				// console.log(data);
				// Call the function with your array of objects
				const max_count = findMaxValue(data);
				const y = d3
					.scaleLinear()
					.domain([0, max_count + 4])
					.range([height, 0]);

				// color palette = one color per subgroup
				const color = d3
					.scaleOrdinal()
					.domain(subgroups)
					.range(colorBlind ? colorsBlindPeople : colorsNormal);

				//stack the data? --> stack per subgroup
				const stackedData = d3.stack().keys(subgroups)(data);

				colors_list = [];
				// Show the bars

				d3.select("#mybars" + index).remove();
				svg.append("g")
					.attr("id", "mybars" + index)
					.selectAll("g")
					.data(stackedData)
					.join("g")
					.attr("fill", (d) => color(d.key))
					.attr("class", (d) => `myRect ${d.key} ${sexe[index]}`)
					.selectAll("rect")
					.data((d) => d)
					.join("rect")
					.attr(
						"x",
						(d) =>
							x(d.data[data.columns[0]]) +
							index * 5 +
							(index * x.bandwidth()) / 2
					)
					.attr("y", (d) => y(d[1]))
					.attr("height", (d) => y(d[0]) - y(d[1]))
					.attr("width", x.bandwidth() / 2)
					.attr("stroke", "black")
					.on("mouseover", function (event, d) {
						// What happens when user hover a bar
						// what subgroup are we hovering?
						const subGroupName = d3
							.select(this.parentNode)
							.datum().key;
						// Reduce opacity of all rect to 0.2
						d3.selectAll(".myRect").style("opacity", 0.2);
						// Highlight all rects of this subgroup with opacity 1. It is possible to select them since they have a specific class = their name.
						d3.selectAll(`.${subGroupName}.homme`)
							.style("opacity", 1)
							.attr("fill", "#6FA8DC");
						d3.selectAll(`.${subGroupName}.femme`)
							.style("opacity", 1)
							.attr("fill", "#d5a6bd");

						const subgroupValue = d.data[subGroupName];
						const sexe = index == 0 ? "homme" : "femme";
						const hoveredMaladieIndex =
							maladies.indexOf(subGroupName);
						if (maladieSelectedIndex != hoveredMaladieIndex) {
							maladieSelectedIndex = hoveredMaladieIndex;
							mainRadarChart(hoveredMaladieIndex);

							// this is part is for chaning the description of the maladie
							document.getElementById(
								"maladie-title"
							).textContent = subGroupName;
							document.getElementById(
								"maladie-description"
							).textContent =
								healthConditions[subGroupName.toLowerCase()];
						}
						rec.attr("opacity", 0.8);
						tooltip
							.style("fill", "black")
							.attr("opacity", 1)
							.text(`${subGroupName} : ${subgroupValue}`);
					})
					.on("mousemove", function (event, d) {
						mouseX = event.x - svgRect.left;
						mouseY = event.y - svgRect.top;
						rec.attr("x", mouseX + 10).attr("y", mouseY - 11);
						tooltip.attr("x", mouseX + 15).attr("y", mouseY);
					})
					.on("mouseleave", function (event, d) {
						// When user do not hover anymore
						// Back to normal opacity: 1
						const colorsPallete = colorBlind
							? colorsBlindPeople
							: colorsNormal;

						d3.selectAll(".myRect").style("opacity", 1);
						const subGroupName = d3
							.select(this.parentNode)
							.datum().key;
						d3.selectAll(`.${subGroupName}`)
							.style("opacity", 1)
							.attr(
								"fill",
								colorsPallete[maladies.indexOf(subGroupName)]
							);

						console.log(subGroupName);
						//we hide the tooltip
						rec.attr("opacity", 0);
						tooltip.attr("opacity", 0);
					});

				//We add the animation at generation time
				svg.selectAll("rect")
					.transition()
					.duration(300)
					.attr("y", (d) => y(d[1]))
					.attr("height", (d) => y(d[0]) - y(d[1]))
					.delay(function (d, i) {
						return i * 10;
					});

				svg.selectAll(".barLabel" + index).remove();

				svg.selectAll(".barLabel" + index)
					.data(groups)
					.enter()
					.append("text")
					.attr("class", "barLabel" + index)
					.attr(
						"x",
						(d, i) =>
							x(d) + index * 5 + (index * x.bandwidth()) / 2 + 20
					)
					.attr("y", height + 30) // Position the labels below the x-axis
					.attr("text-anchor", "middle")
					.style("font-size", "12px")
					.text((d, i) => (index % 2 === 1 ? "Female" : "Male"));

				//We add the corresponding legend
				for (let i = 0; i < colors_list.length; i++) {
					d3.select("#lc" + i).remove();
					d3.select("#lt" + i).remove();
					svg.append("circle")
						.attr("id", "lc" + i)
						.attr("cx", width)
						.attr("cy", i * 15)
						.attr("r", 6)
						.style("fill", colors_list[i]);
					svg.append("text")
						.attr("id", "lt" + i)
						.attr("x", width + 9)
						.attr("y", i * 15 + 4)
						.style("font-size", "12px")
						.attr("alignment-baseline", "middle")
						.attr("font-family", "sans-serif")
						.text(subgroups[i]);
				}

				d3.select("#myyscale").remove();
				svg.append("g").attr("id", "myyscale").call(d3.axisLeft(y));

				d3.select("#myxscale").remove();
				svg.append("g")
					.attr("id", "myxscale")
					.attr("transform", `translate(0, ${height})`)
					.call(d3.axisBottom(x).tickSizeOuter(0));

				for (let i = 0; i < data.length; i++) {
					temp = data[i];
					groupname = temp.group;

					delete temp.group;
				}
			});
		});
	}

	function toggleButton(e) {
		e.preventDefault();
		// Toggle the "active" class on button click
		colorToggleButton.classList.toggle("active");

		// You can add additional functionality or actions here based on the button state
		if (colorToggleButton.classList.contains("active")) {
			colorBlind = true;
		} else {
			colorBlind = false;
		}

		mainRadarChart(maladieSelectedIndex);
		button1.click();
	}

	//We attach to the buttons the event handler for changing between health states
	button1.addEventListener("click", handleClick);
	button2.addEventListener("click", handleClick);
	button3.addEventListener("click", handleClick);
	button4.addEventListener("click", handleClick);
	button5.addEventListener("click", handleClick);
	button6.addEventListener("click", handleClick);
	colorToggleButton.addEventListener("click", toggleButton);
	//We trigger the event click for the first button to generate a chart when landing on the visualisation
	button1.click();
}

const toggleDarkMode = (e) => {
	e.preventDefault();

	const body = document.getElementById("body");
	body.classList.toggle("dark");

	document.getElementById("toggleDarkMode").classList.toggle("active");
};

/////////////////////////////////////////////////////////
/////////////// The Radar Chart Function ////////////////
/////////////// Written by Nadieh Bremer ////////////////
////////////////// VisualCinnamon.com ///////////////////
/////////// Inspired by the code of alangrafu ///////////
/////////////////////////////////////////////////////////

const all_data = [
	[
		{ maladie: "Asthma", axis: "Age", value: 0.748792270531401, max: 28 },
		{
			maladie: "Asthma",
			axis: "Fruit Consumption",
			value: 0.7585301837270342,
			max: 4,
		},
		{
			maladie: "Asthma",
			axis: "Vegetable Consumption",
			value: 0.8712121212121212,
			max: "4-5 times per week",
		},
		{
			maladie: "Asthma",
			axis: "Physical Activity",
			value: 0.48571428571428577,
			max: "2 times per week",
		},
		{
			maladie: "Asthma",
			axis: "Sitting Time",
			value: 0.9927272727272728,
			max: "11 hours",
		},
	],
	[
		{
			maladie: "Diabetes",
			axis: "Age",
			value: 0.8992094861660078,
			max: 28,
		},
		{
			maladie: "Diabetes",
			axis: "Fruit Consumption",
			value: 1.0,
			max: 4,
		},
		{
			maladie: "Diabetes",
			axis: "Vegetable Consumption",
			value: 0.9024064171122994,
			max: "4-5 times per week",
		},
		{
			maladie: "Diabetes",
			axis: "Physical Activity",
			value: 1.0,
			max: "2 times per week",
		},
		{
			maladie: "Diabetes",
			axis: "Sitting Time",
			value: 1.0,
			max: "11 hours",
		},
	],
	[
		{
			maladie: "Hypertension",
			axis: "Age",
			value: 0.8472686733556298,
			max: 28,
		},
		{
			maladie: "Hypertension",
			axis: "Fruit Consumption",
			value: 0.8134463961235614,
			max: 4,
		},
		{
			maladie: "Hypertension",
			axis: "Vegetable Consumption",
			value: 0.9090909090909091,
			max: "4-5 times per week",
		},
		{
			maladie: "Hypertension",
			axis: "Physical Activity",
			value: 0.5230769230769231,
			max: "2 times per week",
		},
		{
			maladie: "Hypertension",
			axis: "Sitting Time",
			value: 0.5987878787878788,
			max: "11 hours",
		},
	],
	[
		{ maladie: "None", axis: "Age", value: 0.9906832298136645, max: 28 },
		{
			maladie: "None",
			axis: "Fruit Consumption",
			value: 0.9714285714285714,
			max: 4,
		},
		{
			maladie: "None",
			axis: "Vegetable Consumption",
			value: 0.9350649350649349,
			max: "4-5 times per week",
		},
		{
			maladie: "None",
			axis: "Physical Activity",
			value: 0.7910204081632654,
			max: "2 times per week",
		},
		{
			maladie: "None",
			axis: "Sitting Time",
			value: 0.8925090909090909,
			max: "11 hours",
		},
	],
	[
		{ maladie: "Others", axis: "Age", value: 1.0, max: 28 },
		{
			maladie: "Others",
			axis: "Fruit Consumption",
			value: 0.6960629921259842,
			max: 4,
		},
		{
			maladie: "Others",
			axis: "Vegetable Consumption",
			value: 1.0,
			max: "4-5 times per week",
		},
		{
			maladie: "Others",
			axis: "Physical Activity",
			value: 0.9714285714285715,
			max: "2 times per week",
		},
		{
			maladie: "Others",
			axis: "Sitting Time",
			value: 0.52,
			max: "11 hours",
		},
	],
];

const mainRadarChart = (data_index) => {
	/* Radar chart design created by Nadieh Bremer - VisualCinnamon.com */

	//////////////////////////////////////////////////////////////
	//////////////////////// Set-Up //////////////////////////////
	//////////////////////////////////////////////////////////////

	var margin = { top: 35, right: 100, bottom: 100, left: 100 },
		width =
			Math.min(380, window.innerWidth - 10) - margin.left - margin.right,
		height = Math.min(
			width,
			window.innerHeight - margin.top - margin.bottom - 20
		);

	//////////////////////////////////////////////////////////////
	////////////////////////// Data //////////////////////////////
	//////////////////////////////////////////////////////////////

	var data = [all_data[data_index]];
	console.log(data_index);
	//////////////////////////////////////////////////////////////
	//////////////////// Draw the Chart //////////////////////////
	//////////////////////////////////////////////////////////////
	const maladieColor = colorBlind
		? colorsBlindPeople[data_index]
		: colorsNormal[data_index];
	var color = d3_old.scale.ordinal().range([maladieColor]);

	var radarChartOptions = {
		w: width,
		h: height,
		margin: margin,
		maxValue: 0.5,
		levels: 5,
		roundStrokes: true,
		color: color,
	};
	//Call function to draw the Radar chart
	RadarChart(".radarChart", data, radarChartOptions);
};

function RadarChart(id, data, options) {
	var cfg = {
		w: 600, //Width of the circle
		h: 600, //Height of the circle
		margin: { top: 20, right: 20, bottom: 20, left: 20 }, //The margins of the SVG
		levels: 3, //How many levels or inner circles should there be drawn
		maxValue: 0, //What is the value that the biggest circle will represent
		labelFactor: 1.25, //How much farther than the radius of the outer circle should the labels be placed
		wrapWidth: 60, //The number of pixels after which a label needs to be given a new line
		opacityArea: 0.35, //The opacity of the area of the blob
		dotRadius: 4, //The size of the colored circles of each blog
		opacityCircles: 0.1, //The opacity of the circles of each blob
		strokeWidth: 2, //The width of the stroke around each blob
		roundStrokes: false, //If true the area and stroke will follow a round path (cardinal-closed)
		color: d3_old.scale.category10(), //Color function
	};

	//Put all of the options into a variable called cfg
	if ("undefined" !== typeof options) {
		for (var i in options) {
			if ("undefined" !== typeof options[i]) {
				cfg[i] = options[i];
			}
		} //for i
	} //if

	//If the supplied maxValue is smaller than the actual one, replace by the max in the data
	var maxValue = Math.max(
		cfg.maxValue,
		d3_old.max(data, function (i) {
			return d3_old.max(
				i.map(function (o) {
					return o.value;
				})
			);
		})
	);

	var allAxis = data[0].map(function (i, j) {
			return i.axis;
		}), //Names of each axis
		total = allAxis.length, //The number of different axes
		radius = Math.min(cfg.w / 2, cfg.h / 2), //Radius of the outermost circle
		Format = d3_old.format("%"), //Percentage formatting
		angleSlice = (Math.PI * 2) / total; //The width in radians of each "slice"

	//Scale for the radius
	var rScale = d3_old.scale.linear().range([0, radius]).domain([0, maxValue]);

	/////////////////////////////////////////////////////////
	//////////// Create the container SVG and g /////////////
	/////////////////////////////////////////////////////////

	//Remove whatever chart with the same id/class was present before
	d3_old.select(id).select("svg").remove();

	//Initiate the radar chart SVG
	var svg = d3_old
		.select(id)
		.append("svg")
		.attr("width", cfg.w + cfg.margin.left + cfg.margin.right)
		.attr("height", cfg.h + cfg.margin.top + cfg.margin.bottom)
		.attr("class", "radar" + id);
	//Append a g element
	var g = svg
		.append("g")
		.attr(
			"transform",
			"translate(" +
				(cfg.w / 2 + cfg.margin.left) +
				"," +
				(cfg.h / 2 + cfg.margin.top) +
				")"
		);

	/////////////////////////////////////////////////////////
	////////// Glow filter for some extra pizzazz ///////////
	/////////////////////////////////////////////////////////

	//Filter for the outside glow
	var filter = g.append("defs").append("filter").attr("id", "glow"),
		feGaussianBlur = filter
			.append("feGaussianBlur")
			.attr("stdDeviation", "2.5")
			.attr("result", "coloredBlur"),
		feMerge = filter.append("feMerge"),
		feMergeNode_1 = feMerge.append("feMergeNode").attr("in", "coloredBlur"),
		feMergeNode_2 = feMerge
			.append("feMergeNode")
			.attr("in", "SourceGraphic");

	/////////////////////////////////////////////////////////
	/////////////// Draw the Circular grid //////////////////
	/////////////////////////////////////////////////////////

	//Wrapper for the grid & axes
	var axisGrid = g.append("g").attr("class", "axisWrapper");

	//Draw the background circles
	axisGrid
		.selectAll(".levels")
		.data(d3_old.range(1, cfg.levels + 1).reverse())
		.enter()
		.append("circle")
		.attr("class", "gridCircle")
		.attr("r", function (d, i) {
			return (radius / cfg.levels) * d;
		})
		.style("fill", "#CDCDCD")
		.style("stroke", "#CDCDCD")
		.style("fill-opacity", cfg.opacityCircles)
		.style("filter", "url(#glow)");

	//Text indicating at what % each level is
	// axisGrid
	// 	.selectAll(".axisLabel")
	// 	.data(d3_old.range(1, cfg.levels + 1).reverse())
	// 	.enter()
	// 	.append("text")
	// 	.attr("class", "axisLabel")
	// 	.attr("x", 4)
	// 	.attr("y", function (d) {
	// 		return (-d * radius) / cfg.levels;
	// 	})
	// 	.attr("dy", "0.4em")
	// 	.style("font-size", "10px")
	// 	.attr("fill", "#737373")
	// 	.text(function (d, i) {
	// 		return Format((maxValue * d) / cfg.levels);
	// 	});

	/////////////////////////////////////////////////////////
	//////////////////// Draw the axes //////////////////////
	/////////////////////////////////////////////////////////

	//Create the straight lines radiating outward from the center
	var axis = axisGrid
		.selectAll(".axis")
		.data(allAxis)
		.enter()
		.append("g")
		.attr("class", "axis");
	//Append the lines
	axis.append("line")
		.attr("x1", 0)
		.attr("y1", 0)
		.attr("x2", function (d, i) {
			return (
				rScale(maxValue * 1.1) * Math.cos(angleSlice * i - Math.PI / 2)
			);
		})
		.attr("y2", function (d, i) {
			return (
				rScale(maxValue * 1.1) * Math.sin(angleSlice * i - Math.PI / 2)
			);
		})
		.attr("class", "line")
		.style("stroke", "white")
		.style("stroke-width", "2px");

	//Append the labels at each axis
	axis.append("text")
		.attr("class", "legend")
		.style("font-size", "11px")
		.attr("text-anchor", "middle")
		.attr("dy", "0.35em")
		.attr("x", function (d, i) {
			return (
				rScale(maxValue * cfg.labelFactor) *
				Math.cos(angleSlice * i - Math.PI / 2)
			);
		})
		.attr("y", function (d, i) {
			return (
				rScale(maxValue * cfg.labelFactor) *
				Math.sin(angleSlice * i - Math.PI / 2)
			);
		})
		.text(function (d) {
			return d;
		})
		.call(wrap, cfg.wrapWidth);

	/////////////////////////////////////////////////////////
	///////////// Draw the radar chart blobs ////////////////
	/////////////////////////////////////////////////////////

	//The radial line function
	var radarLine = d3_old.svg.line
		.radial()
		.interpolate("linear-closed")
		.radius(function (d) {
			return rScale(d.value);
		})
		.angle(function (d, i) {
			return i * angleSlice;
		});

	if (cfg.roundStrokes) {
		radarLine.interpolate("cardinal-closed");
	}

	//Create a wrapper for the blobs
	var blobWrapper = g
		.selectAll(".radarWrapper")
		.data(data)
		.enter()
		.append("g")
		.attr("class", "radarWrapper");

	//Append the backgrounds
	blobWrapper
		.append("path")
		.attr("class", "radarArea")
		.attr("d", function (d, i) {
			return radarLine(d);
		})
		.style("fill", function (d, i) {
			return cfg.color(i);
		})
		.style("fill-opacity", cfg.opacityArea)
		.on("mouseover", function (d, i) {
			//Dim all blobs
			d3_old
				.selectAll(".radarArea")
				.transition()
				.duration(200)
				.style("fill-opacity", 0.08);
			//Bring back the hovered over blob
			d3_old
				.select(this)
				.transition()
				.duration(200)
				.style("fill-opacity", 0.7);
		})
		.on("mouseout", function () {
			//Bring back all blobs
			d3_old
				.selectAll(".radarArea")
				.transition()
				.duration(200)
				.style("fill-opacity", cfg.opacityArea);
		});

	//Create the outlines
	blobWrapper
		.append("path")
		.attr("class", "radarStroke")
		.attr("d", function (d, i) {
			return radarLine(d);
		})
		.style("stroke-width", cfg.strokeWidth + "px")
		.style("stroke", function (d, i) {
			return cfg.color(i);
		})
		.style("fill", "none")
		.style("filter", "url(#glow)");

	//Append the circles
	blobWrapper
		.selectAll(".radarCircle")
		.data(function (d, i) {
			return d;
		})
		.enter()
		.append("circle")
		.attr("class", "radarCircle")
		.attr("r", cfg.dotRadius)
		.attr("cx", function (d, i) {
			return rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2);
		})
		.attr("cy", function (d, i) {
			return rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2);
		})
		.style("fill", function (d, i, j) {
			return cfg.color(j);
		})
		.style("fill-opacity", 0.8);

	/////////////////////////////////////////////////////////
	//////// Append invisible circles for tooltip ///////////
	/////////////////////////////////////////////////////////

	//Wrapper for the invisible circles on top
	var blobCircleWrapper = g
		.selectAll(".radarCircleWrapper")
		.data(data)
		.enter()
		.append("g")
		.attr("class", "radarCircleWrapper");

	//Append a set of invisible circles on top for the mouseover pop-up
	blobCircleWrapper
		.selectAll(".radarInvisibleCircle")
		.data(function (d, i) {
			return d;
		})
		.enter()
		.append("circle")
		.attr("class", "radarInvisibleCircle")
		.attr("r", cfg.dotRadius * 1.5)
		.attr("cx", function (d, i) {
			return rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2);
		})
		.attr("cy", function (d, i) {
			return rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2);
		})
		.style("fill", "none")
		.style("pointer-events", "all")
		.on("mouseover", function (d, i) {
			newX = parseFloat(d3_old.select(this).attr("cx")) - 10;
			newY = parseFloat(d3_old.select(this).attr("cy")) - 20;

			tooltip
				.attr("x", newX)
				.attr("y", newY)
				.text(
					`${Math.round(d.value * radarChartAxisData[d.axis].max)} ${
						radarChartAxisData[d.axis].label
					}`
				)
				.transition()
				.duration(200)
				.style("opacity", 1);
		})
		.on("mouseout", function () {
			tooltip.transition().duration(200).style("opacity", 0);
		});

	//Set up the small tooltip for when you hover over a circle
	var tooltip = g.append("text").attr("class", "tooltip").style("opacity", 0);

	/////////////////////////////////////////////////////////
	/////////////////// Helper Function /////////////////////
	/////////////////////////////////////////////////////////

	//Taken from http://bl.ocks.org/mbostock/7555321
	//Wraps SVG text
	function wrap(text, width) {
		text.each(function () {
			var text = d3_old.select(this),
				words = text.text().split(/\s+/).reverse(),
				word,
				line = [],
				lineNumber = 0,
				lineHeight = 1.4, // ems
				y = text.attr("y"),
				x = text.attr("x"),
				dy = parseFloat(text.attr("dy")),
				tspan = text
					.text(null)
					.append("tspan")
					.attr("x", x)
					.attr("y", y)
					.attr("dy", dy + "em");

			while ((word = words.pop())) {
				line.push(word);
				tspan.text(line.join(" "));
				if (tspan.node().getComputedTextLength() > width) {
					line.pop();
					tspan.text(line.join(" "));
					line = [word];
					tspan = text
						.append("tspan")
						.attr("x", x)
						.attr("y", y)
						.attr("dy", ++lineNumber * lineHeight + dy + "em")
						.text(word);
				}
			}
		});
	} //wrap
} //RadarChart
