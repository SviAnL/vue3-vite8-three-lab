import { onLCP, onINP, onCLS, onFCP, onTTFB, type Metric } from 'web-vitals'

// 上报函数
function reportMetric(metric: Metric) {
  const body = JSON.stringify({
    name: metric.name,
    value: metric.value,
    rating: metric.rating, // 'good' | 'needs-improvement' | 'poor'
    delta: metric.delta,
    id: metric.id,
    navigationType: metric.navigationType,
    url: location.href,
    timestamp: Date.now(),
  })

  console.log(/** keep-console */ '[Web Vitals]', metric)

  // 推荐用 sendBeacon，页面卸载时也能可靠发送
  if (navigator.sendBeacon) {
    navigator.sendBeacon('/api/analytics/vitals', body)
  }
}

export function initWebVitals() {
  // 只在生产环境上报，开发环境可用 console 调试
  const handler = import.meta.env.PROD
    ? reportMetric
    : (metric: Metric) =>
        console.log('[Web Vitals]', metric.name, metric.value, metric.rating, metric)

  onLCP(handler)
  onINP(handler)
  onCLS(handler)
  onFCP(handler)
  onTTFB(handler)
}
