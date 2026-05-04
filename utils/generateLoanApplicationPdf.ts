// utils/generateLoanApplicationPdf.ts
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

type Step1Personal = {
  fullName?: string;
  phone?: string;
  email?: string;
  dob?: string;
  gender?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
};

type Step2Employment = {
  employmentType?: string;
  companyName?: string;
  monthlyIncome?: string | number;
  workExperience?: string;
};

type Step3Loan = {
  loanType?: string;
  loanAmount?: string | number;
  tenure?: string | number;
  interestRate?: string | number;
  emi?: string | number;
  primaryBank?: string;
  accountNumber?: string;
  ifsc?: string;
  purpose?: string;
};

type Step4Declarations = {
  aadhaar?: string;
  pan?: string;
  agreedToTerms?: boolean;
};

export type LoanApplicationPdfData = {
  applicationNumber?: string;
  applicationDate?: string;
  lenderName?: string;
  platformName?: string;
  borrowerMobileNo?: string;
  step1?: Step1Personal;
  step2?: Step2Employment;
  step3?: Step3Loan;
  step4?: Step4Declarations;
};

const safe = (value: unknown) => {
  if (value === undefined || value === null || value === "") return "NA";
  return String(value);
};

const formatCurrency = (value: unknown) => {
  if (value === undefined || value === null || value === "") return "NA";

  const num =
    typeof value === "number"
      ? value
      : Number(String(value).replace(/,/g, "").trim());

  if (Number.isNaN(num)) return String(value);

  return `₹ ${new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(num)}`;
};

