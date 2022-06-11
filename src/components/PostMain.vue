<script setup lang="ts">
import { BlogPost, BlogLabel } from '@data'
import PostLabel from './PostLabel.vue'

defineProps<{
  post: BlogPost
  labels: BlogLabel[]
}>()
</script>

<template>
  <main class="max-w-2xl mx-auto px-2">
    <h1>{{ post.title }}</h1>

    <div>
      <PostLabel v-for="label in labels" :label="label" :key="label.id" />
    </div>

    <img v-if="post.image" :src="post.image" alt="Header" max-w-full my-3 />
    <div
      class="markdown-body"
      v-html="post.summary"
      bg="gray-100"
      border="2 dashed gray-300 rounded-md"
      px-3
    />
    <article class="article-main markdown-body" v-html="post.body"></article>
  </main>
</template>

<style lang="scss" is:global>
// @import "primer-markdown/index.scss";
// @import 'github-syntax-dark/lib/github-dark.css';

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
      text-decoration: none;
      margin-left: -15px;
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
