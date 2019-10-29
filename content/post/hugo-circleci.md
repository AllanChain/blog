---
Title: "Deploying Hugo with CircleCI"
Date: 2019-10-27T20:12:30+08:00
Author: Allan Chain
Categories:
    - Hugo
Tags: 
    - CI
---

Building blog sites manually is tedious and often leads to mistakes, especially when hosting on `master/docs`: Think about when you happily update the blog post and every thing looks fine by `hugo server`, you just typed `git add`, `git commit`, `git push` without a second thought, only to find that you forgot to build the site to `docs` directory. And you `git add`, `git commit`, `git push` again, finding it a pain to reinvent a fancy commit message. Let's get rid of this!

## Deploying Hugo with CircleCI: Glance

There is [a good article](https://willschenk.com/articles/2018/automating_hugo_with_circleci/), but is for version 2 and heavily used `&&` which is not beautiful in YAML.

### Version 2.1

Here is the snippet, where `workflows` is at root level:

```yaml
workflows:
  main:
    jobs:
      - deploy:
          filters:
            branches:
              only: master
```

### Beautiful YAML
Something like this:
```yaml
      - run:
          name: Update Submodules
          command: |
            git submodule sync
            git submodule update --init
      - run:
          name: Set up Repo
          command: |
            git worktree add -B gh-pages ../public origin/gh-pages
            git config user.email "ci-build@pkuphysu.top"
            git config user.name "ci-build"
```

### Don't forget to set SSH keys with push access

Just follow the official documentation

## Other things to know
### Tell CircleCI to do nothing on `gh-pages`

You probably needs to first manually checkout an orphan branch gh-pages and add the `.circleci/config.yml` in to let CircleCI know that this branch shall not be deployed.

just:

```bash
git checkout --orphan gh-pages
# And add that config.yml
git add .circleci/config.yml
git push -u origin gh-pages
```
### Set up timezone
If you want to include time information in the commit, you well probably find that `TZ=xx/xx` does not work. That's because the image does not contain the necessary package. Just install it:
```yaml
      - run:
          name: Install tzdata
          command: |
            apt-get install tzdata
```
## Finally my config file

```yaml
version: 2.1
jobs:
  deploy:
    working_directory: ~/repo/blog
    environment:
      TZ: Asia/Shanghai
    docker:
        - image: cibuilds/hugo:latest
    steps:
      - checkout
      - add_ssh_keys:
          fingerprints:
            - '8f:11:02:f3:3e:35:37:d7:17:4d:e4:1e:6b:e8:f6:db'
      - run:
          name: Update Submodules
          command: |
            git submodule sync
            git submodule update --init
      - run:
          name: Set up Repo
          command: |
            git worktree add -B gh-pages ../public origin/gh-pages
            git config user.email "ci-build@pkuphysu.top"
            git config user.name "ci-build"
      - run:
          name: Build with Hugo
          command: |
            HUGO_ENV=production hugo -v -d ../public
      - run:
          name: Install tzdata
          command: |
            apt-get install tzdata
      - run:
          name: Deploy to gh-pages
          command: |
            cd ../public
            git add --all
            git commit -m "Site build at $(date '+%F %T')"
            git push
workflows:
  main:
    jobs:
      - deploy:
          filters:
            branches:
              only: master
```

