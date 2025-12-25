# How to Release a New Version

We have set up **Automated Releases** for your repository. This means you don't need to manually build the APK and upload it. GitHub will do it for you!

## Step 1: Push Your Code
Make sure all your latest code changes are committed and pushed to the `main` branch.

```bash
git add .
git commit -m "Fixed bugs and improved UI"
git push origin main
```

## Step 2: Create a Tag
When you are ready to release a new version (e.g., v1.0), you create a "tag".

**Option A: Using GitHub Desktop**
1.  Go to History.
2.  Right-click the latest commit.
3.  Choose **Create Tag...**.
4.  Name it `v1.0` (or `v1.1`, `v2.0` etc).
5.  **Push** the tag to origin.

**Option B: Using Command Line**
```bash
# Create the tag
git tag v1.0

# Push the tag to GitHub
git push origin v1.0
```

## Step 3: Wait for Magic
1.  Go to your Repository on GitHub.
2.  Click on the **Actions** tab.
3.  You will see a workflow running named **"Build and Release App"**.
4.  Wait for it to turn Green (Success).

## Step 4: Download Your App
1.  On your Repo homepage, look at the right sidebar under **"Releases"**.
2.  You will see your new version `v1.0`.
3.  Click it to find the **`WaterSupplyManager_Debug.apk`** ready for download!

---

## Technical Note
Currently, the pipeline builds the **Debug** version of the app because it doesn't require complex keystore setup. This APK works perfectly on all Android devices.
If you wish to publish to the Play Store later, you will need to configure "Signing Keys" in the GitHub Secrets.
