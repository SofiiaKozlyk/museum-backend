import { Test, TestingModule } from '@nestjs/testing';
import { ExhibitsController } from './exhibits.controller';

describe('ExhibitsController', () => {
  let controller: ExhibitsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExhibitsController],
    }).compile();

    controller = module.get<ExhibitsController>(ExhibitsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
