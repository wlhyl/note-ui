import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-chips',
    templateUrl: './chips.component.html',
    styleUrls: ['./chips.component.scss'],
    standalone: false
})
export class ChipsComponent implements OnInit {
  @Input()
  placeholder="Enter text and hit ',' Key."
  
  @Input()
  values: Array<string> = [];

  @Output()
  valuesChange = new EventEmitter<Array<string>>();

  value = '';

  constructor() {}

  ngOnInit(): void {}

  drop(index: number) {
    this.values.splice(index, 1);
    this.valuesChange.emit(this.values);
  }

  onValueKeydown() {
    if (this.value === '') return;
    let value = this.value.split(',')[0];
    if (value === '') {
      this.value = '';
      return;
    }
    this.values.push(value);
    this.values = [...new Set(this.values)];
    this.valuesChange.emit(this.values);
    this.value = '';
  }

  remove() {
    if (this.value.length > 0) return;
    if (this.values.length === 0) return;
    this.values.pop();
    this.valuesChange.emit(this.values);
  }
}
