import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from './Help.module.css';

const helpContent = {
  '': (
    <div className={styles.sectionContent}>
      <h2 className={styles.sectionTitle}>Welcome to Help Center</h2>
      <p>Choose a section below to get assistance.</p>
    </div>
  ),
  faqs: (
    <div className={styles.sectionContent}>
      <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
      <p>Common questions and answers will be listed here...</p>
    </div>
  ),
  contact: (
    <div className={styles.sectionContent}>
      <h2 className={styles.sectionTitle}>Contact Support</h2>
      <p>Email us at: support@moviehouse.com</p>
      <p>Phone: +122-3456789</p>
    </div>
  ),
  privacy: (
    <div className={styles.sectionContent}>
      <h2 className={styles.sectionTitle}>Privacy Policy</h2>
      <p>Your privacy is important to us. Read our full policy here...</p>
    </div>
  ),
};

export default function Help() {
  const router = useRouter();
  const { slug } = router.query;
  const slugPath = slug || [];
  const contentKey = slugPath.join('/');
  const isMainPage = contentKey === '';

  const content = helpContent[contentKey] || (
    <div className={styles.sectionContent}>
      <h2 className={styles.sectionTitle}>Page Not Found</h2>
      <p>The requested help section could not be found.</p>
    </div>
  );

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Help Center</h1>
      
      <div className={styles.content}>
        {content}
        
        {isMainPage && (
          <div className={styles.navGrid}>
            <Link href="/help/faqs" className={styles.navCard}>
              <a className={styles.navLink}>FAQs</a>
            </Link>
            <Link href="/help/contact" className={styles.navCard}>
              <a className={styles.navLink}>Contact Support</a>
            </Link>
            <Link href="/help/privacy" className={styles.navCard}>
              <a className={styles.navLink}>Privacy Policy</a>
            </Link>
          </div>
        )}
      </div>

      <Link href="/" className={styles.homeLink}>
        Go Back Home
      </Link>
    </div>
  );
}