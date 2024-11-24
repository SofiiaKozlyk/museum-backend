import { Test, TestingModule } from '@nestjs/testing';
import { ExhibitsService } from './exhibits.service';

describe('ExhibitsService', () => {
  let service: ExhibitsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExhibitsService],
    }).compile();

    service = module.get<ExhibitsService>(ExhibitsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
