import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FlowData } from '../../../../models/flow-data';

@Component({
  selector: 'app-recap-step',
  imports: [],
  templateUrl: './recap-step.html',
  styleUrl: './recap-step.scss',
})
export class RecapStep {
  @Input({required: true}) flowType!: 'creating' | 'joining';
  @Input({required: true}) flowData!: FlowData

  @Output() confirmed = new EventEmitter<void>();
}
