# Claude Production Readiness Plan

A comprehensive checklist for ensuring applications are production-ready, based on lessons learned from security reviews and deployments.

---

## 1. Security Checklist

### Authentication & Authorization
- [ ] Strong password requirements (12+ chars, uppercase, lowercase, number, special char)
- [ ] Server-side password validation (don't rely only on client-side)
- [ ] Rate limiting on login attempts (e.g., 5 attempts per 15 minutes)
- [ ] Rate limiting on registration (e.g., 3 attempts per hour)
- [ ] Timing attack protection (use constant-time comparison for auth)
- [ ] User enumeration prevention (generic error messages)
- [ ] Session cookie security flags (httpOnly, secure, sameSite)
- [ ] CSRF protection enabled
- [ ] JWT tokens with appropriate expiry

### API Security
- [ ] Rate limiting on all API endpoints
- [ ] Input validation and sanitization
- [ ] Authorization checks on all protected routes (prevent IDOR)
- [ ] No sensitive data in error messages
- [ ] Proper error handling (don't expose stack traces)

### Security Headers
- [ ] Content-Security-Policy (CSP) - restrict script/style sources
- [ ] X-Frame-Options: DENY (prevent clickjacking)
- [ ] X-Content-Type-Options: nosniff
- [ ] Referrer-Policy: strict-origin-when-cross-origin
- [ ] Permissions-Policy (disable unnecessary APIs)
- [ ] Strict-Transport-Security (HSTS)

### Data Protection
- [ ] Passwords hashed with bcrypt (cost factor 12+)
- [ ] No sensitive data in logs
- [ ] Environment variables for secrets
- [ ] Database connection strings secured
- [ ] No hardcoded credentials

---

## 2. SEO Checklist

### Essential Files
- [ ] robots.txt (crawl rules)
- [ ] sitemap.xml or dynamic sitemap
- [ ] manifest.json (PWA support)
- [ ] favicon.ico and apple-touch-icon

### Metadata
- [ ] metadataBase configured for absolute URLs
- [ ] Title tags (with template for consistency)
- [ ] Meta descriptions (unique per page)
- [ ] Open Graph tags (og:title, og:description, og:image)
- [ ] Twitter Card tags
- [ ] Canonical URLs

### Images
- [ ] OG image (1200x630px)
- [ ] Alt text on all images
- [ ] Optimized image formats (WebP where supported)

### Structured Data
- [ ] JSON-LD schema markup
- [ ] Organization/Business schema
- [ ] Breadcrumb schema (if applicable)

---

## 3. Performance Checklist

### Core Web Vitals
- [ ] First Contentful Paint < 1.8s
- [ ] Largest Contentful Paint < 2.5s
- [ ] First Input Delay < 100ms
- [ ] Cumulative Layout Shift < 0.1

### Optimization
- [ ] Code splitting enabled
- [ ] Image optimization (next/image or equivalent)
- [ ] Font optimization (preload, font-display: swap)
- [ ] CSS/JS minification
- [ ] Gzip/Brotli compression

### Caching
- [ ] Static assets cached (long cache headers)
- [ ] API responses cached where appropriate
- [ ] Database query optimization

---

## 4. Testing Checklist

### E2E Tests
- [ ] Authentication flows (login, register, logout)
- [ ] Protected route access control
- [ ] Form validation (client and server)
- [ ] Error handling
- [ ] Navigation and routing
- [ ] Responsive design (mobile, tablet, desktop)

### Accessibility Tests
- [ ] Keyboard navigation
- [ ] Screen reader compatibility
- [ ] Form labels and ARIA attributes
- [ ] Color contrast
- [ ] Skip to main content link

### Performance Tests
- [ ] Page load time < 3s
- [ ] First Contentful Paint measurement
- [ ] Bundle size analysis

---

## 5. Infrastructure Checklist

### Environment
- [ ] Environment variables documented
- [ ] Production vs development configs separated
- [ ] Database migrations ready
- [ ] Backup strategy in place

### Monitoring
- [ ] Error tracking (Sentry or equivalent)
- [ ] Analytics (Vercel Analytics, Google Analytics)
- [ ] Uptime monitoring
- [ ] Log aggregation

### Deployment
- [ ] CI/CD pipeline configured
- [ ] Build passes without errors
- [ ] No TypeScript errors
- [ ] No ESLint errors/warnings
- [ ] Dependencies up to date (npm audit clean)

---

## 6. Dependency Security

### Regular Checks
- [ ] Run `npm audit` - fix all vulnerabilities
- [ ] Update dependencies regularly
- [ ] Check for deprecated packages
- [ ] Review new dependency additions

### Critical Packages
- [ ] Framework (Next.js, React) up to date
- [ ] Auth library (NextAuth) up to date
- [ ] Database client (Prisma) up to date
- [ ] No known CVEs in dependencies

---

## 7. Code Quality

### Standards
- [ ] Consistent code formatting (Prettier)
- [ ] Linting rules enforced (ESLint)
- [ ] TypeScript strict mode
- [ ] No `any` types (where avoidable)

### Documentation
- [ ] README with setup instructions
- [ ] Environment variables documented
- [ ] API documentation (if applicable)
- [ ] Deployment instructions

---

## Quick Command Reference

```bash
# Security audit
npm audit
npm audit fix

# Build check
npm run build

# Run E2E tests
npx playwright test

# Check for outdated packages
npm outdated

# Update packages
npm update
```

---

## Priority Order for Fixes

1. **Critical Security** - Authentication bypasses, SQL injection, XSS
2. **High Security** - Rate limiting, IDOR, sensitive data exposure
3. **Build Errors** - TypeScript errors, missing dependencies
4. **Medium Security** - Security headers, session management
5. **Performance** - Core Web Vitals, optimization
6. **SEO** - Metadata, structured data
7. **Testing** - E2E coverage, accessibility

---

*Generated from production deployment lessons - MEMA Consultants*
