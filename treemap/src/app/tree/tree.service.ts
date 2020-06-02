import {Injectable} from "@angular/core";
import {Edge, Node} from "@swimlane/ngx-graph";
import {Subject} from "rxjs";
import {timeout} from "rxjs/operators";
import {async} from "@angular/core/testing";

@Injectable({ providedIn: 'root' })
export class TreeService {
  public nodes: Node[] = [];
  public links: Edge[] = [];
  binaryArray: number[] = [];
  duplicates = false;
  bfsArray: string[] = [];

  numbers: number[] = [];
  nodesChange = new Subject<Node[]>();
  linksChange = new Subject<Edge[]>();
  message = new Subject<string>();
  warningMsg = new Subject<string>();
  running = new Subject<boolean>();
  numbersChange = new Subject<number[]>();
  update$: Subject<any> = new Subject();


  generateEdges(){
    this.running.next(true);
    this.generateEdgesRecursive(this.numbers,0,this.numbers.length-1, null);
    this.linksChange.next(this.links.slice());
    this.running.next(false);
  }

  generateEdgesRecursive(array: number[], startIdx:number, endIdx:number, prev:number){
    if(endIdx< startIdx) {
      return null;
    }
    let midIdx = Math.floor(Math.fround((startIdx + endIdx) / 2));
    this.binaryArray.push(array[midIdx])
    if(prev!=null) {
      this.links.push(
        {
          source: this.nodes[prev].id,
          target: this.nodes[midIdx].id
        }
      )
    }
    this.generateEdgesRecursive(array, startIdx, midIdx-1,midIdx);
    this.generateEdgesRecursive(array,midIdx+1,endIdx,midIdx);
  }

  //Unstructured BST
  generateUnstructuredEdges(){
    this.generateUnstructuredEdgesRecursive(this.numbers,0,this.numbers.length-1, null,0);
    this.linksChange.next(this.links.slice());
    this.message.next('Unbalanced BST was generated.')
  }
  generateUnstructuredEdgesRecursive(array: number[], startIdx:number, endIdx:number, prev:number, iteration: number){
    if (endIdx < startIdx) {
      return null;
    }
    let midIdx = 0;
    if (prev === null) {
      midIdx = Math.floor(Math.fround((startIdx + endIdx) / 2));
    } else if (iteration === 1) {
      if (this.numbers.length > 10) {
        midIdx = endIdx - 1;
      } else {
        midIdx = endIdx;
      }
    } else {
      midIdx = Math.floor(Math.fround((startIdx + endIdx) / 2));
    }
    this.binaryArray.push(array[midIdx])
    if (prev != null) {
      this.links.push(
        {
          source: this.nodes[prev].id,
          target: this.nodes[midIdx].id
        }
      )
    }
    this.generateUnstructuredEdgesRecursive(array, startIdx, midIdx - 1, midIdx, iteration + 1);
    this.generateUnstructuredEdgesRecursive(array, midIdx + 1, endIdx, midIdx, iteration + 1);
  }

  generateNodes(size : number, duplicates: boolean){
    this.duplicates = duplicates;
    for (let i = 1; i < size; i++) {
      let randomNum = Math.floor(Math.random() * 100) + 1
      this.numbers.push(randomNum);
    }

    this.nodeGenerator();
  }

  clearData() {
    this.nodes = [];
    this.links = [];
    this.numbers = [];
    this.binaryArray = [];
    this.bfsArray =[];
    this.message.next(null);
  }

  clearNodeColors(){
    for(let node of this.nodes){
      node.meta.color = 'white';
    }
  }

  find(number: number, unstructured: boolean) {
    this.running.next(true);
    this.clearNodeColors();
    this.findRecursive(this.numbers,number,0,this.numbers.length-1,0, unstructured);

  }

  // 1,2,3,4,5
  findRecursive(array:number[], find: number, leftIdx: number, rightIdx: number, iteration: number, unstructured: boolean){
    if(leftIdx>rightIdx){
      return null;
    }
    let midIdx = 0;
    if(iteration === 1 && unstructured === true) {
      if (this.numbers.length > 10) {
        midIdx = rightIdx - 1;
      } else {
        midIdx = rightIdx;
      }
    }else{
      midIdx = Math.floor(Math.fround((leftIdx + rightIdx) / 2));
    }
    if(find === array[midIdx]){
      this.updateNode(midIdx, '#ACECD5');
      this.update$.next(true);
      this.message.next('Node '+find+' was found in BST.')
      return;
    }else{
      this.updateNode(midIdx,'#FFB9B3');
      if(find<array[midIdx]){
        setTimeout(()=> {
          this.findRecursive(array, find, leftIdx, midIdx - 1, iteration + 1, unstructured);
          this.update$.next(true);
        },750,this.update$.next(true));
      }else{
        setTimeout(()=> {
          this.findRecursive(array,find,midIdx+1,rightIdx, iteration+1, unstructured);
          this.update$.next(true);
        },750,this.update$.next(true));
      }
    }
  }

  findMax(unstructured: boolean) {
    this.running.next(true);
    this.clearNodeColors();
    this.findRecursive(this.numbers,Math.max(...this.numbers),0,this.numbers.length-1,0, unstructured);
    this.message.next('Max node found: '+Math.max(...this.numbers))
    this.running.next(false);
  }