export const buildLoanApplicationHtml = (data: LoanApplicationPdfData) => {
  const s1 = data.step1 || {};
  const s2 = data.step2 || {};
  const s3 = data.step3 || {};
  const s4 = data.step4 || {};

  const fullAddress = [s1.address, s1.city, s1.state, s1.pincode]
    .filter(Boolean)
    .join(", ");

  return `
  <html>
    <head>
      <meta charset="utf-8" />
      <style>
        @page {
          size: A4;
          margin: 18px;
        }

        body {
          margin: 0;
          font-family: Arial, Helvetica, sans-serif;
          color: #111;
          font-size: 11px;
          line-height: 1.25;
        }

        .top-bar,
        .bottom-bar {
          height: 28px;
          background: #18538f;
          margin-bottom: 18px;
        }

        .brand-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 4px solid #18538f;
          padding: 0 24px 8px 24px;
          margin-bottom: 24px;
        }

        .brand-left,
        .brand-right {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .jio-circle {
          width: 46px;
          height: 46px;
          border-radius: 50%;
          background: #f2b247;
          color: white;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          font-weight: 800;
        }

        .brand-name {
          font-size: 26px;
          font-weight: 800;
        }

        .company-name {
          font-size: 18px;
          font-weight: 700;
          color: #333;
        }

        .title {
          text-align: center;
          font-size: 22px;
          font-weight: 800;
          margin: 22px 0 56px 0;
        }

        .meta-grid {
          display: grid;
          grid-template-columns: 1fr 1.35fr;
          column-gap: 40px;
          row-gap: 4px;
          margin-bottom: 8px;
          font-size: 11px;
        }

        .bold {
          font-weight: 700;
        }

        .link {
          color: #004eea;
          text-decoration: underline;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        td, th {
          border: 1px solid #c9ced3;
          padding: 10px 9px;
          vertical-align: middle;
        }

        .part-title {
          text-align: center;
          font-size: 14px;
          font-weight: 800;
          background: #f7f7f7;
          padding: 8px;
        }

        .sr {
          width: 26px;
          text-align: center;
          font-weight: 700;
        }

        .label {
          font-weight: 700;
          width: 26%;
        }

        .value {
          font-weight: 700;
          text-align: center;
        }

        .normal-value {
          font-weight: 600;
          text-align: center;
        }

        .section-gap {
          height: 18px;
        }

        .sub-heading {
          font-size: 13px;
          font-weight: 800;
          margin: 18px 0 8px 0;
        }

        .charges {
          margin-top: 26px;
          font-size: 13px;
          color: #2f3740;
        }

        .charges ul {
          margin-top: 14px;
          padding-left: 24px;
        }

        .charges li {
          margin-bottom: 6px;
        }

        .thank-you {
          margin-top: 28px;
          font-size: 14px;
        }

        .signature {
          margin-top: 90px;
          font-size: 12px;
        }

        .signed {
          color: #168be8;
          font-weight: 700;
          text-decoration: underline;
          margin-bottom: 28px;
        }

        .footer-brand {
          margin-top: 16px;
        }

        .page-break {
          page-break-before: always;
        }
      </style>
    </head>

    <body>
      <div class="top-bar"></div>

      <div class="brand-row">
        <div class="brand-left">
          <span class="jio-circle">Jio</span>
          <span class="brand-name">Finance</span>
        </div>

        <div class="brand-right">
          <span class="jio-circle">Jio</span>
          <span class="company-name">Financial Services Private Limited</span>
        </div>
      </div>

      <div class="title">Loan Application Details</div>

      <div class="meta-grid">
        <div><span class="bold">Date:</span> ${safe(data.applicationDate)}</div>
        <div><span class="bold">Name of the lender:</span> ${safe(data.lenderName || "Jio Financial Services Private Limited")}</div>

        <div><span class="bold">Application No.:</span> ${safe(data.applicationNumber)}</div>
        <div><span class="bold">Name of digital lending platform:</span> <span class="link">${safe(data.platformName || "https://jiofinserv.org/")}</span></div>

        <div><span class="bold">Borrower Name:</span> ${safe(s1.fullName)}</div>
        <div><span class="bold">Borrower Mobile No:</span> ${safe(s1.phone || data.borrowerMobileNo)}</div>

        <div style="grid-column: 1 / span 2;">
          <span class="bold">Borrower Full Address:</span> ${safe(fullAddress)}
        </div>
      </div>

      <table>
        <tr>
          <td colspan="5" class="part-title">Part 1 (Loan Application and Applicant Details)</td>
        </tr>

        <tr>
          <td class="sr">1</td>
          <td class="label">Application / Account No.</td>
          <td class="value">${safe(data.applicationNumber)}</td>
          <td class="label">Type of Loan</td>
          <td class="value">${safe(s3.loanType)}</td>
        </tr>

        <tr>
          <td class="sr">2</td>
          <td class="label">Requested Loan Amount</td>
          <td colspan="3" class="value">${formatCurrency(s3.loanAmount)}</td>
        </tr>

        <tr>
          <td class="sr">3</td>
          <td class="label">Loan Purpose</td>
          <td colspan="3" class="normal-value">${safe(s3.purpose)}</td>
        </tr>

        <tr>
          <td class="sr">4</td>
          <td class="label"> Loan Term / Tenure</td>
          <td colspan="3" class="value">${safe(s3.tenure)} ${s3.tenure ? "months" : ""}</td>
        </tr>

        <tr>
          <td class="sr">5</td>
          <td class="label">Existing EMI</td>
          <td colspan="3" class="value">${formatCurrency(s3.emi)}</td>
        </tr>

        <tr>
          <td class="sr"></td>
          <td class="label">Bank</td>
          <td class="value">BANK NAME / BRANCH</td>
          <td class="value">ACCOUNT NUMBER</td>
          <td class="value">IFSC CODE</td>
        </tr>

        <tr>
          <td class="sr"></td>
          <td class="label">Bank Details</td>
          <td class="value">${safe(s3.primaryBank)}</td>
          <td class="value">${safe(s3.accountNumber)}</td>
          <td class="value">${safe(s3.ifsc)}</td>
        </tr>

        <tr>
          <td class="sr">6</td>
          <td class="label">Interest Rate (%)</td>
          <td colspan="3" class="value">${safe(s3.interestRate)}${s3.interestRate ? "%" : ""}</td>
        </tr>

        <tr>
          <td class="sr">7</td>
          <td class="label">Applicant Name</td>
          <td colspan="3" class="value">${safe(s1.fullName)}</td>
        </tr>

        <tr>
          <td class="sr">8</td>
          <td class="label">Email</td>
          <td colspan="3" class="normal-value">${safe(s1.email)}</td>
        </tr>

        <tr>
          <td class="sr">9</td>
          <td class="label">Mobile Number</td>
          <td colspan="3" class="value">${safe(s1.phone)}</td>
        </tr>

        <tr>
          <td class="sr">10</td>
          <td class="label">Date of Birth</td>
          <td class="value">${safe(s1.dob)}</td>
          <td class="label">Gender</td>
          <td class="value">${safe(s1.gender)}</td>
        </tr>

        <tr>
          <td class="sr">11</td>
          <td class="label">Address</td>
          <td colspan="3" class="normal-value">${safe(fullAddress)}</td>
        </tr>

        <tr>
          <td class="sr">12</td>
          <td class="label">Company Name</td>
          <td class="value">${safe(s2.companyName)}</td>
          <td class="label">Monthly Income</td>
          <td class="value">${formatCurrency(s2.monthlyIncome)}</td>
        </tr>

        <tr>
  <td class="sr">13</td>
  <td class="label">CIBIL Score</td>
  <td colspan="3" class="value">${safe(s2.workExperience)}</td>
</tr>

        <tr>
          <td class="sr">14</td>
          <td class="label">PAN Number</td>
          <td class="value">${safe(s4.pan)}</td>
          <td class="label">Aadhaar Number</td>
          <td class="value">${safe(s4.aadhaar)}</td>
        </tr>

        <tr>
          <td class="sr">15</td>
          <td class="label">Terms Accepted</td>
          <td colspan="3" class="value">${s4.agreedToTerms ? "YES" : "NO"}</td>
        </tr>
      </table>

      <div class="charges">
        <div class="sub-heading">Declaration</div>
        <ul>
          <li>I confirm that the information provided in this application form is true and accurate.</li>
          <li>I understand that incorrect or incomplete details may lead to rejection of the loan application.</li>
          <li>This document is generated from the details entered by the applicant in the loan application form.</li>
          <li><b>Processing, verification, approval and disbursal are subject to internal policy and document verification.</b></li>
        </ul>

        <p><b>Applicant Details</b> shall mean the personal, loan, income, bank and KYC details submitted by the borrower.</p>
        <p><b>Loan Application</b> shall mean the request submitted by the borrower for processing of the selected loan product.</p>
      </div>

      <div class="thank-you">
        Thanking You,<br/>
        <span class="jio-circle" style="margin-top: 10px;">Jio</span>
        <br/><br/>
        Financial Services Private Limited
      </div>

      <div class="signature">
        <div class="signed">Digitally Signed</div>
        <div><b>Digitally Signed by Jio Financial Services Private Limited ${safe(data.applicationDate)}</b></div>
      </div>

      <div class="bottom-bar footer-brand"></div>

      <div class="brand-row">
        <div class="brand-left">
          <span class="jio-circle">Jio</span>
          <span class="brand-name">Finance</span>
        </div>

        <div class="brand-right">
          <span class="jio-circle">Jio</span>
          <span class="company-name">Financial Services Private Limited</span>
        </div>
      </div>
    </body>
  </html>
  `;
};

export const generateAndShareLoanApplicationPdf = async (
  data: LoanApplicationPdfData
) => {
  const html = buildLoanApplicationHtml(data);

  const { uri } = await Print.printToFileAsync({
    html,
    base64: false,
  });

  const canShare = await Sharing.isAvailableAsync();

  if (canShare) {
    await Sharing.shareAsync(uri, {
      mimeType: "application/pdf",
      dialogTitle: "Download Loan Application PDF",
      UTI: "com.adobe.pdf",
    });
  }

  return uri;
};