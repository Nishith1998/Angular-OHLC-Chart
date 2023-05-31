import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TickersTableComponent } from './tickers-table.component';

describe('TickersTableComponent', () => {
  let component: TickersTableComponent;
  let fixture: ComponentFixture<TickersTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TickersTableComponent]
    });
    fixture = TestBed.createComponent(TickersTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
