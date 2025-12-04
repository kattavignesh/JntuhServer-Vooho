# R22 Regulation Configuration Guide

This guide explains how to configure the scraper for **R22 regulation** students across the entire JNTUH university.

## 🎓 R22 Hall Ticket Format

R22 hall tickets follow this format:
```
22 XXXX XXX XXX
│  │    │   │
│  │    │   └── Student serial number (001-999)
│  │    └────── Branch code (3 digits)
│  └─────────── College code (4 digits)
└────────────── Regulation code (22 for R22)
```

**Total:** 12 digits (e.g., `220123456789`)

## 📊 Configuration for Entire University

### Production Configuration (Full University)

For scraping **all R22 students** across JNTUH:

```env
# .env.local or Vercel environment variables

# Hall ticket range - entire R22 batch
HALL_TICKET_START=220000000001
HALL_TICKET_END=229999999999

# Increased workers for faster scraping
SCRAPER_WORKER_COUNT=20

# Reduced delay for speed (be careful not to overload server)
SCRAPER_DELAY_MS=50

# Standard timeout
SCRAPER_TIMEOUT_MS=10000

# Retry failed requests
SCRAPER_MAX_RETRIES=3
```

### Expected Numbers

| Metric | Value |
|--------|-------|
| **Total possible hall tickets** | ~10 billion (most invalid) |
| **Actual students (estimated)** | 100,000 - 200,000 |
| **Valid colleges** | ~200-300 colleges |
| **Students per college** | 500-1,000 average |
| **Scraping time** | 2-4 hours (with 20 workers) |
| **Database size** | ~80-160 MB |

## 🎯 Optimized Ranges (Recommended)

Instead of scanning all 10 billion combinations, use **known college codes**:

### Option 1: Common College Code Ranges

Based on typical JNTUH college codes, you can limit the range:

```env
# More realistic range covering known colleges
HALL_TICKET_START=220100000001
HALL_TICKET_END=220999999999
```

This covers college codes `0100` to `0999` (most JNTUH colleges).

### Option 2: Specific College Ranges

If you know specific college codes:

```env
# Example: Colleges 0100-0500
HALL_TICKET_START=220100000001
HALL_TICKET_END=220500999999
```

### Option 3: Multiple Ranges (Advanced)

For non-contiguous ranges, you'll need to run the scraper multiple times:

**First run:**
```env
HALL_TICKET_START=220100000001
HALL_TICKET_END=220300999999
```

**Second run:**
```env
HALL_TICKET_START=220500000001
HALL_TICKET_END=220700999999
```

## ⚡ Performance Optimization

### Worker Count Recommendations

| Scope | Workers | Delay (ms) | Est. Time |
|-------|---------|------------|-----------|
| **Single college** | 5-10 | 100 | 1-2 min |
| **10 colleges** | 10-15 | 75 | 10-20 min |
| **50 colleges** | 15-20 | 50 | 30-60 min |
| **Entire university** | 20-30 | 50 | 2-4 hours |

### Configuration Examples

**Fast (aggressive):**
```env
SCRAPER_WORKER_COUNT=30
SCRAPER_DELAY_MS=25
```
⚠️ Risk: May trigger rate limiting

**Balanced (recommended):**
```env
SCRAPER_WORKER_COUNT=20
SCRAPER_DELAY_MS=50
```
✅ Good speed, safe

**Safe (conservative):**
```env
SCRAPER_WORKER_COUNT=10
SCRAPER_DELAY_MS=100
```
✅ Slower but very safe

## 🧪 Testing Configuration

Before running the full scrape, test with a small range:

```env
# Test with just 100 hall tickets
HALL_TICKET_START=220100000001
HALL_TICKET_END=220100000100

# Fewer workers for testing
SCRAPER_WORKER_COUNT=5

# Slower for testing
SCRAPER_DELAY_MS=200
```

**Run test scrape:**
```bash
# Call your scraper API endpoint
curl -X POST http://localhost:3000/api/scrape/start \
  -H "x-api-key: your-api-secret-key"
```

## 📋 Step-by-Step Setup for R22

### Step 1: Find Actual College Codes

Visit JNTUH results page and check a few hall tickets to identify:
- Starting college code (e.g., `0100`)
- Ending college code (e.g., `0999`)

### Step 2: Update Configuration

Edit `.env.local`:

```env
# Based on your findings
HALL_TICKET_START=22[FIRST_COLLEGE]000001
HALL_TICKET_END=22[LAST_COLLEGE]999999

# Example:
HALL_TICKET_START=220100000001
HALL_TICKET_END=220999999999
```

### Step 3: Test First

