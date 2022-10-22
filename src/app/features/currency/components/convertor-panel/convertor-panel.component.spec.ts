import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { CurrencyApiService } from 'src/app/core/api/currency-api.service';
import { conversion } from 'src/app/mock/conversion';
import { ConvertorPanelComponent } from './convertor-panel.component';

describe('ConvertorPanelComponent', () => {
  let component: ConvertorPanelComponent;
  let fixture: ComponentFixture<ConvertorPanelComponent>;

  beforeEach(async () => {
    const routerStub = () => ({
      navigate: (array: any[]) => ({}),
      url: "localhot:4200/details"
    });

    await TestBed.configureTestingModule({
      declarations: [ConvertorPanelComponent],
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [{
        provide: Router, useFactory: routerStub
      }],
    })
      .compileComponents();
  });

  beforeEach(() => {

    fixture = TestBed.createComponent(ConvertorPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reset amount', () => {
    component.resetAmount();
    expect(component.amount.value).toEqual('');
  });
  it('should set default values to the form', () => {
    component.setDefaultValues();
    expect(component.from.value).toEqual('EUR');
    expect(component.to.value).toEqual('USD');
    expect(component.amount.value).toEqual('1');
  });
  it('should swap from and to values', () => {
    component.from.setValue('INR');
    component.to.setValue('USD');
    component.swapCurrencySymbols();
    expect(component.from.value).toEqual('USD');
    expect(component.to.value).toEqual('INR');
  });


  it('makes expected calls', () => {
    const routerStub: Router = fixture.debugElement.injector.get(Router);
    spyOn(routerStub, 'navigate').and.callThrough();
    component.redirectToDetails();
    expect(routerStub.navigate).toHaveBeenCalled();
  });

  it('makes expected calls for currency conversion', () => {
    const currencyApiServiceStub: CurrencyApiService = fixture.debugElement.injector.get(
      CurrencyApiService
    );
    spyOn(currencyApiServiceStub, 'getConversion').and.callThrough().and.returnValue(of(conversion));
    component.convert();
    expect(currencyApiServiceStub.getConversion).toHaveBeenCalled();
  });

});
