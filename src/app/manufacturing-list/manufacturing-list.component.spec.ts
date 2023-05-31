import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufacturingListComponent } from './manufacturing-list.component';

describe('ManufacturingListComponent', () => {
  let component: ManufacturingListComponent;
  let fixture: ComponentFixture<ManufacturingListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManufacturingListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManufacturingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
