import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ExpandingSearchBoxComponent } from './expanding-search-box.component';

describe('ExpandingSearchBoxComponent', () => {
  let component: ExpandingSearchBoxComponent;
  let fixture: ComponentFixture<ExpandingSearchBoxComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ExpandingSearchBoxComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpandingSearchBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
