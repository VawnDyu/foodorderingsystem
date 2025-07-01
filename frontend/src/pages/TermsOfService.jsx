//React Hooks
import React from 'react';

//Stylesheets
import styles from './TermsOfService.module.css';

// Custom hooks
import { useDocumentTitle } from '../hooks/useDocumentTitle';

const TermsOfService = () => {
    useDocumentTitle('Terms of Service');

    return (
        <div className={styles.termsContainer}>
            <h1 className={styles.termsTitle}>Terms of Service</h1>
            <p className={styles.termsDate}>Effective Date: <b>January 1, 2025</b></p>
  
            <section className={styles.termsSection}>
                <h2>1. Acceptance of Terms</h2>
                <p>
                    By creating an account or using our services, you agree to comply with and be bound by these Terms of Service.
                    If you do not agree with these terms, you must not use our services.
                </p>
            </section>
    
            <section className={styles.termsSection}>
                <h2>2. User Accounts</h2>
                <ul>
                    <li>You must provide accurate and complete information when creating an account.</li>
                    <li>You are responsible for maintaining the confidentiality of your login credentials.</li>
                    <li>You agree not to share your account or allow others to access it.</li>
                </ul>
            </section>
    
            <section className={styles.termsSection}>
                <h2>3. Acceptable Use</h2>
                <ul>
                    <li>Violate any applicable laws or regulations.</li>
                    <li>Interfere with or disrupt the integrity or performance of the service.</li>
                    <li>Attempt to gain unauthorized access to the system or other users’ data.</li>
                </ul>
            </section>
    
            <section className={styles.termsSection}>
                <h2 >4. Termination</h2>
                <p>
                    We reserve the right to suspend or terminate your account if you violate these terms or misuse the service.
                </p>
            </section>
    
            <section className={styles.termsSection}>
                <h2>5. Modifications</h2>
                <p>
                    We may modify these Terms at any time. Continued use of the service constitutes your acceptance of the revised styles.
                </p>
            </section>
    
            <section className={styles.termsSection}>
                <h2>6. Disclaimers and Limitation of Liability</h2>
                <ul>
                    <li>The service is provided “as is” and we make no guarantees regarding availability or reliability.</li>
                    <li>We are not liable for any indirect, incidental, or consequential damages resulting from your use of the service.</li>
                </ul>
            </section>
    
            <section className={styles.termsSection}>
                <h2>7. Governing Law</h2>
                <p>
                    These Terms are governed by the laws of <b>Philippines</b>.
                </p>
            </section>
        </div>
    );
};

export default TermsOfService;