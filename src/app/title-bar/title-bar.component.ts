import { Component, OnInit } from '@angular/core';
import { ElectronService } from '../core/services';

@Component({
  selector: 'app-title-bar',
  templateUrl: './title-bar.component.html',
  styleUrls: ['./title-bar.component.scss']
})
export class TitleBarComponent implements OnInit {

  constructor(
    private electronService: ElectronService
  ) { }

  ngOnInit(): void {
  }

  close(): void {
    this.electronService.requestClose();
  }

  minimize(): void {
    this.electronService.requestMinimize();
  }
}
