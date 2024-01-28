
import { HashComparer, Hasher } from '@/domain/contracts/gateways/hash'
import bcrypt from 'bcrypt'

export class BcryptAdapter implements HashComparer, Hasher {
  constructor (private readonly salt: number) {}

  async compare (plaintext: string, digest: string): Promise<boolean> {
    const isValid = await bcrypt.compare(plaintext, digest)
    return isValid
  }

  async hash (plaintext: string): Promise<string> {
    const digest = await bcrypt.hash(plaintext, this.salt)
    return digest
  }
}