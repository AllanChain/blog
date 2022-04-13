import { createBelongsToKey } from 'gridsome/lib/graphql'

const sortLabels = (labels, store) => {
  const labelWithUsage = []

  for (const labelId of labels) {
    const label = store.getCollection('Label').getNodeById(labelId)
    // Get how many post used this label
    const usedBy = store.chainIndex({
      [createBelongsToKey(label)]: { $eq: true }
    }).data().length
    labelWithUsage.push({ label, usedBy })
  }
  return labelWithUsage.sort((a, b) => b.usedBy - a.usedBy).map(e => e.label)
}

export const Post = {
  labels (post, args, { store }) {
    return sortLabels(post.labels, store)
  },
  logo: {
    type: 'type Logo { src: String, lazySrc: String }',
    resolve (post, args, { store }) {
      const sortedLabels = sortLabels(post.labels, store)

      // Exclude hottest label
      for (let i = sortedLabels.length - 1; i > 0; i--) {
        const label = sortedLabels[i]

        if (label.logo) {
          return {
            src: label.logo,
            lazySrc: label.logoLazy
          }
        }
      }
      return null
    }
  }
}
