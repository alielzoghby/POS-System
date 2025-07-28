/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { StateSectionComponent } from './state-section.component';

describe('StateSectionComponent', () => {
  let component: StateSectionComponent;
  let fixture: ComponentFixture<StateSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
    imports: [StateSectionComponent]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StateSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
