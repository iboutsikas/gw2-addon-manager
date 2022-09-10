import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-addon-manager-initializer',
  templateUrl: './addon-manager-initializer.component.html',
  styleUrls: ['./addon-manager-initializer.component.scss']
})
export class AddonManagerInitializerComponent implements OnInit {

  constructor(route: ActivatedRoute) {
    route.queryParams.forEach(value => console.log('Params', value));
  }

  ngOnInit(): void {
  }

}
