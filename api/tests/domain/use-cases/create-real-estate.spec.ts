import {
  CreateRealEstate,
  setupCreateRealEstate,
} from '@/domain/use-cases/create-real-estate'
import { CreateRealEstateRepository } from '@/domain/contracts/repos/real-estate-repo'
import { RealEstate, TYPES_OF_REAL_ESTATE } from '@/domain/entities/real-estate'
import { UploadImages } from '@/domain/contracts/gateways/upload-images'

import { MockProxy, mock } from 'jest-mock-extended'

describe('CreateRealEstate UseCase', () => {
  let realEstateRepo: MockProxy<CreateRealEstateRepository>
  let uploadImages: MockProxy<UploadImages>
  let sut: CreateRealEstate
  let fakeRealEstateData: Omit<RealEstate, 'id' | 'images_url'>
  let fakeRealEstate: RealEstate
  let images_url: string[]

  beforeAll(() => {
    images_url = ['https://example.com/image.jpg']
    fakeRealEstateData = {
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
      user_id: 'any_user_id',
    }
    fakeRealEstate = {
      ...fakeRealEstateData,
      id: 'any_id',
      images_url,
    }
    realEstateRepo = mock()
    uploadImages = mock()
    realEstateRepo.create.mockResolvedValue(fakeRealEstate)
    uploadImages.upload.mockResolvedValue(images_url)
  })

  beforeEach(() => {
    sut = setupCreateRealEstate(realEstateRepo, uploadImages)
  })

  it('should call CreateRealEstateRepository with correct params', async () => {
    await sut({
      ...fakeRealEstateData,
      files: [{ buffer: Buffer.from('any_buffer'), mimetype: 'image/jpg' }],
    })

    expect(realEstateRepo.create).toHaveBeenCalledWith({
      ...fakeRealEstateData,
      images_url,
    })
    expect(realEstateRepo.create).toHaveBeenCalledTimes(1)
  })

  it('should call UploadImages with correct params', async () => {
    await sut({
      ...fakeRealEstate,
      files: [{ buffer: Buffer.from('any_buffer'), mimetype: 'image/jpg' }],
    })

    expect(uploadImages.upload).toHaveBeenCalledWith([
      { buffer: Buffer.from('any_buffer'), mimetype: 'image/jpg' },
    ])
    expect(uploadImages.upload).toHaveBeenCalledTimes(1)
  })

  it('should return a RealEstate on success', async () => {
    const result = await sut({
      ...fakeRealEstate,
      files: [{ buffer: Buffer.from('any_buffer'), mimetype: 'image/jpg' }],
    })

    expect(result).toEqual(fakeRealEstate)
  })
})
