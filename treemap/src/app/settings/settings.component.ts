import { Component, OnInit } from '@angular/core';
import {TreeService} from "../tree/tree.service";
import {Edge, Node} from "@swimlane/ngx-graph";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Subject, Subscription} from "rxjs";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  subscription: Subscription;
  color: 'red';
  enableArrayEdit = false;
  unstructured = false;
  duplicates = false;
  public nodes: Node[] = [];
  public links: Edge[] = [];
  public numbers: number[] = [];
  public manualNumbers: number[] = [];
  size: number;
  form: FormGroup;
  update$;
  running:boolean = false;

  getIfRunning(){
    return this.running;
  }

  constructor(private treeService: TreeService) {
  }

  ngOnInit(): void {
    this.intiForm();
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
  }

  intiForm(){
    let size = 0;
    this.form = new FormGroup(
      {
        size: new FormControl(20,[Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)]),
        search: new FormControl(null,[Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)]),
        add: new FormControl(null,[Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)]),
        remove: new FormControl(null,[Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)]),
        numberArray: new FormControl({value: 0, disabled:true},[Validators.required, Validators.pattern(/^[1-9,]+[0-9,]*$/)])
      }
    )

  }

  generateTree(size:number) {
    this.treeService.clearData();
    if(this.duplicates && (size>20 || this.numbers.length>20)){
      this.treeService.warningMsg.next('If duplicates is enables, tree can not be bigger than 20');
      return;
    }
    if(this.enableArrayEdit){
      this.getManualNumbersFromForm()
      this.treeService.generateNodesManual(this.manualNumbers, this.duplicates);
    }else {
      this.treeService.generateNodes(size, this.duplicates);
    }
    this.treeService.generateEdges();
    this.unstructured = false;
  }

  onGenerateTree(){
    this.generateTree(+this.form.value['size']);
  }



  generateUnstructuredTree() {
    this.treeService.clearData();
    if(this.duplicates && (+this.form.value['size'].length>20 || this.manualNumbers.length>20)){
      this.treeService.warningMsg.next('If duplicates is enables, tree can not be bigger than 20');
      return;
    }
    if(this.enableArrayEdit){
      this.getManualNumbersFromForm()
      this.treeService.generateNodesManual(this.manualNumbers, this.duplicates);
    }else {
      this.treeService.generateNodes(+this.form.value['size'], this.duplicates);
    }
    this.treeService.generateUnstructuredEdges();
    this.unstructured = true;
  }

  searchTree() {
    this.running = true;
    this.treeService.find(+this.form.value['search'], this.unstructured);
    this.enableForm(3000);
  }

  enableForm(time: number){
    setTimeout(() => {
    this.running = false;
    },time);
  }

  removeNode() {
    let formValue = this.form.value['remove'];
    this.treeService.remove(+formValue, this.unstructured);
  }

  addNode() {
    let formValue = this.form.value['add'];
    this.treeService.add(+formValue, this.unstructured);
  }


  findMax() {
    this.running = true;
    this.treeService.findMax(this.unstructured);
    this.enableForm(3000);
  }

  findMin() {
    this.running = true;
    this.treeService.findMin(this.unstructured);
    this.enableForm(3000);
  }

  enableArrayEditFunction() {
    if(this.enableArrayEdit === true){
      this.enableArrayEdit = false;
      this.form.controls['numberArray'].disable();
      this.form.controls['size'].enable();
    }else{
      this.enableArrayEdit = true;
      this.form.controls['numberArray'].enable();
      this.form.controls['size'].disable();
    }
  }


  enableDuplicates() {
    if(this.duplicates === true){
      this.duplicates = false;
    }else{
      this.treeService.warningMsg.next('Warning! Duplicates can cause problems when generating the tree.')
      this.duplicates = true;
    }
  }

  getManualNumbersFromForm(){
    if(this.form.value['numberArray'] != null) {
      this.manualNumbers = this.numbers.toString().split(",").map(x => +x)
    }
  }

  bfsSum() {
    this.running = true;
    this.treeService.clearNodeColors();
    this.treeService.calculateBfsSum();
    this.enableForm(this.nodes.length*750);
  }

  dfsSum() {
    this.running = true;
    this.treeService.clearNodeColors();
    this.treeService.calculateDfsSum();
    this.enableForm(this.nodes.length*750);
  }
}
