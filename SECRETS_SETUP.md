# How to Securely Add Google Services JSON to GitHub

Since you want a fully working APK from GitHub Actions, you need to provide the **REAL** `google-services.json` file, but securely.

We will use **GitHub Secrets** for this.

## Step 1: Encode your JSON file
Since we cannot paste a JSON file directly easily, we convert it to a "Base64 string".

**Using PowerShell (Double click the generated `encode_secret.bat` I made for you):**
1.  I have created a script `encode_secret.bat` in your folder.
2.  Double-click it.
3.  It will generate a file named `secret_code.txt`.
4.  Copy all the content inside `secret_code.txt`.

## Step 2: Add Secret to GitHub
1.  Go to your Repository on GitHub.
2.  Click **Settings** (Top right tab).
3.  On the left menu, scroll down to **Secrets and variables** > **Actions**.
4.  Click the green button **New repository secret**.
5.  **Name**: `GOOGLE_SERVICES_JSON`
6.  **Secret**: Paste the long string you copied from `secret_code.txt`.
7.  Click **Add secret**.

## Step 3: Trigger a Build
Now, push a new commit or tag.
The Action/Workflow will:
1.  Detect the secure secret.
2.  Decode it back into a real file.
3.  Build a fully functional App with Firebase support!
