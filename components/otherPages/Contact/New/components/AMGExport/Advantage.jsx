import React from 'react';
import { useCountUp } from '../../hooks/useCountUp';
import styles from './AMGExport.module.css';

const StatCard = ({ target, suffix, title, description }) => {
    const { count, ref } = useCountUp(target);
    return (
        <div className={styles.statCard}>
            <div ref={ref} className={styles.statCardNumberContainer}>
                <span>{count}</span>
                {suffix && <span>{suffix}</span>}
            </div>
            <h3>{title}</h3>
            <p>{description}</p>
        </div>
    );
};

const Advantage = () => (
    <section className={styles.advantageSection}>
        <div className={styles.container}>
            <h2 className={styles.sectionTitle}>The Ahmed Al Maghribi Advantage</h2>
            <div className={styles.advantageGrid}>
                <StatCard target={91} suffix="+" title="Countries Served" description="Proudly serving partners and customers across the globe." />
                <StatCard target={25} suffix="+" title="Years of Mastery" description="Decades of crafting exquisite fragrances with traditional techniques." />
                <StatCard target={500} suffix="+" title="Unique Scents" description="A vast portfolio of unique and beloved fragrances for diverse markets." />
                <StatCard target={100} suffix="%" title="Partner Support" description="Comprehensive marketing, training, and logistical support for all our partners." />
            </div>
        </div>
    </section>
);

export default Advantage;