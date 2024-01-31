export enum TYPES_OF_REAL_ESTATE {
  APARTMENT = 'APARTMENT',
  HOUSE = 'HOUSE',
  KITNET = 'KITNET',
}

export type RealEstate = {
  id: string
  address: {
    zipcode: string
    street: string
    number: number
    complement?: string
    neighborhood: string
    city: string
    state: string
  }
  type: TYPES_OF_REAL_ESTATE
  value: number
  images_url: string[]
  user_id: string
}
