import { useEffect } from 'react';
import { eventBus } from '../eventBus';

/**
 * React hook for subscribing to event bus events
 * 
 * Automatically cleans up subscription on unmount
 * 
 * @param {string} eventName - Name of the event to listen for
 * @param {Function} callback - Function to call when event is emitted
 * @param {Array} dependencies - Dependencies array (like useEffect)
 * 
 * @example
 * function Dashboard() {
 *   useEventBus('payment.received', (payment) => {
 *     console.log('Payment received:', payment);
 *     refreshDashboard();
 *   });
 *   
 *   return <div>Dashboard</div>;
 * }
 */
export function useEventBus(eventName, callback, dependencies = []) {
  useEffect(() => {
    // Subscribe to event
    const unsubscribe = eventBus.on(eventName, callback);
    
    // Cleanup on unmount
    return () => {
      unsubscribe();
    };
  }, [eventName, ...dependencies]);
}

/**
 * Hook for emitting events
 * 
 * @returns {Function} Emit function
 * 
 * @example
 * function PaymentForm() {
 *   const emit = useEventEmit();
 *   
 *   const handleSubmit = (payment) => {
 *     savePayment(payment);
 *     emit('payment.received', payment);
 *   };
 *   
 *   return <form onSubmit={handleSubmit}>...</form>;
 * }
 */
export function useEventEmit() {
  return (eventName, data) => {
    eventBus.emit(eventName, data);
  };
}

export default useEventBus;

