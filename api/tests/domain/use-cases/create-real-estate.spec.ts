import {
  CreateRealEstate,
  setupCreateRealEstate,
} from '@/domain/use-cases/create-real-estate'
import { CreateRealEstateRepository } from '@/domain/contracts/repos/real-estate-repo'
import { RealEstate, TYPES_OF_REAL_ESTATE } from '@/domain/entities/real-estate'

import { MockProxy, mock } from 'jest-mock-extended'

describe('CreateRealEstate UseCase', () => {
  let realEstateRepo: MockProxy<CreateRealEstateRepository>
  let sut: CreateRealEstate
  let fakeRealEstate: RealEstate

  beforeAll(() => {
    fakeRealEstate = {
      id: 'any_id',
      address: {
        zipcode: '12345-678',
        street: 'Main Street',
        number: 123,
        complement: 'Apt 4B',
        neighborhood: 'Downtown',
        city: 'New York',
        state: 'NY',
      },
      type: TYPES_OF_REAL_ESTATE.APARTMENT,
      value: 100000,
      image_url: 'https://example.com/image.jpg',
    }
    realEstateRepo = mock()
    realEstateRepo.create.mockResolvedValue(fakeRealEstate)
  })

  beforeEach(() => {
    sut = setupCreateRealEstate(realEstateRepo)
  })

  it('should call CreateRealEstateRepository with correct params', async () => {
    await sut(fakeRealEstate)

    expect(realEstateRepo.create).toHaveBeenCalledWith(fakeRealEstate)
    expect(realEstateRepo.create).toHaveBeenCalledTimes(1)
  })

  it('should return a RealEstate on success', async () => {
    const result = await sut(fakeRealEstate)

    expect(result).toEqual(fakeRealEstate)
  })
})
