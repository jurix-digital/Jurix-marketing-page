'use client';

import React from 'react';
import { motion, easeOut } from 'framer-motion';

// Animation Variants
const fadeInUp = {
   hidden: { opacity: 0, y: 30 },
   visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: easeOut }
   },
};

const staggerContainer = {
   hidden: { opacity: 0 },
   visible: {
      opacity: 1,
      transition: {
         staggerChildren: 0.15,
      },
   },
};

const PrivacyPolicy = () => {
return (
<>
  <style>{internalStyles}</style>
  <div className="page-wrapper">
    <header className="header">
      <motion.div
         className="logo-container"
         onClick={() => window.location.href = '/'}
         style={{ cursor: 'pointer' }}
         initial={{ opacity: 0, y: -20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.5 }}
>
        <img src="/jurix-policy-logo.svg" alt="Jurix Logo" width="170" height="63" />
      </motion.div>
    </header>

        <motion.main 
      className="container"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <motion.h1 className="main-title" variants={fadeInUp}>Privacy Policy</motion.h1>

      <motion.section className="section" variants={fadeInUp}>
        <h2 className="section-heading">Introduction</h2>
        <p>Jurix ("Platform", "we", "us", or "our") is committed to protecting the privacy and personal data of users ("you", "your"), including clients, lawyers, and visitors accessing our website, mobile application, and related services.</p>
        <p>This Privacy Policy explains how we collect, use, disclose, store, and protect your personal data in accordance with applicable Indian laws, including the Information Technology Act, 2000 and the Digital Personal Data Protection Act, 2023.</p>
        <p>By accessing or using Jurix, you consent to the practices described in this Privacy Policy.</p>
      </motion.section>

      <motion.section className="section" variants={fadeInUp}>
        <h2 className="section-heading">Information We Collect</h2>
        <p>We may collect the following categories of information:</p>
        
        <div className="sub-section">
          <h3>A. Personal Information</h3>
          <ul>
            <li>Full name</li>
            <li>Contact details (phone number, email address)</li>
            <li>Residential or business address</li>
            <li>Identity details (where required for verification)</li>
            <li>Professional details (for lawyers)</li>
          </ul>
        </div>

        <div className="sub-section">
          <h3>B. Sensitive Personal Data (if applicable)</h3>
          <ul>
            <li>Financial information (payment details)</li>
            <li>Legal documents and case-related information</li>
            <li>Identity details (where required for compliance)</li>
          </ul>
        </div>

        <div className="sub-section">
          <h3>C. Technical Information</h3>
          <ul>
            <li>IP address</li>
            <li>Device type and operating system</li>
            <li>Browser type</li>
            <li>App usage data</li>
            <li>Log files</li>
          </ul>
        </div>

        <div className="sub-section">
          <h3>D. Transaction Information</h3>
          <ul>
            <li>Service history</li>
            <li>Consultation records</li>
            <li>Payment details (processed via third-party gateway)</li>
          </ul>
        </div>
      </motion.section>

      <motion.section className="section" variants={fadeInUp}>
        <h2 className="section-heading">Purpose of Data Collection</h2>
        <p>We collect and process your data for the following purposes:</p>
        <ul>
          <li>To provide legal service matching and consultation services</li>
          <li>To facilitate communication between clients and lawyers</li>
          <li>To verify identity and prevent platform misuse</li>
          <li>To process payments and maintain transaction records</li>
          <li>To comply with legal and regulatory obligations</li>
          <li>To improve platform functionality and user experience</li>
          <li>To prevent fraud, abuse, or unlawful activity</li>
        </ul>
        <p className="secondary-text">We only collect data that is necessary and relevant to the services provided.</p>
      </motion.section>

      <motion.section className="section" variants={fadeInUp}>
        <h2 className="section-heading">Legal Basis for Processing</h2>
        <p>Your data is processed based on:</p>
        <ul>
          <li>Your consent</li>
          <li>Performance of contractual obligations</li>
          <li>Compliance with legal obligations</li>
          <li>Legitimate business interests (platform improvement, fraud prevention)</li>
        </ul>
        <p className="secondary-text">You may withdraw consent where applicable, subject to legal and contractual limitations.</p>
      </motion.section>

      <motion.section className="section" variants={fadeInUp}>
        <h2 className="section-heading">Data Sharing and Disclosure</h2>
        <p>We may share your information:</p>
        <ul>
          <li>With verified lawyers for the purpose of providing legal services</li>
          <li>With payment gateway providers for secure payment processing</li>
          <li>With regulatory authorities if required by law</li>
          <li>With service providers assisting in technology, analytics, or security</li>
        </ul>
        <p className="secondary-text">We do not sell personal data to third parties.</p>
      </motion.section>

      <motion.section className="section" variants={fadeInUp}>
        <h2 className="section-heading">Data Storage and Security</h2>
        <p>We implement reasonable security practices including:</p>
        <ul>
          <li>Encryption of communication</li>
          <li>Secure server infrastructure</li>
          <li>Access controls and authentication mechanisms</li>
          <li>Restricted internal access to personal data</li>
        </ul>
        <p className="disclaimer">However, no system is completely secure. Users are advised to protect their login credentials.</p>
      </motion.section>

      <motion.section className="section" variants={fadeInUp}>
        <h2 className="section-heading">Data Retention</h2>
        <p>We retain personal data:</p>
        <ul>
            <li>For as long as necessary to provide services</li>
            <li>To comply with legal or regulatory requirements</li>
            <li>For legitimate business purposes</li>
        </ul>
        <p>
            Once no longer required, data is securely deleted or anonymized.
        </p>

    <h2 className="section-heading">User Rights</h2>
<p>
    Subject to applicable law, you may have the right to:
</p>
<ul>
    <li>Access your personal data</li>
    <li>Request correction of inaccurate information</li>
    <li>Request deletion of personal data</li>
    <li>Withdraw consent</li>
    <li>Grievance redressal</li>
</ul>

<p>
    Requests may be submitted to the contact details below.
</p>

<p>
    For information on how to delete your Jurix account and associated personal data,
    please{" "}
    <a 
        href="/delete-account" 
        style={{ textDecoration: "underline", fontWeight: 600 }}
    >
        click here
    </a>.
</p>
        <h2 className="section-heading">Cookies and Tracking</h2>
        <p>
            Jurix may use cookies and similar technologies to:
        </p>
        <ul>
            <li>Enhance user experience</li>
            <li>Analyze traffic and usage</li>
            <li>Improve platform functionality</li>
        </ul>
        <p>
            Users may control cookie settings through their browser.
        </p>

        <h2 className="section-heading">Third-Party Links</h2>
        <p>
            Our platform may contain links to third-party websites. We are not responsible
            for their privacy practices. Users are encouraged to review third-party
            privacy policies separately.
        </p>

        <h2 className="section-heading">Children’s Privacy</h2>
        <p>
            Jurix services are not intended for individuals below 18 years of age.
            We do not knowingly collect personal data from minors.
        </p>

        <h2 className="section-heading">Changes to this Policy</h2>
        <p>
            We may update this Privacy Policy from time to time. Updated versions will be posted on the platform with revised effective dates.
        </p>
        <p>
            Continued use of Jurix after updates constitutes acceptance of the revised policy.
        </p>
      </motion.section>


      <motion.section className="section" variants={fadeInUp}>
        <h2 className="section-heading">Contact Us</h2>
        <p>
            For privacy-related questions or requests, please contact:
        </p>

        <p>
            Email: <a href="mailto:hello@jurix.law"><strong style={{textDecoration:'underline'}}>hello@jurix.law</strong></a>
        </p>

        <p>
            Phone: <strong>+91 81 4444 6464</strong>
        </p>

        <p>
            Address: <strong>HIG–66, Tatvamasi Nilayam, KPHB 9th Phase Road,
            KPHB Colony, Hyderabad, Medchal Malkajgiri, Telangana, 500072</strong>
        </p>
      </motion.section>

    </motion.main>

    <motion.footer 
        className="footer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
    >
      <div className="footer-inner">
        <span>Privacy Policy</span>
        <span>© 2026 Jurix. All Rights Reserved.</span>
      </div>
    </motion.footer>
  </div>
</>
  );
};

