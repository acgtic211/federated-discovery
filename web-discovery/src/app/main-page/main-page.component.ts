import { Component, OnInit } from '@angular/core';
import { DiscoverService } from '../discover.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import * as d3 from 'd3';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {
  typingEnded = new Subject<string>();
  searchResult: any = {};
  hops: number = 5;
  treshold: number = 5;
  timeLimit: number = 200;
  typesOfSearch: string[] = ['Broadcast', '1st Serve', 'Recommended Path'];
  queryTypesOfSearch: string[] = ['broadcast', 'first', 'recommended'];
  selectedTypeSearch = 0;
  selectedTab = 'D';
  selectedNode= 'http://127.0.0.1:3021';

  constructor(private discoverService: DiscoverService, private router: Router) { }

  ngOnInit(): void {
    this.typingEnded.pipe(
      debounceTime(1000)  // adjust the delay as needed
    ).subscribe(value => {
      this.processSearch(value);
    });
    this.getPath();
  }

  processSearch(sentence: string)
  {
    if(this.selectedTab === 'AI')
    {
      this.discoverDevices(sentence);
    }else {
      this.searchDevices(sentence);
    }
  }

  discoverDevices(sentence: string)
  {
    this.searchResult = {};
    this.discoverService.getPrediction(this.selectedNode + '/api', sentence, this.hops, this.timeLimit, this.queryTypesOfSearch[this.selectedTypeSearch], this.treshold).subscribe((data: any) => {
      this.searchResult = data;
      if(this.searchResult.prediction) this.searchResult.prediction = this.searchResult.prediction.reverse();
    });
  }

  searchDevices(sentence: string)
  {
    this.searchResult = {};
    this.discoverService.getDevices(this.selectedNode + '/api', sentence, this.hops, this.timeLimit, this.queryTypesOfSearch[this.selectedTypeSearch]).subscribe((data: any) => {
      this.searchResult = data;
      this.searchResult.prediction?.reverse(); // Invert the order of the data
      console.log(this.searchResult)
    });
  }

  setHops(num: string) {
    this.hops = parseInt(num);
  }

  //Static code for testing. Sets a number instead of showing the node url.
  getNodeNumber(node: any) {
    if (node.includes('3033')) {
      return 7;

    } else if (node.includes('3031')) {
      return 6;

    }else if (node.includes('3029')) {
      return 5;

    }else if (node.includes('3027')) {
      return 4;

    }else if (node.includes('3025')) {
      return 3;

    }else if (node.includes('3023')) {
      return 2;

    }else if (node.includes('3021')) {
      return 1;
    }

    return 0;
  }


  getPath() {
    this.discoverService.getFederation().subscribe((data: any) => {
      console.log(data);
      if(data) {
        this.loadPath(data);
      }
    });
  }
  
  loadPath(data: any) {

    // Fetch the JSON data
    /*fetch('/assets/paths.json')
    .then(response => response.json())
    .then(data => {*/
      // Create an array of nodes
      const nodes = Object.values(data).map((value: any, index) => ({
        id: value.address, // Use the index as the id
        name: value.name
      })).filter((node: any) => node.name !== 'central-server'); // Filter out nodes with name 'central-server'


      // Create an array of nodes
      const centralServerAddress = Object.values(data).map((value: any, index) => {
        if (value.name === 'central-server') {
          return value.address;
        }
      }).filter((address: any) => address !== undefined)[0];

      // Create an array of links
      const links = Object.values(data).map((value: any) =>
        value.linkedDiscoveries.map((target: any) => ({
          source: value.address, // Use the index as the source
          target: target, // Use the connected node as the target
          // Add more properties here
        })).filter((link: any) => link.target !== centralServerAddress)
      ).reduce((acc, val) => acc.concat(val), []); // Fix: Use reduce instead of flat


      // Create a new JSON object
      const newData = { nodes, links };

      // Convert the new JSON object to a string
      const newDataString = JSON.stringify(newData, null, 2);

             // Create a SVG element
      const svg = d3.select('#graph').append('svg')
      .attr('width', 1000)
      .attr('height', 600);

    const simulation = d3.forceSimulation(nodes as d3.SimulationNodeDatum[])
      .force('link', d3.forceLink(links).id((d: any) => d.id).distance(200))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(1000 / 2, 600 / 2))
      .force('collide', d3.forceCollide().radius(40)); // Prevent nodes from overlapping


  // Create nodes
  const node = svg.append('g')
    .selectAll('circle')
    .data(nodes)
    .enter().append('g');

  const circles = node.append('circle')
    .attr('r', 22)
    .attr('fill', '#295151')
    .classed('selectable', true) // Add the 'selectable' class to the circles
    .on('click', (d) => { // Add a click event listener to the circles
      this.selectedNode = d.target.__data__.id; // Set selectedNode to the id of the clicked circle
      circles.style('fill', (d) => { // Change the color of the circles based on whether they're selected
        return d.id === this.selectedNode ? '#699d9d' : 'rgb(41, 81, 81)';
      });
    });

    const selectedNode = this.selectedNode;

    // After creating the circles
    circles.each(function(d) {
      if (d.id === selectedNode) { // If the id of d.target.__data__.id is equal to the id attribute
        d3.select(this).style('fill', '#699d9d'); // Change the color of the circle to a lighter color
      }
    });

  const labels = node.append('text')
    .text(d => d.name)
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'central')
    .attr('fill', 'white') // Change the color of the text labels to white
    .classed('selectable', true) // Add the 'selectable' class to the circles
    .on('click', (d) => { // Use an arrow function to preserve the context of `this`
      this.selectedNode = d.target.__data__.id; // Set selectedNode to the id of the clicked circle
      circles.style('fill', (d) => { // Change the color of the circles based on whether they're selected
        return d.id === this.selectedNode ? '#699d9d' : 'rgb(41, 81, 81)';
      });
    });

  // Create links
  const link = svg.append('g')
    .selectAll('line')
    .data(links)
    .enter().append('line')
    .attr('stroke', 'black');

  // Update the positions of the nodes and links on each tick
  simulation.on('tick', () => {
    link
      .attr('x1', (d: any) => d.source.x)
      .attr('y1', (d: any) => d.source.y)
      .attr('x2', (d: any) => d.target.x)
      .attr('y2', (d: any) => d.target.y);

    circles
      .attr('cx', (d: any) => d.x)
      .attr('cy', (d: any) => d.y);

    labels
      .attr('x', (d: any) => d.x)
      .attr('y', (d: any) => d.y);
  });



  }

}
