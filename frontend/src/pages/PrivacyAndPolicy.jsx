//React Hooks
import React from 'react';

//Stylesheets
import styles from './PrivacyAndPolicy.module.css';

// Custom hooks
import { useDocumentTitle } from '../hooks/useDocumentTitle';

const PrivacyAndPolicy = () => {
    useDocumentTitle('Privacy Policy');

    return (
        <div className={styles.privacyContainer}>
            <h1 className={styles.privacyTitle}>Privacy Policy</h1>
            <p className={styles.privacyDate}>Effective Date: <b>January 1, 2025</b></p>
            <section className={styles.privacySection}>
                <p>This Privacy Policy explains how we collect, use, and protect your personal information.</p>
            </section>
  
            <section className={styles.privacySection}>
                <h2>1. Information We Collect</h2>
                <p> We collect personal information you provide when creating an account, such as:</p>
                <ul>
                    <li>Name</li>
                    <li>Email address</li>
                    <li>Username</li>
                    <li>Password</li>
                </ul>
                <p>We may also collect usage data such as IP address, browser type, and interaction with the site.</p>
            </section>
    
            <section className={styles.privacySection}>
                <h2>2. How We Use Your Information</h2>
                <p>We use the information to:</p>
                <ul>
                    <li>Provide and maintain our service</li>
                    <li>Improve user experience</li>
                    <li>Communicate with you</li>
                    <li>Ensure security and prevent fraud</li>
                </ul>
            </section>
    
            <section className={styles.privacySection}>
                <h2>3. Sharing and Disclosure</h2>
                <p>We do not sell your data. We may share your information with:</p>
                <ul>
                    <li>Service providers that help us operate our platform</li>
                    <li>Authorities, if required by law</li>
                </ul>
            </section>
    
            <section className={styles.privacySection}>
                <h2>4. Cookies and Tracking</h2>
                 <p>We use cookies and similar technologies for authentication and analytics. You can manage cookie settings through your browser.</p>
            </section>
    
            <section className={styles.privacySection}>
                <h2>5. Data Retention</h2>
                <p>We retain your data as long as your account is active or as needed to provide services.</p>
            </section>
    
            <section className={styles.privacySection}>
                <h2>6. Your Rights</h2>
                <p>You have the right to:</p>
                <ul>
                    <li>Access the data we hold about you</li>
                    <li>Request corrections</li>
                    <li>Request deletion of your data</li>
                </ul>
            </section>
    
            <section className={styles.privacySection}>
                <h2>7. Security</h2>
                <p>We use reasonable measures to protect your data, but no system is 100% secure.</p>
            </section>

            <section className={styles.privacySection}>
                <h2>8. Children’s Privacy</h2>
                <p>Our service is not intended for children under 13. We do not knowingly collect personal information from children.</p>
            </section>

            <section className={styles.privacySection}>
                <h2>9. Changes to This Policy</h2>
                <p>We may update this Privacy Policy. We encourage you to review it periodically.</p>
            </section>

            <section className={styles.privacySection}>
                <h2>10. Contact Us</h2>
                <p>If you have questions about this policy, contact us at: <b>vawndyu@email.com</b></p>
            </section>
        </div>
    );
};

export default PrivacyAndPolicy;