import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VispdfComponent } from './vispdf.component';

describe('VispdfComponent', () => {
  let component: VispdfComponent;
  let fixture: ComponentFixture<VispdfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VispdfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VispdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
