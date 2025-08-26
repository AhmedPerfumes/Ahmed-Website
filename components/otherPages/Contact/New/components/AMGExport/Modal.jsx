import React from 'react';
import styles from './AMGExport.module.css';

const Modal = ({ product, onClose }) => {
    if (!product) return null;

    return (
        <div className={`${styles.modalOverlay} ${product ? styles.visible : ''}`} onClick={onClose}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2>{product.name}</h2>
                    <button onClick={onClose} className={styles.modalCloseBtn}>&times;</button>
                </div>
                <div className={styles.modalBody}>
                    <img src={product.imageUrl} alt={product.name} />
                    <p>{product.description}</p>
                </div>
            </div>
        </div>
    );
};

export default Modal;