import styles from './BackgroundPattern.module.css';

/**
 * BackgroundPattern Component
 * Renders large blue glowing circles (868x868px) across the website
 */
export default function BackgroundPattern() {
    return (
        <div className={styles.bgPatternWrapper} aria-hidden="true">
            {/* CENTER circles - Fully visible */}
            <div className={`${styles.bgCircle} ${styles.bgCircleCenter1}`} />
            <div className={`${styles.bgCircle} ${styles.bgCircleCenter2}`} />
            <div className={`${styles.bgCircle} ${styles.bgCircleCenter3}`} />
            <div className={`${styles.bgCircle} ${styles.bgCircleCenter4}`} />

            {/* RIGHT EDGE circles - Half visible */}
            <div className={`${styles.bgCircle} ${styles.bgCircleRight1}`} />
            <div className={`${styles.bgCircle} ${styles.bgCircleRight2}`} />
            <div className={`${styles.bgCircle} ${styles.bgCircleRight3}`} />

            {/* LEFT EDGE circles - Half visible */}
            <div className={`${styles.bgCircle} ${styles.bgCircleLeft1}`} />
            <div className={`${styles.bgCircle} ${styles.bgCircleLeft2}`} />
            <div className={`${styles.bgCircle} ${styles.bgCircleLeft3}`} />
        </div>
    );
}
