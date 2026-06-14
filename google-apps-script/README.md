# Google Sheets Integration Setup

This connects the feedback form to a Google Sheet via a Google Apps Script Web App.

```
Browser → Next.js API route (/api/feedback) → Apps Script Web App → Google Sheet
```

The Next.js API route is what calls Apps Script — the script URL is **never** exposed to the browser.

## 1. Create the Google Sheet

1. Go to <https://sheets.google.com> and create a new blank spreadsheet.
2. Name it e.g. **University Feedback**. (The script auto-creates a tab called `Feedback` with headers on first submit — you don't need to add columns manually.)

## 2. Add the Apps Script

1. In the sheet, open **Extensions → Apps Script**.
2. Delete any boilerplate in `Code.gs`.
3. Copy the entire contents of [`Code.gs`](./Code.gs) into the editor.
4. Click the **Save** icon (💾).

## 3. Deploy as a Web App

1. Click **Deploy → New deployment**.
2. Click the gear ⚙️ next to "Select type" → choose **Web app**.
3. Configure:
   - **Description:** `University Feedback`
   - **Execute as:** **Me** (your account)
   - **Who has access:** **Anyone**
4. Click **Deploy**.
5. Click **Authorize access** and approve the permissions for your Google account.
   (You may see an "unverified app" warning — click **Advanced → Go to … (unsafe)**. This is normal for personal scripts.)
6. Copy the **Web app URL**. It looks like:
   ```
   https://script.google.com/macros/s/AKfy......./exec
   ```

> ✅ **Test it:** paste that URL into a browser. You should see
> `{"ok":true,"message":"University Feedback endpoint is live."}`

## 4. Connect it to the Next.js app

In the project root, create a file named `.env.local`:

```bash
GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/AKfy......./exec
```

Restart the dev server (`npm run dev`) so the variable is picked up.

## 5. Done

Submit the form — a new row appears in the sheet with:

| Full Name | Mobile Number | College Name | District | Feedback | Submission Date | Submission Time |
| --------- | ------------- | ------------ | -------- | -------- | --------------- | --------------- |

## Updating the script later

If you edit `Code.gs`, you must **re-deploy**: **Deploy → Manage deployments → ✏️ Edit → Version: New version → Deploy**. The URL stays the same.

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| `Server is not configured…` error in the form | `GOOGLE_APPS_SCRIPT_URL` is missing — add it to `.env.local` and restart. |
| Rows not appearing | Re-deploy a **new version**; confirm "Who has access" = **Anyone**. |
| Mobile number shows as a number / drops leading digit | The script stores it as text (prefixed with `'`); already handled. |
