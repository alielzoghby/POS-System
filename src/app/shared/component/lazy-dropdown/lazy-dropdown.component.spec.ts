/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LazyDropdownComponent } from './lazy-dropdown.component';

describe('LazyDropdownComponent', () => {
  let component: LazyDropdownComponent;
  let fixture: ComponentFixture<LazyDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
    imports: [LazyDropdownComponent]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LazyDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
