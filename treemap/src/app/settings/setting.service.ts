import {Injectable} from "@angular/core";
import {Subscription} from "rxjs";
import {Edge, Node} from "@swimlane/ngx-graph";
import {FormGroup} from "@angular/forms";
import {TreeService} from "../tree/tree.service";

@Injectable({ providedIn: 'root' })
export class SettingService{

  constructor(private treeService: TreeService) {
  }

  generateDefaultTree(size:number) {
    this.treeService.clearData();
    this.treeService.generateNodes(size, false);
    this.treeService.generateEdges();
    this.treeService.numbersChange.next(this.treeService.numbers);
  }

}
