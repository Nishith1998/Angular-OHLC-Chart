import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SymbolTableComponent } from './symbol-table.component';

describe('SymbolTableComponent', () => {
  let component: SymbolTableComponent;
  let fixture: ComponentFixture<SymbolTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SymbolTableComponent]
    });
    fixture = TestBed.createComponent(SymbolTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
