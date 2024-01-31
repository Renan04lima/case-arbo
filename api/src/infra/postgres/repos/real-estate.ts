import { PgRealEstate } from '../entities/pg-real-estate'
import { PgConnection } from '../helpers/connection'
import { CreateRealEstateRepository } from '@/domain/contracts/repos/real-estate-repo'

type CreateParams = CreateRealEstateRepository.Params
type CreateResult = CreateRealEstateRepository.Result

export class PgRealEstateRepository implements CreateRealEstateRepository {
  async create(params: CreateParams): Promise<CreateResult> {
    const pgRealEstateRepo =
      PgConnection.getInstance().getRepository(PgRealEstate)

    const pgRealEstate = await pgRealEstateRepo.save(
      pgRealEstateRepo.create(params),
    )
    const result: CreateResult = {
      id: pgRealEstate.id,
      address: {
        zipcode: pgRealEstate.zipcode,
        street: pgRealEstate.street,
        number: pgRealEstate.number,
        complement: pgRealEstate.complement,
        neighborhood: pgRealEstate.neighborhood,
        city: pgRealEstate.city,
        state: pgRealEstate.state,
      },
      type: pgRealEstate.type,
      value: pgRealEstate.value,
      images_url: pgRealEstate.images_url,
      user_id: pgRealEstate.user_id,
    }

    return result
  }
}
