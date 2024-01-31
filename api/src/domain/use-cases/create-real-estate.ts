import { CreateRealEstateRepository } from '../contracts/repos/real-estate-repo'

type Params = CreateRealEstateRepository.Params
type Result = void

export type CreateRealEstate = (input: Params) => Promise<Result>

export type Setup = (
  realEstateRepo: CreateRealEstateRepository,
) => CreateRealEstate

export const setupCreateRealEstate: Setup =
  (realEstateRepo) => async (data) => {
    await realEstateRepo.create(data)
  }
