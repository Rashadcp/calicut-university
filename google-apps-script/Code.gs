/**
 * University Feedback — Google Apps Script Web App
 * --------------------------------------------------
 * Receives JSON POSTs from the Next.js API route and appends a row to the
 * bound Google Sheet. Deploy this as a Web App (see README.md).
 *
 * Expected JSON body:
 * {
 *   "fullName":       string,
 *   "mobile":         string,
 *   "collegeName":    string,
 *   "district":       string,
 *   "feedback":       string,
 *   "submissionDate": string,  // dd/mm/yyyy
 *   "submissionTime": string   // HH:mm:ss
 * }
 */

// Header row written to a brand-new sheet (order = column order).
var HEADERS = [
  'Full Name',
  'Mobile Number',
  'College Name',
  'District',
  'Feedback',
  'Submission Date',
  'Submission Time',
];

/**
 * Handle POST requests from the Next.js backend.
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(30000); // serialize writes to avoid row collisions

  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonOutput({ ok: false, error: 'Empty request body.' });
    }

    var data = JSON.parse(e.postData.contents);

    // Minimal server-side validation.
    var required = ['fullName', 'mobile', 'collegeName', 'district', 'feedback'];
    for (var i = 0; i < required.length; i++) {
      if (!data[required[i]] || String(data[required[i]]).trim() === '') {
        return jsonOutput({ ok: false, error: 'Missing field: ' + required[i] });
      }
    }

    var sheet = getSheet();

    sheet.appendRow([
      String(data.fullName),
      // Keep the mobile number as plain text (preserve leading digits).
      "'" + String(data.mobile),
      String(data.collegeName),
      String(data.district),
      String(data.feedback),
      String(data.submissionDate || ''),
      String(data.submissionTime || ''),
    ]);

    return jsonOutput({ ok: true });
  } catch (err) {
    return jsonOutput({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

/**
 * A simple GET endpoint so you can confirm the deployment is live in a browser.
 */
function doGet() {
  return jsonOutput({ ok: true, message: 'University Feedback endpoint is live.' });
}

/**
 * Return the target sheet, creating headers if the sheet is empty.
 */
function getSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Feedback');

  if (!sheet) {
    sheet = ss.insertSheet('Feedback');
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }

  return sheet;
}

/**
 * Helper to build a JSON ContentService response.
 */
function jsonOutput(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
