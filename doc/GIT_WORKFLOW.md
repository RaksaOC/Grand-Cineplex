## Git & Version Control

### Git Workflow & Team Collaboration

* **Create branches** for each feature, bugfix, or experiment:

  * `feature/login-form`
  * `fix/navbar-overlap`
  * `test/signup-validation`

* **Write meaningful commit messages**:

   * Good: `feat: add responsive navbar`
   * Good: `fix: correct typo in API endpoint`
   * Avoid: `update code` or `fixed stuff`

* **Commit often**, after logical chunks of work. Don’t wait until the end.

* Merging **child branches into grandchild branches** is acceptable when features are deeply related and you're still in the development phase.


---

## 🔀 Merge Process

Collaborating on code requires clean merging to avoid conflicts and preserve history. Follow these steps:

1. **Sync Often**
   Keep your feature branch up to date:

   ```bash
   git checkout feature/your-feature
   git fetch origin
   git merge origin/main
   ```

2. **Handle Conflicts**
   If conflicts appear:

   * Manually edit and resolve them
   * Then stage and commit:

     ```bash
     git add .
     git commit
     ```

3. **Push & Open a PR**
   Push your branch and open a Pull Request:

   * Base: `main` or `dev`
   * Compare: your feature branch
   * Include a clear title, description, and related issue links

4. **Review & Merge**

   * Review with teammates, address feedback
   * Merge via your platform (GitHub, GitLab, etc.)
   * Delete the feature branch after merge if not needed

---

### Summary

1. Merge your target branch **into your feature branch locally** (`git merge main`)
2. Resolve any conflicts locally
3. Push your branch
4. Open a **Pull Request (PR)** for review
5. Discuss, approve, and **merge into `main` or `dev`**

---



### Useful Git Commands

| Command                           | What It Does                                                 |
| --------------------------------- | ------------------------------------------------------------ |
| `git status`                      | See what’s changed and staged                                |
| `git add .`                       | Stage all changes                                            |
| `git commit -m "message"`         | Commit staged changes with a message                         |
| `git push`                        | Push commits to the remote branch                            |
| `git pull`                        | Pull changes from remote into current branch                 |
| `git fetch --all`                 | Fetch all latest changes from all branches (without merging) |
| `git checkout -b [branch-name]`   | Create and switch to a new branch                            |
| `git merge [branch-name]`         | Merge the given branch into your current branch              |
| `git reset HEAD~1`                | Undo last commit but keep the changes (soft reset)           |
| `git reset --hard [branch-name]`  | Forcefully reset your branch to match another                |
| `git log --oneline --graph --all` | View commit history in a tree graph format                   |
| `git stash` / `git stash pop`     | Temporarily store changes and reapply them later             |

---

### Recommended Git Workflow

```bash
# Start by fetching latest remote branches
git fetch --all

# Create a new feature branch from main
git checkout main
git pull
git checkout -b feature/login-form

# Make changes
# Stage and commit often
git add .
git commit -m "feat: create login form UI"

# If someone else pushed changes to main, update locally
git checkout main
git pull

# Merge main into your feature branch to resolve conflicts early
git checkout feature/login-form
git merge main

# Push your branch and create a Pull Request (PR)
git push -u origin feature/login-form

# Team reviews the PR and merges into main/dev
```



#

