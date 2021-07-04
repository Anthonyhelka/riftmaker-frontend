import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhoopsComponent } from './whoops.component';

describe('WhoopsComponent', () => {
  let component: WhoopsComponent;
  let fixture: ComponentFixture<WhoopsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WhoopsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WhoopsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
