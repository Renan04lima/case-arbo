import {
  CreateRealEstate,
  setupCreateRealEstate,
} from '@/domain/use-cases/create-real-estate'
import { CreateRealEstateRepository } from '@/domain/contracts/repos/real-estate-repo'
import { RealEstate } from '@/domain/entities/real-estate'

import { MockProxy, mock } from 'jest-mock-extended'

describe('CreateRealEstate UseCase', () => {
  let realEstateRepo: MockProxy<CreateRealEstateRepository>
  let sut: CreateRealEstate
  let fakeRealEstate: RealEstate

  beforeAll(() => {
    realEstateRepo = mock()
  })

  beforeEach(() => {
    sut = setupCreateRealEstate(realEstateRepo)
  })

  it('should call CreateRealEstateRepository with correct params', async () => {
    await sut(fakeRealEstate)

    expect(realEstateRepo.create).toHaveBeenCalledWith(fakeRealEstate)
    expect(realEstateRepo.create).toHaveBeenCalledTimes(1)
  })
})
