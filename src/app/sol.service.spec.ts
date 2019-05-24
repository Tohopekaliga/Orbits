import { TestBed, inject } from '@angular/core/testing';
import { Observable, of } from 'rxjs';

import { SolService } from './sol.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SolService', () => {
  let service: SolService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SolService],
      imports: [HttpClientTestingModule]
    });
  });

  it('should be created', inject([SolService], (service: SolService) => {
    expect(service).toBeTruthy();
  }));
});
