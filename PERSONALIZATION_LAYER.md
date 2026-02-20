# Production-Grade Personalization Layer

## Overview

This portfolio implements an **adaptive, consent-aware personalization system** that dynamically adjusts hero CTAs, content ordering, and messaging based on visitor signals (recruiter, client, collaborator, general).

## Architecture

### Core Components

1. **`PersonaProvider`** (`src/PersonaContext.tsx`)
   - Manages persona state (`recruiter | client | collaborator | general`)
   - Detection priority: Query params → Stored preference → Referrer heuristic → Default
   - Respects consent status before accessing storage

2. **`ConsentProvider`** (`src/ConsentContext.tsx`)
   - Manages GDPR-compliant consent (`unknown | granted | denied`)
   - Persists consent choice
   - Blocks storage access until consent is given

3. **Persona Detection** (`src/persona.ts`)
   - Query param parsing (`?persona=recruiter`)
   - UTM tag support (`utm_campaign`, `utm_content`)
   - Referrer heuristics (LinkedIn → recruiter, GitHub → collaborator, etc.)
   - Storage persistence (with consent)

### Production Features

#### ✅ Error Boundaries
- **`ErrorBoundary`** component wraps the entire personalization layer
- Prevents app crashes if persona detection fails
- Logs errors to console and optional analytics (Sentry integration ready)

#### ✅ Analytics & Telemetry
- **`usePersonaAnalytics`** hook tracks:
  - Persona detection events
  - Consent decisions
  - CTA clicks
  - Section views
