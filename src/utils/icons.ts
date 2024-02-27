import { ActivityType } from "@prisma/client"
import { faBook, faQuestion, faClipboard } from "@fortawesome/free-solid-svg-icons"
import { IconDefinition } from "@fortawesome/fontawesome-svg-core"

export const getIcon = (type: ActivityType): IconDefinition => {
    switch (type) {
      case (ActivityType.READING):
        return faBook
      case (ActivityType.QUESTIONING):
        return faQuestion
      case (ActivityType.READING_BEHAVIOR):
        return faClipboard
    }
    return faBook
  }