import { TestBed } from '@angular/core/testing';

import { LoadGameService } from './load-game.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('LoadGameService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [LoadGameService],
    imports: [HttpClientTestingModule]
    }));

  it('should be created', () => {
    const service: LoadGameService = TestBed.get(LoadGameService);
    expect(service).toBeTruthy();
  });
});
