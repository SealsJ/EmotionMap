export function validateVideoFile(file: File |  undefined | null ): { valid:boolean; error?: string} {
  if (!file) {
    return { valid: false, error: "No File Selected."}
  }

  if (file.type !== "video/mp4") {
    return { valid: false, error: "Invalid file type. MP4 videos are only supported."}
  }

  if (file.size === 0) {
    return { valid: false, error: "File is empty."}
  }

  //Additional check for file size to limit processing time on the model
  const MAX_MB = 500
  if (file.size  > MAX_MB * 1024 * 1024) {
    return { valid: false, error: `File size is too large. Max size is ${MAX_MB}MB.`}
  }

  return { valid: true}
}