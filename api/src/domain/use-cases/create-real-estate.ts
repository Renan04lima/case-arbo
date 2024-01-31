import { CreateRealEstateRepository } from '../contracts/repos/real-estate-repo'

type Params = CreateRealEstateRepository.Params
type Result = CreateRealEstateRepository.Result

export type CreateRealEstate = (input: Params) => Promise<Result>

export type Setup = (
  realEstateRepo: CreateRealEstateRepository,
) => CreateRealEstate

export const setupCreateRealEstate: Setup =
  (realEstateRepo) => async (data) => {
    return await realEstateRepo.create(data)
  }
