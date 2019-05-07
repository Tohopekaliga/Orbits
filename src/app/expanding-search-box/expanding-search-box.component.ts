import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'expanding-search-box',
  templateUrl: './expanding-search-box.component.html',
  styleUrls: ['./expanding-search-box.component.css']
})
export class ExpandingSearchBoxComponent {

  searching: boolean = false;

  @Input() searchResults;
  @Output() onSearch: EventEmitter<string> = new EventEmitter();
  @Output() selected: EventEmitter<any> = new EventEmitter();

  constructor() { }

  toggleSearch() {
    this.searching = !this.searching;
   
  }

  onKey(data:string) {
    this.onSearch.emit(data);
  }

  onBlur() {
    //this.searching = false;
  }

  onSelect(item) {
    this.selected.emit(item);
    this.searching = false;
  }

}
