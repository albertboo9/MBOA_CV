import React from 'react';
import styles from './LoadingOrbit.module.css';

const LoadingOrbit = ({ message = "Chargement en cours...", size = "medium" }) => {
  return (
    <div className={`${styles.loadingScreen} ${styles[size]}`}>
      <div className={styles.loadingOrbit}>
        <div className={styles.orbitalCircle}></div>
        <div className={styles.orbitalCircle}></div>
        <div className={styles.orbitalCircle}></div>

        <div className={styles.orbitalDot}></div>
        <div className={styles.orbitalDot}></div>
        <div className={styles.orbitalDot}></div>

        <div className={styles.loadingCore}>
          <div className={styles.coreGlow}></div>
          <div className={styles.coreIcon}>⚡</div>
        </div>
      </div>

      <div className={styles.loadingText}>
        <span className={styles.textGlow}>{message}</span>
        <div className={styles.textPulse}></div>
      </div>

      <div className={styles.progressRing}>
        <div className={styles.progressCircle}></div>
      </div>
    </div>
  );
};

export default LoadingOrbit;