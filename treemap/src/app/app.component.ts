import {Component, OnInit} from '@angular/core';
import {Layout, Edge, Node, DagreNodesOnlyLayout} from '@swimlane/ngx-graph';
import * as shape from 'd3-shape';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  ngOnInit(): void {
  }

}
