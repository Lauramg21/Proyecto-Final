import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignarAccionComponent } from './asignar-accion.component';

describe('AsignarAccionComponent', () => {
  let component: AsignarAccionComponent;
  let fixture: ComponentFixture<AsignarAccionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsignarAccionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsignarAccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
