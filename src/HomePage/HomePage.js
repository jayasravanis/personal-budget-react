import React, { useEffect, useState } from 'react';
import Article from "../Article/Article";
import Chart from 'chart.js/auto';
import * as d3 from 'd3';
import axios from 'axios';

let chartInstance = null;

function createChart(dataSource) {
    const ctx = document.getElementById('myChart').getContext('2d');

    // If there is an existing chart instance, destroy it first
    if (chartInstance) {
        chartInstance.destroy();
    }

    // Create a new chart
    chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: dataSource,
    });
}
  

function createD3Chart(dataSource) {
    // Clear the existing SVG
    d3.select("#d3-chart").select("svg").remove();

    const width = 450, height = 300, margin = 10;
    const radius = Math.min(width, height) / 2 - margin;

    const svg = d3.select("#d3-chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const pie = d3.pie()
        .sort(null)
        .value(d => d.budget);

    const arc = d3.arc()
        .outerRadius(radius * 0.8)
        .innerRadius(radius * 0.4);

    const outerArc = d3.arc()
        .innerRadius(radius * 0.9)
        .outerRadius(radius * 0.9);

    const color = d3.scaleOrdinal()
        .domain(dataSource.map(d => d.title))
        .range(dataSource.map(d => d.color));

    // Pie chart slices
    const slices = svg.selectAll('path')
        .data(pie(dataSource))
        .enter()
        .append('path')
        .attr('d', arc)
        .attr('fill', d => color(d.data.title));

    // Lines container
    const lines = svg.append("g").attr("class", "lines");

    // Create and update polylines connecting labels to slices
    const polyline = lines.selectAll("polyline")
        .data(pie(dataSource), d => d.data.title);

    // Enter new polylines
    polyline.enter()
        .append("polyline")
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", 1)
        .merge(polyline) // Merge the entered selection with existing
        .transition()
        .duration(1000)
        .attrTween("points", function(d) {
            this._current = this._current || d; // Store the previous value
            const interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0); // Set initial value for next transition
            return function(t) {
                const d2 = interpolate(t);
                const pos = outerArc.centroid(d2);
                pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1); // Position for labels
                return [arc.centroid(d2), outerArc.centroid(d2), pos].join(","); // Return points
            };
        });

    // Exit old polylines
    polyline.exit()
        .remove();

    // Labels
    svg.selectAll('text')
        .data(pie(dataSource))
        .enter()
        .append('text')
        .attr('transform', d => {
            const pos = outerArc.centroid(d);
            pos[0] = radius * (midAngle(d) < Math.PI ? 1 : -1); // Position label
            return `translate(${pos})`;
        })
        .style('text-anchor', d => (midAngle(d) < Math.PI ? 'start' : 'end'))
        .text(d => d.data.title);

    function midAngle(d) {
        return d.startAngle + (d.endAngle - d.startAngle) / 2; // Calculate mid angle
    }
}



function HomePage() {
    const [budgetData, setBudgetData] = useState(null);
  
    const fetchBudgetData = () => {
      axios.get('http://localhost:3000/budget')
        .then((res) => {
          const data = res.data.myBudget;
          const dataSource = {
            datasets: [{
              data: data.map(item => item.budget),
              backgroundColor: data.map(item => item.color),
              borderColor: data.map(item => item.borderColor),
              borderWidth: 1,
            }],
            labels: data.map(item => item.title),
          };
          setBudgetData(dataSource);
          createChart(dataSource);
          createD3Chart(data)
        })
        .catch((err) => {
          console.error('Error fetching budget data', err);
        });
    };
  
    useEffect(() => {
      fetchBudgetData();
    }, []);

  return (
    <main className="container center" id="main">

        <section className="page-area">
            
            <Article title="Stay on track" text="Do you know where you are spending your money? Proper budget management depends on real data... and this app will help you with that!" />
            <Article title="Alerts" text="What if your clothing budget ended? You will get an alert. The goal is to never go over the budget." />
            <Article title="Results" text="People who stick to a financial plan, budgeting every expense, get out of debt faster! They also live happier lives." />
            <Article title="Free" text="This app is free!!! And you are the only one holding your data!" />
            <Article title="Stay on track" text="Do you know where you are spending your money? Proper budget management depends on real data... and this app will help you with that!" />
            <Article title="Alerts" text="What if your clothing budget ended? You will get an alert. The goal is to never go over the budget." />
            <Article title="Results" text="People who stick to a financial plan, budgeting every expense, get out of debt faster! They also live happier lives." />
            <Article title="Free" text="This app is free!!! And you are the only one holding your data!" />

            <article className="text-box">
                <h1>Pie Chart</h1>
                <canvas id="myChart" width="400" height="400"></canvas>
            </article>

            <article className="text-box">
                <h1>D3 Chart</h1>
                <div id="d3-chart" width="400" height="400"></div>
            </article>

        </section>

    </main>
  );
}

export default HomePage;

