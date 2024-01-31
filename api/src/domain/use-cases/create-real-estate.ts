import { UploadImages } from '@/domain/contracts/gateways/upload-images'
import { CreateRealEstateRepository } from '@/domain/contracts/repos/real-estate-repo'

type Params = CreateRealEstateRepository.Params & {
  files: { buffer: Buffer; mimetype: string }[]
}
type Result = CreateRealEstateRepository.Result

export type CreateRealEstate = (input: Params) => Promise<Result>

export type Setup = (
  realEstateRepo: CreateRealEstateRepository,
  uploadImages: UploadImages,
) => CreateRealEstate

export const setupCreateRealEstate: Setup =
  (realEstateRepo, uploadImages) =>
  async ({ files, ...data }) => {
    await uploadImages.upload(files)

    return await realEstateRepo.create(data)
  }
