import {Component, OnDestroy, OnInit} from '@angular/core';
import {Edge, Node} from "@swimlane/ngx-graph";
import {Subscription} from "rxjs";
import {TreeService} from "./tree.service";
import {FormGroup} from "@angular/forms";
import * as shape from 'd3-shape';
import {SettingService} from "../settings/setting.service";

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.css'],
})
export class TreeComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  color: 'red';
  duplicates = false;
  public nodes: Node[] = [];
  public links: Edge[] = [];
  public numbers: number[] = [];
  size: number;
  form: FormGroup;
  curve = shape.curveBundle.beta(1.2);
  update$;

  settings ={
    orientation: 'TB',
    marginX: 100,
    marginY: 50,
    edgePadding: 50,
    rankPadding: 80,
    nodePadding: 90,
    compound: false,
    multigraph: false,
    acyclicer: 'greedy',
    ranker: 'tight-tree'
  }

  constructor(private treeService : TreeService, private settingService:SettingService) { }

  ngOnInit(): void {
    this.subscription = this.treeService.nodesChange
      .subscribe(
        (nodes: Node[]) => {
          this.nodes = nodes;
        }
      );
    this.subscription = this.treeService.linksChange
      .subscribe(
        (links: Edge[]) => {
          this.links = links;
        }
      );
    this.subscription = this.treeService.numbersChange
      .subscribe(
        (numbs: number[]) => {
          this.numbers = numbs;
        }
      );
    this.subscription = this.treeService.update$
      .subscribe(
        (update: number[]) => {
          this.update$ = update;
        }
      );
    this.settingService.generateDefaultTree(20);
    //this.treeService.update$.next(true);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
