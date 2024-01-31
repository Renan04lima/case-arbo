export interface UploadImages {
  upload: (files: { buffer: Buffer; mimetype: string }[]) => Promise<string[]>
}