  findMin(unstructured: boolean) {
    this.running.next(true);
    this.clearNodeColors();
    this.findRecursive(this.numbers,Math.min(...this.numbers),0,this.numbers.length-1,0, unstructured);
    this.message.next('Min node found: '+Math.min(...this.numbers));
    this.running.next(false);
  }


  async updateNode(index: number, color: string) {
    return new Promise(resolve => {
      setTimeout(() => {
        setTimeout(() => {
          this.nodes[index].meta.color = color;
        }, 500, this.update$.next(true));
        this.nodes[index].meta.color = '#FFF9AA';
      }, 500, this.update$.next(true));
    });
  }

  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  generateNodesManual(manualNumbers: number[], duplicates: boolean) {
    this.numbers = manualNumbers;
    this.duplicates = duplicates;
    this.nodeGenerator();
    this.message.next('Manual tree was generated.')
  }


  private nodeGenerator(){
    this.running.next(true);
    let prev = 0;
    this.numbers.sort(((n1,n2) => n1 - n2));
    if(!this.duplicates){
      this.numbers = this.numbers.filter((elem, i, arr) => {
        if (arr.indexOf(elem) === i) {
          return elem
        }
      })
    }
    for (let i = 0; i < this.numbers.length; i++) {
      if (i - 1 >= 0) {
        prev = this.numbers[i - 1];
      }
      if (prev === this.numbers[i]) {
        this.nodes.push(
          {
            id: this.numbers[i].toString()+'-1',
            label: this.numbers[i].toString(),
            meta: {color: 'white'}
          }
        );
        //this.update$.next(true);
      } else {
        this.nodes.push(
          {
            id: this.numbers[i].toString(),
            label: this.numbers[i].toString(),
            meta: {color: 'white'}
          }
        );
        //this.update$.next(true);
      }
    }
    this.nodesChange.next(this.nodes.slice());
    this.numbersChange.next(this.numbers.slice());
    this.running.next(false);
    return this.nodes.slice();
  }

  remove(formValue: number, unstructured: boolean) {
    this.running.next(true);
    let array: number[] = [];
    for (let i = 0; i < this.numbers.length; i++) {
      if(formValue === this.numbers[i]){
      }else{
        array.push(this.numbers[i]);
      }
    }
    this.numbers = array;
    this.numbers.sort(((n1,n2) => n1 - n2));
    this.nodes = [];
    this.links = [];
    this.nodeGenerator();
    if(unstructured){
      this.generateUnstructuredEdges();
    }else{
      this.generateEdges();
    }
    this.nodesChange.next(this.nodes.slice());
    this.linksChange.next(this.links.slice());
    this.message.next('Node '+formValue+' was removed from BST.')
    this.running.next(false);
  }

  add(number: number, unstructured:boolean) {
    this.running.next(true);
    this.numbers.push(number);
    this.numbers.sort(((n1,n2) => n1 - n2));
    this.nodes = [];
    this.links = [];
    this.nodeGenerator();
    if(unstructured){
      this.generateUnstructuredEdges();
    }else{
      this.generateEdges();
    }
    this.nodesChange.next(this.nodes.slice());
    this.linksChange.next(this.links.slice());
    this.message.next('Node '+number+' was added to BST.');
    this.running.next(false);
  }

  calculateBfsSum(){
    this.running.next(true);
    var queue = [];
    let head = this.links[0].source;
    queue.push(head);
    this.bfsArray.push(head);
    while(queue.length != 0) {
      let i = queue.shift();
      for (let link of this.links) {
        if (link.source === i){
          this.bfsArray.push(link.target);
          queue.push(link.target);
        }
      }
    }
    this.recursiveBfsUpdate(this.bfsArray.slice(), 0);
    this.running.next(false);
  }

  recursiveBfsUpdate(array: string[],sum: number){
    if(array.length === 0){
      return;
    }
    let node = this.getNodeByLabel(array[0]);
    sum += +array[0];
    this.message.next('Breadth first search sum: '+sum);
    this.updateNode(this.nodes.indexOf(node),'#ACECD5');
    array.splice(0,1);

    setTimeout(() => {
      this.recursiveBfsUpdate(array, sum);
      this.update$.next(true)
    },750,this.update$.next(true))
  }


  calculateDfsSum() {
    console.log(this.binaryArray);
    this.recursiveDfsUpdate(this.binaryArray.slice(), 0);
  }

  recursiveDfsUpdate(array: number[],sum: number){
    if(array.length === 0){
      return;
    }
    let node = this.getNodeByLabel(array[0].toString());
    sum += +array[0];
    this.message.next('Depth first search sum: '+sum);
    this.updateNode(this.nodes.indexOf(node),'#ACECD5');
    array.splice(0,1);

    setTimeout(() => {
      this.recursiveDfsUpdate(array, sum);
      this.update$.next(true)
    },750,this.update$.next(true))
  }

  getNodeByLabel(label: string){
    for(let node of this.nodes){
      if(node.label === label){
        return node;
      }
    }
  }
}
