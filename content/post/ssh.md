---
Title: Add SSH Key
Date: 2019-06-10
Author: Allan Chain
Categories: 
    - Git
---
Visit [GitHub Help Page](https://help.github.com/articles/connecting-to-github-with-ssh/) for detial.
### Add SSH Keys
- Open Terminal.
- Paste the text below, substituting in your GitHub email address.
```
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```
- This creates a new ssh key, using the provided email as a label.
```
Generating public/private rsa key pair.
```
- When you're prompted to "Enter a file in which to save the key," press Enter. This accepts the default file location.
```
 Enter a file in which to save the key (/home/you/.ssh/id_rsa): [Press enter]
```
- At the prompt, type a secure passphrase. For more information, see "Working with SSH key passphrases".
```
 Enter passphrase (empty for no passphrase): [Type a passphrase]
 Enter same passphrase again: [Type passphrase again]
```

