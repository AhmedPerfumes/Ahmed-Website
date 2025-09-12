import React from "react";
import { Package, Truck, CheckCircle } from "lucide-react";

const statusInfo = {
  processing: {
    icon: Package,
    label: "Processing",
    color: {
      bg: "#fef3c7", // bg-yellow-100
      text: "#b45309" // text-yellow-800
    },
  },
  shipped: {
    icon: Truck,
    label: "Shipped",
    color: {
      bg: "#dbeafe", // bg-blue-100
      text: "#1e40af" // text-blue-800
    },
  },
  delivered: {
    icon: CheckCircle,
    label: "Delivered",
    color: {
      bg: "#dcfce7", // bg-green-100
      text: "#166534" // text-green-800
    },
  },
};

export default function OrderStatusCard({ order }) {
  const currentStatus = statusInfo[order.status] || statusInfo.processing;
  const StatusIcon = currentStatus.icon;

  const cardStyle = {
    overflow: 'hidden',
    border: '1px solid #e7e5e4', // border-stone-200
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // bg-white/80
    backdropFilter: 'blur(4px)', // backdrop-blur-sm
    marginTop: '0.75rem', // mt-3
    borderRadius: '0.5rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
  };

  const cardHeaderStyle = {
    backgroundColor: 'rgba(250, 250, 249, 0.5)', // bg-stone-50/50
    padding: '1rem',
    borderBottom: '1px solid #e7e5e4', // border-b border-stone-200
  };

  const iconContainerStyle = {
    padding: '0.5rem',
    backgroundColor: '#f5f5f4', // bg-stone-100
    borderRadius: '0.5rem',
  };

  const titleStyle = {
    fontSize: '0.875rem', // text-sm
    fontWeight: '600', // font-semibold
    color: '#57534e', // text-stone-700
    marginBottom: 0
  };

  const orderIdStyle = {
    fontSize: '0.75rem', // text-xs
    color: '#78716c', // text-stone-500
    marginBottom: 0
  };

  const cardContentStyle = {
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem' // space-y-3
  };

  const sectionTitleStyle = {
    fontSize: '0.75rem', // text-xs
    fontWeight: '500', // font-medium
    color: '#78716c', // text-stone-500
  };

  const badgeStyle = {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    padding: '0.25rem',
    marginTop: '0.25rem',
    backgroundColor: currentStatus.color.bg,
    color: currentStatus.color.text,
    borderRadius: '0.5rem',
    fontWeight: '500'
  };

  const deliveryTextStyle = {
    fontWeight: '600',
    color: '#44403c' // text-stone-800
  };

  const itemsListStyle = {
    listStyleType: 'disc',
    listStylePosition: 'inside',
    fontSize: '0.875rem',
    color: '#57534e', // text-stone-600
    marginTop: '0.25rem',
  };

  return (
    <div style={cardStyle}>
      <div style={cardHeaderStyle}>
        <div className="d-flex align-items-center" style={{ gap: '0.75rem' }}>
          <div style={iconContainerStyle}>
            <StatusIcon style={{ width: '1.25rem', height: '1.25rem', color: '#57534e' }} />
          </div>
          <div>
            <p style={titleStyle}>Order Status</p>
            <p style={orderIdStyle}>Order ID: {order.orderId}</p>
          </div>
        </div>
      </div>
      <div style={cardContentStyle}>
        <div>
          <span style={sectionTitleStyle}>Status</span>
          <div style={badgeStyle}>
            {currentStatus.label}
          </div>
        </div>
        <div>
          <span style={sectionTitleStyle}>Estimated Delivery</span>
          <p style={deliveryTextStyle}>{order.estimatedDelivery}</p>
        </div>
        <div>
          <span style={sectionTitleStyle}>Items</span>
          <ul style={itemsListStyle}>
            {order.items.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}