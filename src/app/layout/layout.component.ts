import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ApiDataService } from '../services/api-data.service';
import { first } from 'rxjs';
import { QUERY_PARAM_SYMBOL } from '../constants';

@Component({
  selector: 'layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  constructor(private route: ActivatedRoute, private apiDataService: ApiDataService) { }

  ngOnInit() {
    this.route.queryParams.pipe(first()).subscribe((params: Params): void => {
      if (params[QUERY_PARAM_SYMBOL]) {
        this.apiDataService.selectedSymbol.next(params[QUERY_PARAM_SYMBOL]);
      }
    })
  }
}
