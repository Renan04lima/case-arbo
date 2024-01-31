import { RealEstate } from '@/domain/entities/real-estate'

export interface CreateRealEstateRepository {
  create: (
    params: CreateRealEstateRepository.Params,
  ) => Promise<CreateRealEstateRepository.Result>
}

export namespace CreateRealEstateRepository {
  export type Params = Omit<RealEstate, 'id'>

  export type Result = RealEstate
}