// Internal CSS string
const internalStyles = `
    .page-wrapper {
        background-color: #F3F2F1;
        color: #333;
        font-family: 'Albert Sans', sans-serif;
        min-height: 100vh;
        margin: 0;
        display: flex;
        flex-direction: column;
    }
    .header {
        padding: 40px 20px;
        text-align: center;
        background-color: #F3F2F1;
    }
    .logo-container {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        color: #000;
    }
    .logo-text {
        font-size: 26px;
        font-weight: 700;
        letter-spacing: -0.5px;
    }
    .container {
        max-width: 1040px;
        width: 100%;
        margin: 0 auto;
        box-sizing: border-box;
        flex: 1;
    }
    .main-title {
        margin-bottom: 20px;
        color: #2D3136;
        font-weight: 700;
        font-size: 32px;
        letter-spacing: -1px;
    }
    .section {
        margin-bottom: 40px;
    }
    .section-heading {
        margin-bottom: 15px;
        color: #282828;
        font-weight: 600;
        font-size: 24px;
        line-height: 1.2;
        letter-spacing: -1px;
    }
    .sub-section h3 {
        font-size: 20px;
        font-weight: 700;
        margin: 20px 0 8px 0;
        color: #282828;
    }
    p {
        font-size: 20px;
        line-height: 28px;
        margin: 0 0 12px 0;
        color: #282828;
    }
    ul {
        font-size: 20px;
        line-height: 28px;
        padding-left: 20px;
        margin-bottom: 15px;
        color: #282828;
        list-style-type: disc;
    }

    /* Form Styling */
    .contact-form {
        background: #fff;
        padding: 24px;
        border: 1px solid #ddd;
        border-radius: 8px;
        margin-bottom: 25px;
    }
    .field {
        margin-bottom: 15px;
        display: flex;
        flex-direction: column;
    }
    .field label {
        font-size: 12px;
        font-weight: 700;
        margin-bottom: 5px;
        text-transform: uppercase;
    }
    .field input, .field textarea {
        padding: 12px;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-size: 16px;
        font-family: inherit;
    }
    .error-text {
        color: #d32f2f;
        font-size: 13px;
        margin-top: 5px;
    }
    .action-button {
        background: #000;
        color: #fff;
        border: none;
        padding: 14px;
        font-weight: 700;
        border-radius: 4px;
        cursor: pointer;
        width: 100%;
        font-size: 16px;
    }
    .success-box {
        background: #e8f5e9;
        color: #2e7d32;
        padding: 20px;
        border-radius: 6px;
        text-align: center;
        font-weight: 700;
        margin-bottom: 25px;
    }
    .static-contact p {
        font-size: 16px;
        margin-bottom: 6px;
    }

    /* Footer */
    .footer {
        background-color: #1a1a1a;
        color: #E6DDCC;
        padding: 30px 20px;
        font-size: 12px;
    }
    .footer-inner {
        max-width: 1040px;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
    }

    /* MOBILE RESPONSIVE STYLES */
    @media (max-width: 768px) {
    .header {
        padding: 20px 15px;
    }
    .main-title {
        font-size: 26px;
    }
    .section-heading {
        font-size: 20px;
    }
    .sub-section h3 {
        font-size: 18px;
    }
    p, ul {
        font-size: 16px;
        line-height: 24px;
    }
    .contact-form {
        padding: 16px;
    }
    .container {
    padding: 10px;
    }
    .logo-container img {
        width: 130px;
        height: 50px;
    }
    }
`;

export default PrivacyPolicy;