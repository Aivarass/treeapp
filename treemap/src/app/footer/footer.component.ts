import {Component, OnDestroy, OnInit} from '@angular/core';
import {Node} from "@swimlane/ngx-graph";
import {TreeService} from "../tree/tree.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit, OnDestroy {
  message: string = null;
  warningMsg: string = null;
  subscription: Subscription;

  constructor(private treeService: TreeService) { }

  ngOnInit(): void {
    this.subscription = this.treeService.message
      .subscribe(
        (message) => {
          this.message = message;
        }
      );
    this.subscription = this.treeService.warningMsg
      .subscribe(
        (warningMsg) => {
          this.warningMsg = warningMsg;
        }
      );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
