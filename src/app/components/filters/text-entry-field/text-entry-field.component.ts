import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-text-entry-field',
  templateUrl: './text-entry-field.component.html',
  styleUrls: ['./text-entry-field.component.css']
})
export class TextEntryFieldComponent {
  userInput: string = '';
  @Input() targetOfData!: string;

  @Input() setFilterFunction!: (string: string) => void
  


  onInputChange() {
    console.log('User input:', this.userInput);
    this.setFilterFunction(this.userInput)
  }

}
