export interface HashComparer {
  compare: (plaintext: string, digest: string) => Promise<boolean>
}

export interface Hasher {
  hash: (plaintext: string) => Promise<string>
}