- Supports Google Analytics 4 (`gtag`) and custom endpoints
- Non-blocking (failures don't break the app)

#### ✅ Performance Monitoring
- **`usePersonaPerformance`** hook tracks:
  - Persona detection time
  - Layout render time
  - Alerts if detection >100ms or render >200ms
- Uses Performance API for accurate measurements

#### ✅ Graceful Degradation
- **`personaFallback.ts`** utilities:
  - In-memory fallback when localStorage unavailable
  - Storage availability detection
  - Safe wrappers that never throw

#### ✅ Type Safety
- Full TypeScript coverage
- Strict persona union types
- MotionValue types for Framer Motion

## Usage

### Basic Persona Detection

```tsx
import { usePersona } from './PersonaContext';

function MyComponent() {
  const { persona } = usePersona();
  
  return (
    <div>
      {persona === 'recruiter' && <RecruiterContent />}
      {persona === 'client' && <ClientContent />}
      {/* ... */}
    </div>
  );
}
```

### Tracking User Interactions

```tsx
import { usePersonaAnalytics } from './hooks/usePersonaAnalytics';
import { usePersona } from './PersonaContext';

function CTAButton() {
  const { persona } = usePersona();
  const { trackCTA } = usePersonaAnalytics();
  
  const handleClick = () => {
    trackCTA('View Projects', persona);
    // ... navigate to projects
  };
  
  return <button onClick={handleClick}>View Projects</button>;
}
```

### Consent Management

```tsx
import { useConsent } from './ConsentContext';

function ConsentBanner() {
  const { status, grant, deny } = useConsent();
  
  if (status !== 'unknown') return null;
  
  return (
    <div>
      <button onClick={grant}>Allow</button>
      <button onClick={deny}>Deny</button>
    </div>
  );
}
```

## Detection Signals

### 1. Query Parameters (Highest Priority)
- `?persona=recruiter` → `recruiter`
- `?persona=client` → `client`
- `?persona=collaborator` → `collaborator`
- `?persona=debug` → `general` (no persistence)
- `?utm_campaign=recruiter` → `recruiter`

### 2. Stored Preference (Requires Consent)
- Reads `localStorage.portfolioPersona`
- Only used if consent is `granted`

### 3. Referrer Heuristics
- **Recruiter**: `linkedin.com`, `wellfound.com`, `angel.co`
- **Collaborator**: `github.com`, `gitlab.com`, `stackoverflow.com`, `medium.com`, `youtube.com`
- **Client**: `producthunt.com`, `indiehackers.com`, `vercel.app`

### 4. Default Fallback
- `general` persona if no signals detected

## Persona-Specific Layouts

### Recruiter
- **Order**: Home → Projects → Awards → Recommendations → Skills → Impact → Thoughts → Videos → Contact
- **Hero CTA**: "View Projects & Case Studies" + "Open Resume"
- **Focus**: Measurable outcomes, reliability, hiring signals

### Client/Founder
- **Order**: Home → Projects → Impact → Skills → Recommendations → Awards → Thoughts → Videos → Contact
- **Hero CTA**: "Book a Discovery Call" + "See Impact Stories"
- **Focus**: Business value, risk reduction, ROI

### Collaborator/Engineer
- **Order**: Home → Skills → Impact → Projects → Thoughts → Videos → Recommendations → Awards → Contact
- **Hero CTA**: "Explore Technical Deep Dives" + "View GitHub"
- **Focus**: Technical depth, trade-offs, open-source

### General Visitor
- **Order**: Home → Skills → Recommendations → Awards → Projects → Thoughts → Videos → Impact → Contact
- **Hero CTA**: "Meet the Mindset" + "See What Others Say"
- **Focus**: Personality, storytelling, exploration

## Analytics Integration

### Google Analytics 4

The layer automatically sends events if `gtag` is available:

```javascript
// In your HTML or analytics setup
window.gtag = window.gtag || function() { /* ... */ };

// Events sent automatically:
// - persona_detected
// - consent_granted / consent_denied
// - cta_clicked (when you call trackCTA)
// - section_viewed (when you call trackSectionView)
```

### Custom Analytics Endpoint

Set a custom endpoint for server-side tracking:

```javascript
window.__PORTFOLIO_ANALYTICS_ENDPOINT__ = 'https://your-api.com/analytics';
```

Events are sent as POST requests with:
- Event type and metadata
- Timestamp
- User agent
- Current URL

## Error Handling

### Error Boundary
The `ErrorBoundary` component catches errors in:
- Persona detection logic
- Consent management
- Context providers

If an error occurs:
1. Error is logged to console
2. Sent to Sentry (if configured)
3. User sees a friendly fallback UI
4. App continues with default `general` persona

### Storage Failures
- Automatically falls back to in-memory storage
- No errors thrown to user
- Session-only persistence (cleared on reload)

## Performance Considerations

### Detection Time
- Target: <50ms
- Alert threshold: >100ms
- Measured via Performance API

### Render Time
- Target: <100ms
- Alert threshold: >200ms
- Includes layout reordering

### Bundle Size Impact
- Persona detection: ~2KB gzipped
- Analytics hooks: ~1KB gzipped
- Error boundary: ~1KB gzipped
- **Total**: ~4KB additional bundle size

## Testing

### Manual Testing

1. **Test Query Params**:
   ```
   http://localhost:5173/?persona=recruiter
   http://localhost:5173/?persona=client
   http://localhost:5173/?persona=debug
   ```

2. **Test Referrer**:
   - Open site from LinkedIn → Should detect `recruiter`
   - Open from GitHub → Should detect `collaborator`

3. **Test Consent Flow**:
   - First visit → Consent banner appears
   - Click "Allow" → Persona persists
   - Click "Deny" → Persona only for session

4. **Test Error Handling**:
   - Disable localStorage in DevTools
   - Site should still work (memory fallback)

### Debug Mode

Add `?persona=debug` to URL:
- Forces `general` persona
- Skips persistence
- Useful for testing default layout

## Future Enhancements

- [ ] A/B testing framework integration
- [ ] Server-side persona detection (via headers)
- [ ] Machine learning-based persona prediction
- [ ] Real-time persona switching UI
- [ ] Persona-specific analytics dashboards

## Privacy & Compliance

- ✅ GDPR-compliant consent management
- ✅ No cross-site tracking
- ✅ No third-party scripts (unless you add them)
- ✅ Session-only fallback when consent denied
- ✅ Clear consent explanation in banner

## Support

For issues or questions:
1. Check console for error messages
2. Verify consent status in React DevTools
3. Check `localStorage` for stored values
4. Review Performance API marks for timing issues