Start with a small range:
```env
HALL_TICKET_START=220100000001
HALL_TICKET_END=220100001000  # Just 1000 tickets
```

### Step 4: Monitor

Check:
- ✅ How many valid results found
- ✅ How many 404s (invalid hall tickets)
- ✅ Scraping speed
- ✅ Error rate

### Step 5: Scale Up

Once testing looks good:
```env
HALL_TICKET_START=220100000001
HALL_TICKET_END=220999999999  # Full range
SCRAPER_WORKER_COUNT=20
```

## 🗄️ Database Considerations

### Storage Requirements

For entire R22 batch (~150,000 students):

```
Students table:     ~30 MB
Marks table:        ~90 MB
Subjects table:     ~1 MB
Total:              ~120 MB
```

**Neon free tier:** 512 MB ✅ (plenty of space)

### Indexing

Make sure these indexes exist for performance:

```sql
CREATE INDEX idx_hall_ticket ON students(hall_ticket);
CREATE INDEX idx_college_code ON students(college_code);
CREATE INDEX idx_regulation ON students(regulation);
```

## 🚀 Deployment Configuration

### Vercel Environment Variables

In Vercel dashboard, set:

```
HALL_TICKET_START=220100000001
HALL_TICKET_END=220999999999
SCRAPER_WORKER_COUNT=20
SCRAPER_DELAY_MS=50
SCRAPER_TIMEOUT_MS=10000
SCRAPER_MAX_RETRIES=3
```

### Vercel Function Limits

⚠️ **Important:** Vercel has execution time limits:

- **Hobby plan:** 10 seconds max
- **Pro plan:** 60 seconds max

**Solution:** The scraper uses **worker pattern** - each worker handles a small range, staying within limits.

## 📊 Monitoring

### What to Track

1. **Progress:**
   - Hall tickets processed
   - Valid results found
   - Invalid hall tickets (404s)

2. **Performance:**
   - Requests per second
   - Average response time
   - Error rate

3. **Database:**
   - Total records inserted
   - Storage used
   - Query performance

### Sample Monitoring Query

```sql
-- Check progress
SELECT 
  COUNT(*) as total_students,
  COUNT(DISTINCT college_code) as colleges,
  AVG(sgpa) as avg_sgpa
FROM students
WHERE regulation = 'R22';
```

## 🎯 Recommended Final Configuration

For **entire R22 university** (production):

```env
# R22 entire university - optimized range
HALL_TICKET_START=220100000001
HALL_TICKET_END=220999999999

# Performance settings
SCRAPER_WORKER_COUNT=20
SCRAPER_DELAY_MS=50
SCRAPER_TIMEOUT_MS=10000
SCRAPER_MAX_RETRIES=3

# JNTUH settings
JNTUH_EXAM_CODE=1323  # Update when results release
JNTUH_RESULT_TYPE=grade

# Caching
ENABLE_REDIS_CACHE=true
CACHE_TTL_SECONDS=604800  # 7 days
```

## 🔍 Finding the Right Range

### Method 1: Check JNTUH Website

1. Go to results.jntuh.ac.in
2. Try a few hall tickets
3. Note which ones are valid
4. Identify the pattern

### Method 2: Binary Search

Start with:
```
220100000001 - valid? → Yes, go lower
220050000001 - valid? → No, go higher
220075000001 - valid? → Yes, this is near the start
```

### Method 3: Use Known College Codes

If you have a list of college codes, construct ranges:
```
College 0123: 220123000001 to 220123999999
College 0456: 220456000001 to 220456999999
```

## 💡 Pro Tips

1. **Start small** - Test with 100-1000 hall tickets first
2. **Monitor errors** - High 404 rate means you're outside valid range
3. **Use Redis** - Cache results to avoid re-scraping
4. **Check duplicates** - Use `ON CONFLICT DO UPDATE` in database
5. **Respect rate limits** - Don't overload JNTUH servers
6. **Run during off-peak** - Night time for better performance

## 🆘 Troubleshooting

### "Too many 404 errors"
→ Your range includes many invalid hall tickets. Narrow the range.

### "Scraping too slow"
→ Increase `SCRAPER_WORKER_COUNT` or decrease `SCRAPER_DELAY_MS`

### "Rate limiting / timeouts"
→ Decrease workers or increase delay

### "Vercel function timeout"
→ Each worker should handle smaller ranges (this is already handled in code)

## ✅ Ready to Scrape R22?

Your configuration is now set for **R22 entire university**!

**Next steps:**
1. Test with small range first
2. Monitor the results
3. Adjust workers/delay as needed
4. Scale up to full university

**Estimated scraping time:** 2-4 hours for entire R22 batch with 20 workers! 🚀
