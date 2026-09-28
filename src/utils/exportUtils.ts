import { LegalDocument } from '../types/legal';

export function formatDocumentAsPlainText(doc: LegalDocument): string {
  let output = `${doc.title.toUpperCase()}\n`;
  output += `================================================================================\n`;
  output += `Jurisdiction: ${doc.jurisdiction.country}${doc.jurisdiction.state ? `, ${doc.jurisdiction.state}` : ''}\n`;
  output += `Effective Date: ${doc.effectiveDate}\n\n`;

  output += `PARTIES:\n`;
  doc.parties.forEach((p, i) => {
    output += `${i + 1}. ${p.role}: ${p.name} (${p.type})\n   Address: ${p.address}\n`;
  });
  output += `\n`;

  if (doc.preamble) {
    output += `PREAMBLE:\n${doc.preamble}\n\n`;
  }

  if (doc.recitals && doc.recitals.length > 0) {
    output += `RECITALS:\n`;
    doc.recitals.forEach((r) => {
      output += `${r}\n`;
    });
    output += `\n`;
  }

  output += `TERMS AND CONDITIONS:\n\n`;
  doc.sections.forEach((sec) => {
    output += `SECTION ${sec.number}. ${sec.title.toUpperCase()}\n`;
    output += `--------------------------------------------------\n`;
    sec.clauses.forEach((c) => {
      output += `${c.number} ${c.title}\n${c.text}\n\n`;
    });
  });

  output += `IN WITNESS WHEREOF, the Parties have executed this Agreement as of the Effective Date.\n\n`;
  output += `SIGNATURES:\n`;
  doc.signatures.forEach((sig) => {
    output += `_________________________________________\n`;
    output += `${sig.name}\n`;
    output += `Title: ${sig.title}\n`;
    if (sig.address) output += `Address: ${sig.address}\n`;
    output += `Date: ${sig.date || doc.effectiveDate}\n\n`;
  });

  output += `\n[Draft prepared using LegalEase AI. Disclaimer: Not a substitute for formal legal representation.]\n`;
  return output;
}

export function downloadAsDocx(doc: LegalDocument) {
  const plainText = formatDocumentAsPlainText(doc);
  const htmlContent = `
    <!DOCTYPE html>
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset="utf-8">
      <title>${doc.title}</title>
      <style>
        body { font-family: 'Times New Roman', Times, serif; font-size: 12pt; line-height: 1.5; color: #000; margin: 1in; }
        h1 { text-align: center; font-size: 16pt; font-weight: bold; margin-bottom: 24pt; text-transform: uppercase; }
        h2 { font-size: 13pt; font-weight: bold; margin-top: 18pt; margin-bottom: 6pt; border-bottom: 1px solid #999; }
        h3 { font-size: 12pt; font-weight: bold; margin-top: 12pt; margin-bottom: 4pt; }
        p { margin-bottom: 10pt; text-align: justify; }
        .party-box { background-color: #f7f7f7; padding: 10pt; margin-bottom: 15pt; }
        .signature-table { width: 100%; margin-top: 30pt; }
        .signature-cell { width: 48%; vertical-align: top; padding: 10pt; border-top: 1px solid #333; }
        .footer-note { font-size: 9pt; color: #666; font-style: italic; margin-top: 40pt; border-top: 1px solid #ccc; padding-top: 10pt; }
      </style>
    </head>
    <body>
      <h1>${doc.title}</h1>
      <p style="text-align: center;"><strong>Jurisdiction:</strong> ${doc.jurisdiction.country}${doc.jurisdiction.state ? ` (${doc.jurisdiction.state})` : ''} | <strong>Effective Date:</strong> ${doc.effectiveDate}</p>
      
      <div class="party-box">
        <strong>PARTIES:</strong><br/>
        ${doc.parties.map((p) => `<strong>${p.role}:</strong> ${p.name} - ${p.address}`).join('<br/>')}
      </div>

      <p>${doc.preamble}</p>

      ${doc.recitals.map((r) => `<p><em>${r}</em></p>`).join('')}

      ${doc.sections
        .map(
          (sec) => `
        <h2>SECTION ${sec.number}. ${sec.title}</h2>
        ${sec.clauses
          .map(
            (c) => `
          <h3>${c.number} ${c.title}</h3>
          <p>${c.text}</p>
        `,
          )
          .join('')}
      `,
        )
        .join('')}

      <p style="margin-top: 30pt;"><strong>IN WITNESS WHEREOF</strong>, the Parties have caused this Agreement to be executed by their duly authorized representatives as of the date first above written.</p>

      <table class="signature-table">
        <tr>
          ${doc.signatures
            .map(
              (sig) => `
            <td class="signature-cell">
              <br/><br/>
              ______________________________________<br/>
              <strong>${sig.name}</strong><br/>
              ${sig.title}<br/>
              Date: ${sig.date || doc.effectiveDate}
            </td>
          `,
            )
            .join('')}
        </tr>
      </table>

      <div class="footer-note">
        Draft generated via LegalEase AI. Disclaimer: This document draft is for assistance and informational purposes only and does not constitute formal legal representation.
      </div>
    </body>
    </html>
  `;

  const blob = new Blob(['\ufeff', htmlContent], {
    type: 'application/msword',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${doc.title.toLowerCase().replace(/[^a-z0-9]+/g, '_')}.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadAsText(doc: LegalDocument) {
  const content = formatDocumentAsPlainText(doc);
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${doc.title.toLowerCase().replace(/[^a-z0-9]+/g, '_')}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
