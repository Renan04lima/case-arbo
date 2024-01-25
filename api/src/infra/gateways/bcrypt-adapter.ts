
import { HashComparer } from '@/domain/contracts/gateways/hash'
import bcrypt from 'bcrypt'

export class BcryptAdapter implements HashComparer {
  constructor (private readonly salt: number) {}

  async compare (plaintext: string, digest: string): Promise<boolean> {
    const isValid = await bcrypt.compare(plaintext, digest)
    return isValid
  }
}