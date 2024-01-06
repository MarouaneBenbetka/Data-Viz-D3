const dataPath = "./data";

function main() {
	const margin = { top: 10, right: 250, bottom: 50, left: 50 },
		width = 1000 - margin.left - margin.right,
		height = 550 - margin.top - margin.bottom;

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
		.attr("width", "225")
		.attr("height", "15")
		.attr("fill", "white")
		.attr("stroke", "black")
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
	const button1 = document.getElementById("ActivitePhysique");
	const button2 = document.getElementById("ConsommationFruit");
	const button3 = document.getElementById("ConsommationLegumes");
	const button4 = document.getElementById("Age");
	const button5 = document.getElementById("Activite");

	//Legend for the x axis
	svg.append("text")
		.attr("x", width)
		.attr("y", height + 12)
		.attr("fill", "black")
		.style("font-size", "12px")
		.text("Age")
		.style("font-family", "sans-serif");
	//Legend for the y axis
	const ylabel = svg
		.append("text")
		.attr("x", 10)
		.attr("y", 5)
		.attr("fill", "black")
		.style("font-size", "12px")
		.style("font-family", "sans-serif");

	//Event Handler
	function handleClick(event) {
		var path;
		switch (event.target.id) {
			case "ActivitePhysique":
				path = [
					`${dataPath}/group_activite_physique_femme.csv`,
					`${dataPath}/group_activite_physique_homme.csv`,
				];
				ylabel.text(
					"Distribution des personnes selon l'activité physique"
				);
				break;
			case "ConsommationFruit":
				path = [
					`${dataPath}/group_frequence_consommation_fruit_femme.csv`,
					`${dataPath}/group_frequence_consommation_fruit_homme.csv`,
				];
				ylabel.text(
					"Distribution des personnes selon la consommation des fruits "
				);
				break;
			case "ConsommationLegumes":
				path = [
					`${dataPath}/group_frequence_consommation_legume_femme.csv`,
					`${dataPath}/group_frequence_consommation_legume_homme.csv`,
				];
				ylabel.text(
					"Distribution des personnes selon la consommation des legumes"
				);
				break;
			case "Fumeur":
				path = [
					`${dataPath}/group_fumeur_femme.csv`,
					`${dataPath}/group_fumeur_homme.csv`,
				];
				ylabel.text("Distribution des personnes selon fumeur ou pas");
				break;
			case "Activite":
				path = [
					`${dataPath}/group_activite_femme.csv`,
					`${dataPath}/group_activite_homme.csv`,
				];
				ylabel.text("Distribution des personnes selon l'activite");
				break;
			case "Age":
				path = [
					`${dataPath}/group_age_femme.csv`,
					`${dataPath}/group_age_homme.csv`,
				];
				ylabel.text("Distribution des personnes selon l'activite");
				break;
			default:
				path = [
					`${dataPath}/group_activite_femme.csv`,
					`${dataPath}/group_activite_homme.csv`,
				];
				ylabel.text("Distribution des personnes selon l'activite");
				break;
		}

		// Parse the Data
		path.forEach((path, index) => {
			d3.csv(path).then(function (data) {
				// List of subgroups = header of the csv files = soil condition here
				const subgroups = data.columns.slice(1);
				// List of groups = species here = value of the first column called group -> I show them on the X axis
				const groups = data.map((d) => d.group);

				// Add X axis
				const x = d3
					.scaleBand()
					.domain(groups)
					.range([0, width])
					.padding([0.4]);
				d3.select("#myxscale").remove();
				svg.append("g")
					.attr("id", "myxscale")
					.attr("transform", `translate(0, ${height})`)
					.call(d3.axisBottom(x).tickSizeOuter(0));

				// Add Y axis

				const findMaxValue = (array) => {
					// Initialize max value with the smallest possible integer value
					let maxValue = 10;
					total = 0;
					// Iterate through the array of objects
					for (const obj of array) {
						total = Math.max(
							total,
							Object.values(obj)
								.slice(1)
								.reduce(
									(acc, current) => acc + parseInt(current),
									0
								)
						);
					}
					return total;
				};

				// Call the function with your array of objects
				const max_count = findMaxValue(data);
				const y = d3
					.scaleLinear()
					.domain([0, max_count + 4])
					.range([height, 0]);
				d3.select("#myyscale").remove();
				svg.append("g").attr("id", "myyscale").call(d3.axisLeft(y));

				// color palette = one color per subgroup
				const color = d3
					.scaleOrdinal()
					.domain(subgroups)
					.range([
						"#3498db",
						"#e74c3c",
						"#e67e22",
						"#95a5a6",
						"#2ecc71",
					]);

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
					.attr("class", (d) => "myRect " + d.key)
					.selectAll("rect")
					.data((d) => d)
					.join("rect")
					.attr(
						"x",
						(d) =>
							x(d.data.group) +
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
						d3.selectAll(`[class*="${subGroupName}"]`).style(
							"opacity",
							1
						);

						const subgroupValue = d.data[subGroupName];
						const sexe = index == 0 ? "homme" : "femme";
						rec.attr("opacity", 0.8);
						tooltip
							.attr("opacity", 1)
							.text(
								subGroupName +
									"(" +
									sexe +
									")" +
									" : " +
									subgroupValue
							);
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
						d3.selectAll(".myRect").style("opacity", 1);
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

				for (let i = 0; i < data.length; i++) {
					temp = data[i];
					groupname = temp.group;
					console.log(temp);
					console.log(groupname);
					delete temp.group;
					piecreator(groupname, temp, i);
				}
			});
		});
	}

	//We attach to the buttons the event handler for changing between health states
	button1.addEventListener("click", handleClick);
	button2.addEventListener("click", handleClick);
	button3.addEventListener("click", handleClick);
	button4.addEventListener("click", handleClick);
	button5.addEventListener("click", handleClick);

	//We trigger the event click for the first button to generate a chart when landing on the visualisation
	button1.click();
}

//=============================================
// the PIE CHART
//=============================================

function piecreator(groupname, data, i) {
	const width = 300,
		height = 300,
		margin = 40;

	// The radius of the pie plot is half the width or half the height (smallest one). I subtract a bit of margin.
	const radius = Math.min(width, height) / 2 - margin;

	// Append the svg object to the div called 'my_dataviz'
	d3.select("#piesvg" + i).remove();
	const svg = d3
		.select("#piediv")
		.append("svg")
		.attr("width", width)
		.attr("height", height)
		.attr("id", "piesvg" + i)
		.append("g")
		.attr("transform", `translate(${width / 2}, ${height / 2})`);

	// Add a border to the pie chart
	svg.append("circle")
		.attr("r", radius + 5)
		.style("stroke", "black")
		.style("fill", "none");

	// We add the group names
	d3.select("#groupname" + i).remove();
	svg.append("text")
		.attr("id", "groupname" + i)
		.attr("x", 0)
		.attr("y", height / 2)
		.style("font-size", "14px")
		.style("font-weight", "bold") // Make the group name bold
		.attr("alignment-baseline", "middle")
		.attr("font-family", "sans-serif")
		.text(groupname);

	// Set the color scale
	const color = d3
		.scaleOrdinal()
		.range([
			"#0A2DC7",
			"#3979AA",
			"#009DFF",
			"#8CD8F3",
			"#71062D",
			"#D2002D",
			"#B83CDB",
			"#FA86F2",
		]);

	// List of all categories with non-zero values
	const categories = Object.keys(data).filter(
		(key) => key !== "group" && +data[key] !== 0
	);

	// Create an array with values for each non-zero category
	const pieData = categories.map((category) => [category, +data[category]]);

	// Compute the position of each group on the pie
	const pie = d3.pie().value(function (d) {
		return d[1];
	});
	const data_ready = pie(pieData);

	// Shape helper to build arcs
	const arcGenerator = d3.arc().innerRadius(0).outerRadius(radius);

	// Build the pie chart
	svg.selectAll("mySlices")
		.data(data_ready)
		.join("path")
		.attr("d", arcGenerator)
		.attr("fill", function (d) {
			return color(d.data[0]);
		})
		.attr("stroke", "black")
		.style("stroke-width", "2px")
		.style("opacity", 0.7);

	// Add the category names as labels
	svg.selectAll("mySlices")
		.data(data_ready)
		.join("text")
		.text(function (d) {
			return d.data[0];
		})
		.attr("transform", function (d) {
			return `translate(${arcGenerator.centroid(d)})`;
		})
		.style("text-anchor", "middle")
		.style("font-size", 12);
}