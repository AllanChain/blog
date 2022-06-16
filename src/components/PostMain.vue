<script setup lang="ts">
import { BlogPost, BlogLabel } from '@data'
import { formatDate, formatLocalDate } from '@/utils'
import PostLabel from './PostLabel.vue'

defineProps<{
  post: BlogPost
  labels: BlogLabel[]
}>()
</script>

<template>
  <main class="max-w-2xl mx-auto px-5">
    <h1 text-center>{{ post.title }}</h1>

    <div text-center my-1>
      <PostLabel v-for="label in labels" :label="label" :key="label.id" />
    </div>

    <div text-center my-1 text-gray-800 select-none>
      <div
        class="inline-flex items-center text-center mx-1"
        :title="formatLocalDate(post.createdAt)"
      >
        <div class="i-carbon-calendar mx-1"></div>
        <div>{{ formatDate(post.createdAt) }}</div>
      </div>
      <div
        class="inline-flex items-center text-center mx-1"
        :title="formatLocalDate(post.lastEditedAt)"
      >
        <div class="i-carbon-edit mx-1"></div>
        <div>{{ formatDate(post.lastEditedAt) }}</div>
      </div>
    </div>

    <img v-if="post.image" :src="post.image" alt="Header" max-w-full my-2 />
    <div
      class="markdown-body"
      v-html="post.summary"
      bg="gray-100"
      border="2 dashed gray-400 rounded-md"
      px-3
      my-2
    />
    <article class="article-main markdown-body" v-html="post.body"></article>
    <div flex items-center text-gray-800>
      <div dash-divider />
      <div>More comments on</div>
      <a :href="`${post.url}#new_comment_field`" text-current>
        <div mx-1 icon-btn i-carbon-logo-github></div>
      </a>
      <div dash-divider />
    </div>
    <div>
      <div
        v-for="comment in post.comments"
        :key="comment.id"
        border="b-2 b-dashed gray-200"
        px-3
        my-2
      >
        <div flex items-center>
          <img
            :src="comment.author?.avatarUrl"
            :alt="comment.author?.id"
            :title="comment.author?.id"
            width="30"
            rounded-full
            mr-2
          />
          <div text="gray-700 sm" font-bold>{{ comment.author.id }}</div>
          <div flex-1></div>
          <div
            text="gray-700 sm"
            select-none
            :title="formatLocalDate(post.lastEditedAt)"
          >
            {{ formatDate(comment.createdAt) }}
          </div>
        </div>

        <div v-html="comment.body"></div>
      </div>
    </div>
  </main>
</template>

<style lang="scss">
h1,
h2,
h3,
h4,
h5,
h6 {
  @extend headings !optional;
}

$font-mono: source-code-pro, Menlo, Monaco, Consolas, Courier New, monospace;

@mixin full-width($margin) {
  @media (max-width: 500px) {
    margin-left: $margin;
    margin-right: $margin;
    border-radius: 0;

    pre {
      border-radius: 0;
    }
  }
}

.markdown-body {
  li,
  p {
    line-height: 1.5;
  }

  & :not(pre) > code {
    color: #476582;
    padding: 0.15rem 0.35rem;
    margin: 0;
    background-color: rgba(27, 31, 35, 0.05);
    border-radius: 3px;
  }
}

article.article-main.markdown-body {
  mjx-container[display='true'] {
    overflow-x: auto;
    overflow-y: hidden;
  }

  // Code styles

  pre,
  .highlight pre {
    padding: 16px;
    overflow: auto;
    line-height: 1.45;
    background-color: #282c34;
    border-radius: 3px;
    font-size: 95%;
    code {
      color: #eee8d5;
      font-weight: normal;
      font-family: $font-mono;

      &.hljs {
        padding: 0; // Reset padding from theme
      }
    }
  }
  .highlight {
    position: relative;
    font-family: $font-mono;
    .code-bar {
      position: absolute;
      top: 0.2em;
      right: 0.6em;
      font-size: 0.75rem;
      color: rgba(255, 255, 255, 0.6);

      .mdi-content-copy:hover {
        color: white;
      }
    }
    @include full-width(-20px);
  }
  & :not(.highlight) > pre {
    @include full-width(-20px);
  }

  // Heading styles
  headings {
    .anchor-hover {
      color: rgb(55, 102, 245);
      text-decoration: none;
      margin-left: -0.5em;
      opacity: 0; // not hidden to receive hover;
    }
    &:hover .anchor-hover {
      opacity: 1;
    }
  }

  blockquote {
    border-left: 0.25em solid #a1abc0;
    padding-left: 1em;
  }

  a {
    word-break: break-word;
  }

  img {
    background: transparent;
    max-width: 100%;
    &:only-child {
      display: block;
      margin: auto;
    }
  }
}

.theme--dark article.article-main.markdown-body {
  :not(pre) > code {
    color: #eee8d5;
    background-color: #282c34;
  }

  pre > code {
    background-color: transparent;
  }

  blockquote {
    color: #bec1c5;
  }

  table tr {
    background-color: transparent;
  }
}

.article-all {
  @media (min-width: 1000px) {
    max-width: 75vw;
  }
}

.toc-wrapper {
  display: none;

  @media (min-width: 1000px) {
    display: block;
    position: absolute;
    height: 100%;
    left: calc(75vw + 10px);
    width: calc(25vw - 55px);
  }

  .toc {
    position: sticky;
    top: 70px;
  }
}
</style>
