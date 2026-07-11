export function trackOwnedEvent(eventName, properties = {}) {
  if (typeof window === 'undefined') return false;
  if (window.ownedPortfolioTrack) return window.ownedPortfolioTrack(eventName, properties);
  window.ownedPortfolioQueue = window.ownedPortfolioQueue || [];
  window.ownedPortfolioQueue.push([eventName, properties]);
  return true;
}
