import { generateReactHelpers } from "@uploadthing/react";

import type { SongFileRouter } from "@/app/api/uploadthing/core";

export const { useUploadThing } = generateReactHelpers<SongFileRouter>();
