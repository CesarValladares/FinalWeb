import {TestBed} from '@angular/core/testing';

import {ClientService} from '../clientServices/client.service';

describe('ClientService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('shoul be created', () => {
    const service: ClientService = TestBed.get(ClientService);
    expect(service).toBeTruthy();
  });
});
