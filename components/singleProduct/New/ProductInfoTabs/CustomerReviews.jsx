import { useTranslations } from 'next-intl';
import React, { useState, useEffect, useMemo } from 'react';
import Skeleton from '@mui/material/Skeleton';
import styles from './CustomerReviews.module.css';

// ====================================================================
//  HOOK: useHasMounted
// ====================================================================
const useHasMounted = () => {
    const [hasMounted, setHasMounted] = useState(false);
    useEffect(() => {
        setHasMounted(true);
    }, []);
    return hasMounted;
};

// ====================================================================
//  HELPER: StarRating
// ====================================================================
const StarRating = ({ rating, size = '1rem' }) => {
    return (
        <div className={styles.starRatingContainer}>
            {[1, 2, 3, 4, 5].map((i) => (
                <span
                    key={i}
                    className={styles.starRatingItem}
                    style={{ color: i <= rating ? '#C7944B' : '#444', fontSize: size }}
                >
                    ★
                </span>
            ))}
        </div>
    );
};

// ====================================================================
//  COMPONENT: ReviewSummary (Top Section)
// ====================================================================
const ReviewSummary = ({ averageRating, reviewCount, distribution, t, loading }) => {
    return (
        <div className={`row align-items-center pb-5 border-bottom ${styles.borderDarkSubtle}`}>
            {/* Left: Big Score */}
            <div className="col-md-3 text-center text-md-left mb-4 mb-md-0">
                {loading ? (
                    <>
                        <Skeleton variant="text" width={80} height={60} className="mx-auto mx-md-0 bg-white" />
                        <Skeleton variant="text" width={120} height={30} className="mx-auto mx-md-0 bg-white" />
                        <Skeleton variant="text" width={140} height={20} className="mx-auto mx-md-0 bg-white" />
                    </>
                ) : (
                    <>
                        <div className={`display-4 font-weight-bold ${styles.responsiveScore}`}>{reviewCount > 0 ? averageRating.toFixed(1) : '0.0'}</div>
                        <div className="mb-2"><StarRating rating={Math.round(averageRating)} size="1.2rem" /></div>
                        <div className="text-white">{t('basedOn', { count: reviewCount })}</div>
                    </>
                )}
            </div>

            {/* Middle: Bars */}
            <div className="col-md-6 mb-4 mb-md-0 px-md-5">
                {loading ? (
                    [1, 2, 3, 4, 5].map((i) => <Skeleton key={i} height={20} className="bg-white mb-2" />)
                ) : (
                    [5, 4, 3, 2, 1].map((star) => {
                        const count = distribution[star] || 0;
                        const percent = reviewCount > 0 ? (count / reviewCount) * 100 : 0;
                        return (
                            <div key={star} className="d-flex align-items-center mb-2">
                                <span className="small mr-3" style={{ width: '10px' }}>{star}</span>
                                <span className="small mr-3">★</span>
                                <div className={`flex-grow-1 ${styles.progressThin}`}>
                                    <div
                                        className={`h-100 ${styles.progressBarGold}`}
                                        style={{ width: `${percent}%`, borderRadius: '3px' }}
                                    ></div>
                                </div>
                                <span className="small ml-3" style={{ width: '20px', textAlign: 'right' }}>{count}</span>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Right: Verified Notice */}
            <div className="col-md-3 text-center text-md-right">
                {loading ? (
                    <Skeleton variant="text" width={180} height={60} className="mx-auto mx-md-0 bg-white" />
                ) : (
                    <div className="d-inline-flex flex-column align-items-center align-items-md-end">
                        <div className="d-inline-flex align-items-center mb-1" style={{ color: '#C7944B', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>
                            <span className={styles.checkmarkCircle} style={{ marginRight: '6px' }}>✓</span>
                            Verified Purchases
                        </div>
                        <small className="text-muted text-center text-md-right" style={{ fontSize: '0.75rem', lineHeight: '1.4', maxWidth: '210px', color: '#aaa' }}>
                            Reviews are submitted by verified buyers after completing their order.
                        </small>
                    </div>
                )}
            </div>
        </div>
    );
};

// ====================================================================
//  COMPONENT: ReviewList (Bottom Section)
// ====================================================================
const ReviewList = ({ reviews, loading, t }) => {
    const hasMounted = useHasMounted();

    if (loading) return (
        <div className={`mt-4 ${styles.pxResponsiveList}`} style={{ height: '50vh', overflow: 'hidden' }}>
            {[1, 2, 3].map((i) => (
                <div key={i} className={`row py-4 border-top ${styles.borderDarkSubtle}`}>
                    <div className="col-md-3 mb-3 mb-md-0">
                        <Skeleton variant="text" width="70%" height={24} className="mb-1 bg-white" />
                        <Skeleton variant="text" width="40%" height={20} className='bg-white' />
                    </div>
                    <div className="col-md-9">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                            <Skeleton variant="text" width={140} height={24} className='bg-white' />
                            <Skeleton variant="text" width={80} height={20} className='bg-white' />
                        </div>
                        <div className="mt-2">
                            <Skeleton variant="text" width="100%" height={20} className="mb-1 bg-white" />
                            <Skeleton variant="text" width="90%" height={20} className="mb-1 bg-white" />
                            <Skeleton variant="text" width="60%" height={20} className='bg-white' />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    if (!reviews || reviews.length === 0) return <div className="text-center py-5">{t('beFirst')}</div>;

    return (
        <div className={`custom-scroll ${styles.reviewList} ${styles.customScroll} ${styles.pxResponsiveList}`}>
            {reviews.map((review) => (
                <div key={review.id} className={`row py-4 border-top ${styles.borderDarkSubtle}`}>
                    <div className="col-md-3 mb-3 mb-md-0">
                        <h6 className="font-weight-bold mb-1 text-white">{review.customer_name}</h6>
                        <div className={styles.verifiedBadge}>
                            <span className={styles.checkmarkCircle}>✓</span> Verified Buyer
                        </div>
                    </div>
                    <div className="col-md-9">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                            <div className="d-flex align-items-center">
                                <StarRating rating={review.star} size="0.9rem" />
                                <span className="ml-3 font-weight-bold small text-uppercase text-white">
                                    {review.star === 5 ? 'Excellent' : 'Review'}
                                </span>
                            </div>
                            <small>
                                {hasMounted ? new Date(review.created_at).toLocaleDateString() : ''}
                            </small>
                        </div>
                        <p className={styles.responsiveText} style={{ lineHeight: '1.7', opacity: 0.9 }}>{review.comment}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

// ====================================================================
//  PARENT: CustomerReviews
// ====================================================================
const CustomerReviews = ({ product, reviews, loading }) => {
    const t = useTranslations('Reviews');

    const stats = useMemo(() => {
        const total = reviews?.length || 0;
        if (total === 0) return { avg: 0, dist: {} };
        const sum = reviews.reduce((acc, r) => acc + r.star, 0);
        const dist = {};
        reviews.forEach(r => { dist[Math.round(r.star)] = (dist[Math.round(r.star)] || 0) + 1; });
        return { avg: sum / total, dist };
    }, [reviews]);

    return (
        <section className={`${styles.bgDarkTheme} py-5`}>
            <div className="container">
                <ReviewSummary
                    averageRating={stats.avg}
                    reviewCount={reviews?.length || 0}
                    distribution={stats.dist}
                    t={t}
                    loading={loading}
                />

                <ReviewList reviews={reviews} loading={loading} t={t} />
            </div>
        </section>
    );
};

export default CustomerReviews;