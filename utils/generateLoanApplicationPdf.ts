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

  step1?: Step1Personal;
  step2?: Step2Employment;
  step3?: Step3Loan;
  step4?: Step4Declarations;
};

const safe = (value: unknown) => {
  if (value === undefined || value === null || value === "") return "N/A";
  return String(value);
};

const formatCurrency = (value: unknown) => {
  if (value === undefined || value === null || value === "") return "N/A";

  const num =
    typeof value === "number"
      ? value
      : Number(String(value).replace(/,/g, "").trim());

  if (Number.isNaN(num)) return String(value);

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(num);
};

export const buildLoanApplicationHtml = (data: LoanApplicationPdfData) => {
  const s1 = data.step1 || {};
  const s2 = data.step2 || {};
  const s3 = data.step3 || {};
  const s4 = data.step4 || {};

  return `
  <html>
    <head>
      <meta charset="utf-8" />
      <style>
        body {
          font-family: Arial, sans-serif;
          padding: 24px;
          color: #222;
          font-size: 12px;
          line-height: 1.5;
        }

        .header {
          text-align: center;
          border-bottom: 2px solid #caa74a;
          padding-bottom: 12px;
          margin-bottom: 18px;
        }

        .title {
          font-size: 20px;
          font-weight: bold;
          color: #8b6b16;
          margin-bottom: 4px;
        }

        .subtitle {
          font-size: 12px;
          color: #555;
        }

        .meta {
          width: 100%;
          border-collapse: collapse;
          margin: 10px 0 18px 0;
        }

        .meta td {
          padding: 6px 8px;
          border: 1px solid #ddd;
        }

        .section-title {
          background: #f4ead0;
          color: #5f4a12;
          font-weight: bold;
          padding: 8px 10px;
          margin-top: 18px;
          border: 1px solid #e1d1a0;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 0;
        }

        th, td {
          border: 1px solid #ddd;
          padding: 8px;
          vertical-align: top;
          text-align: left;
        }

        th {
          background: #faf6ea;
          width: 34%;
          color: #333;
        }

        .small {
          font-size: 11px;
          color: #555;
        }

        .footer {
          margin-top: 24px;
          font-size: 11px;
          color: #666;
        }

        .badge {
          display: inline-block;
          padding: 4px 8px;
          background: #f8f1df;
          border: 1px solid #d7c08a;
          border-radius: 4px;
          font-weight: bold;
          color: #5c4710;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="title">Loan Application Review Summary</div>
        <div class="subtitle">Generated from multi-step application form</div>
      </div>

      <table class="meta">
        <tr>
          <td><strong>Date</strong><br/>${safe(data.applicationDate)}</td>
          <td><strong>Application No.</strong><br/>${safe(data.applicationNumber)}</td>
        </tr>
        <tr>
          <td><strong>Lender Name</strong><br/>${safe(data.lenderName || "Jio Financial Services Private Limited")}</td>
          <td><strong>Platform</strong><br/>${safe(data.platformName || "https://jiofinserv.org/")}</td>
        </tr>
      </table>

      <div class="section-title">Step 1 - Personal Details</div>
      <table>
        <tr><th>Full Name</th><td>${safe(s1.fullName)}</td></tr>
        <tr><th>Mobile Number</th><td>${safe(s1.phone)}</td></tr>
        <tr><th>Email</th><td>${safe(s1.email)}</td></tr>
        <tr><th>Date of Birth</th><td>${safe(s1.dob)}</td></tr>
        <tr><th>Gender</th><td>${safe(s1.gender)}</td></tr>
        <tr><th>Address</th><td>${safe(s1.address)}</td></tr>
        <tr><th>City</th><td>${safe(s1.city)}</td></tr>
        <tr><th>State</th><td>${safe(s1.state)}</td></tr>
        <tr><th>Pincode</th><td>${safe(s1.pincode)}</td></tr>
      </table>

      <div class="section-title">Step 2 - Employment Details</div>
      <table>
        <tr><th>Employment Type</th><td>${safe(s2.employmentType)}</td></tr>
        <tr><th>Company Name</th><td>${safe(s2.companyName)}</td></tr>
        <tr><th>Monthly Income</th><td>${formatCurrency(s2.monthlyIncome)}</td></tr>
        <tr><th>Work Experience</th><td>${safe(s2.workExperience)}</td></tr>
      </table>

      <div class="section-title">Step 3 - Loan Details</div>
      <table>
        <tr><th>Loan Type</th><td>${safe(s3.loanType)}</td></tr>
        <tr><th>Loan Amount</th><td>${formatCurrency(s3.loanAmount)}</td></tr>
        <tr><th>Tenure</th><td>${safe(s3.tenure)} months</td></tr>
        <tr><th>Interest Rate</th><td>${safe(s3.interestRate)}%</td></tr>
        <tr><th>Estimated EMI</th><td>${formatCurrency(s3.emi)}</td></tr>
        <tr><th>Loan Purpose</th><td>${safe(s3.purpose)}</td></tr>
      </table>

      <div class="section-title">Bank Details</div>
      <table>
        <tr><th>Primary Bank</th><td>${safe(s3.primaryBank)}</td></tr>
        <tr><th>Account Number</th><td>${safe(s3.accountNumber)}</td></tr>
        <tr><th>IFSC Code</th><td>${safe(s3.ifsc)}</td></tr>
      </table>

      <div class="section-title">Step 4 - Review / Declarations</div>
      <table>
        <tr><th>PAN</th><td>${safe(s4.pan)}</td></tr>
        <tr><th>Aadhaar</th><td>${safe(s4.aadhaar)}</td></tr>
        <tr>
          <th>Terms Accepted</th>
          <td>
            <span class="badge">${s4.agreedToTerms ? "Yes" : "No"}</span>
          </td>
        </tr>
      </table>

      <div class="footer">
        This document is a downloadable review summary of the details entered by the applicant in the loan application form.
        It is intended for user review and record keeping.
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