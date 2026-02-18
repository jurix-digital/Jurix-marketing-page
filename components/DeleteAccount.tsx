'use client';

import React from 'react';
import { motion, easeOut } from 'framer-motion';

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

const DeleteAccount = () => {
  return (
    <>
      <style>{internalStyles}</style>

      <div className="page-wrapper">

        {/* HEADER */}
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

        {/* MAIN CONTENT */}
        <motion.main
          className="container"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >

          <motion.h1 className="main-title" variants={fadeInUp}>
            Account Deletion
          </motion.h1>

          <motion.section className="section" variants={fadeInUp}>
            <p>
              Users can permanently delete their Jurix account directly within the app.
            </p>
          </motion.section>

        <motion.section className="section" variants={fadeInUp}>
  <h2 className="section-heading">How to Delete Your Account</h2>
  <ol className="numbered-list">
    <li>Open the Jurix App</li>
    <li>Go to Profile or Settings</li>
    <li>Tap on <strong>Delete Account</strong></li>
    <li>Confirm the deletion request</li>
  </ol>
</motion.section>

          <motion.section className="section" variants={fadeInUp}>
            <h2 className="section-heading">Information We Collect</h2>
            <ul>
              <li>Your phone number and authentication data will be permanently removed.</li>
              <li>All associated user data stored in our database will be deleted.</li>
              <li>Any uploaded documents or case-related information will be erased.</li>
            </ul>
          </motion.section>

          <motion.section className="section" variants={fadeInUp}>
            <h2 className="section-heading">Data Retention Policy</h2>
            <p>
              Jurix does not retain personal user data after account deletion,
              except where retention is required by applicable law.
            </p>
          </motion.section>

          <motion.section className="section" variants={fadeInUp}>
            <div className="help-box">
              <h3>Need Help?</h3>
              <p>
                Contact us at:{' '}
                <a href="mailto:app@jurix.law">
                  <strong style={{ textDecoration: 'underline' }}>
                    app@jurix.law
                  </strong>
                </a>
              </p>
            </div>
          </motion.section>

        </motion.main>

        {/* FOOTER */}
        <motion.footer
          className="footer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <div className="footer-inner">
            <span
              style={{ cursor: 'pointer' }}
              onClick={() => window.location.href = '/privacy-policy'}
            >
              Privacy Policy
            </span>
            <span>© 2026 Jurix. All Rights Reserved.</span>
          </div>
        </motion.footer>

      </div>
    </>
  );
};

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

.numbered-list {
    font-size: 20px;
    line-height: 28px;
    padding-left: 22px;
    margin-bottom: 15px;
    color: #282828;
    list-style-type: decimal;
}

.numbered-list li {
    margin-bottom: 6px;
}

.help-box {
    background: #E6DDCC;
    padding: 20px;
    border-radius: 8px;
}

.help-box h3 {
    font-size: 18px;
    margin-bottom: 8px;
}

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

/* MOBILE */
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

    p, ul, ol {
        font-size: 16px;
        line-height: 24px;
    }

    .container {
        padding: 10px;
    }

    .logo-container img {
        width: 130px;
        height: 50px;
    }

  .footer-inner {
    max-width: 1040px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
}
`;

export default DeleteAccount;