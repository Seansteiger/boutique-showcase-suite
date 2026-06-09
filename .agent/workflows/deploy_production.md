---
description: Deploy the application to Vercel (Production)
---

This workflow guides you through the process of deploying the JSH Store to Vercel.

1.  **Check Status**: Ensure all changes are committed and the working directory is clean.
    ```bash
    git status
    ```

2.  **Add Changes**: Stage all modified files.
    ```bash
    git add .
    ```

3.  **Commit Changes**: Create a commit with a descriptive message.
    ```bash
    git commit -m "Your commit message here"
    ```

4.  **Push to Remote**: Push the changes to the `main` branch on GitHub. This triggers the Vercel deployment automatically.
    // turbo
    ```bash
    git push
    ```

5.  **Verify**: Log in to the Vercel dashboard to monitor the build status.
