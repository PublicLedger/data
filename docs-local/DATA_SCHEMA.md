# Data Schema: Normalized JSON for News App

## Overview

Normalized JSON schema for the `@publicledger/data` NPM package. Transforms CSV campaign finance and election data into a queryable, static structure powering a Ghost theme-based news application.

**Design Principles:**
- Entity-based architecture (candidates, offices, donors, campaigns)
- Static JSON with version metadata for cache busting
- Pre-computed aggregates for performance
- Supports 700+ pages via Ghost routes
- No runtime API calls - all data bundled at build

**Data Sources (Historical 2016-2023):**
- `elections/122923_Lancaster_elections_results_enhanced_2016_2023primary.csv`
- `campfin/Contributions/` - Individual and organizational contributions
- `campfin/Expenses/` - Campaign expenditures
- `campfin/Receipts/`, `In-Kind/`, `Debts/` - Other finance records

---

## File Organization

```
data/
  meta.json                        # Version metadata, cache key, counts
  entities/
    candidates.json                 # All candidates
    offices.json                    # All elected positions
    donors.json                     # All donors (individuals + orgs)
  elections/
    by-year/
      2023.json                     # All 2023 races
      2019.json
    by-office/
      county-commissioner.json      # Historical races per office
  finance/
    aggregates.json                 # Summary stats, top donors, trends
    campaigns/
      camp-{candidate}-{year}-{id}.json
    donors/
      donor-ind-{clusterId}.json
      donor-org-{slug}.json
  indexes/
    candidates-by-name.json         # A-Z index
    candidates-by-office.json       # Office → candidates map
```

---

## Schema Examples

### meta.json

```json
{
  "version": "2024-01-15T10:30:00Z",
  "generated": "2024-01-15T10:30:00Z",
  "dataRange": {"elections": "2016-2023", "finance": "2016-2023"},
  "counts": {
    "candidates": 450, "offices": 85, "elections": 8,
    "races": 320, "donors": 8500, "contributions": 45000
  },
  "cacheKey": "20240115103000"
}
```

### entities/candidates.json

```json
{
  "version": "2024-01-15T10:30:00Z",
  "candidates": [
    {
      "id": "ahmed-ahmed-001",
      "slug": "ahmed-ahmed",
      "name": {"full": "AHMED AHMED", "first": "AHMED", "last": "AHMED"},
      "races": ["2023-primary-lancaster-city-council-2yr"],
      "campaigns": ["camp-ahmed-2023-001"],
      "totalRaised": 15000,
      "totalSpent": 12500,
      "party": "DEM"
    }
  ]
}
```

### entities/offices.json

```json
{
  "version": "2024-01-15T10:30:00Z",
  "offices": [
    {
      "id": "office-county-commissioner",
      "slug": "county-commissioner",
      "name": "County Commissioner",
      "jurisdiction": "LANCASTER",
      "level": "county",
      "seats": 3,
      "termLength": 4,
      "elections": ["2023-primary", "2019-primary"],
      "incumbents": ["alice-yoder-001"]
    }
  ]
}
```

### entities/donors.json

```json
{
  "version": "2024-01-15T10:30:00Z",
  "donors": {
    "individuals": [
      {
        "id": "donor-ind-757",
        "clusterId": "757",
        "slug": "carol-aastad",
        "name": "CAROL AASTAD",
        "address": {"city": "WILLOW STREET", "state": "PA", "zip": "17584"},
        "totalContributions": 10350,
        "contributionCount": 5
      }
    ],
    "organizations": [
      {
        "id": "donor-org-actblue",
        "slug": "actblue-pa",
        "name": "ACTBLUE PA",
        "type": "PAC",
        "totalContributions": 500000
      }
    ]
  }
}
```

### elections/by-year/2023.json

```json
{
  "version": "2024-01-15T10:30:00Z",
  "year": 2023,
  "electionType": "Municipal Primary",
  "date": "2023-05-16",
  "races": [
    {
      "id": "2023-primary-county-commissioner",
      "slug": "2023-county-commissioner",
      "office": "office-county-commissioner",
      "candidates": [
        {
          "candidateId": "alice-yoder-001",
          "name": "Alice Yoder",
          "party": "DEM",
          "raised": 45000,
          "spent": 38000
        }
      ],
      "totalRaised": 250000
    }
  ]
}
```

### finance/campaigns/camp-ahmed-2023-001.json

```json
{
  "version": "2024-01-15T10:30:00Z",
  "campaign": {
    "id": "camp-ahmed-2023-001",
    "candidateId": "ahmed-ahmed-001",
    "election": "2023-primary-lancaster-city-council-2yr"
  },
  "summary": {
    "totalRaised": 15000,
    "totalSpent": 12500,
    "contributorCount": 45
  },
  "contributions": [
    {
      "date": "2023-01-02",
      "amount": 10000,
      "donor": {"id": "donor-ind-757", "name": "CAROL AASTAD", "type": "individual"}
    }
  ],
  "expenditures": [
    {
      "date": "2023-03-15",
      "amount": 500,
      "category": "MEDIA_ACTIVITIES",
      "subcategory": "YARD_SIGNS",
      "paidTo": "SIGN-A-RAMA"
    }
  ]
}
```

### finance/aggregates.json

```json
{
  "version": "2024-01-15T10:30:00Z",
  "period": "2016-2023",
  "summary": {
    "totalRaised": 15000000,
    "totalSpent": 14200000,
    "candidateCount": 450
  },
  "topDonors": {
    "individuals": [
      {"donorId": "donor-ind-757", "name": "CAROL AASTAD", "total": 10350}
    ]
  },
  "spendingByCategory": {
    "MEDIA_ACTIVITIES": 4500000,
    "CAMPAIGNING_ACTIVITIES": 3200000
  }
}
```

---

## Implementation Phases

### Phase 1: Mock Data (Current Repo)

1. Create `data/mock/` directory structure
2. Generate 5-10 sample candidates with realistic data
3. Add Gulp task: copy `data/mock/` → `assets/built/data/`
4. Create Handlebars helpers for data loading
5. Add Ghost routes in `routes.yaml`
6. Build templates: `candidate.hbs`, `office.hbs`, etc.

### Phase 2: NPM Package (Future `@publicledger/data`)

1. ETL script: CSV → normalized JSON
2. CLI tool for data generation
3. Optional GraphQL service

### Phase 3: Integration

1. Replace `data/mock/` with real NPM output
2. Performance testing with full dataset
3. Deploy to production Ghost

---

## Routes & Templates

**routes.yaml patterns:**
```yaml
routes:
  /candidates/{slug}/:
    template: candidate
  /offices/{slug}/:
    template: office
  /elections/{year}/:
    template: election
  /donors/{id}/:
    template: donor
  /finance/:
    template: finance-explorer
```

**Templates needed:**
- `candidate.hbs` - Load candidate JSON, display races + finance
- `office.hbs` - Load office JSON, display historical races
- `election.hbs` - Load year JSON, display all races
- `donor.hbs` - Load donor JSON, display contributions
- `finance-explorer.hbs` - Interactive finance explorer

---

## Expense Categories

From CSV `expense_type` field:
- `GENERAL_OPERATING` - Banking, legal, supplies
- `MEDIA_ACTIVITIES` - Yard signs, advertising, direct mail
- `CAMPAIGNING_ACTIVITIES` - Food, events, supplies
- `FUNDRAISING_ACTIVITIES` - Event costs, ticket sales
- `POLITICAL_ACTIVITIES` - Contributions to other campaigns

Subcategories (`expense_detail`):
- `YARD_SIGNS`, `DIRECT_MAIL`, `GENERAL_PROD`
- `BANKING`, `LEGAL_COMPLIANCE`
- `SUPPLIES`, `MAIL`, `FOOD_DRINK`, `EVENTS`

---

## Cache Busting Strategy

```javascript
// Load meta first
const meta = await fetch('/data/meta.json').then(r => r.json());

// Append cache key to all subsequent requests
const candidates = await fetch(`/data/entities/candidates.json?v=${meta.cacheKey}`);
```

All entity files include matching `version` field. Version mismatch = stale cache.

---

## Mock Data Guidelines

Generate 5-10 candidates with:

**Diversity:**
- Mix DEM, REP, cross-filed
- Different offices (county, city, school)
- Finance range $0 to $100k+
- Winners and losers

**Realistic Relationships:**
- Donors contributing to multiple candidates
- Candidates in multiple elections
- Shared committees/PACs

**Complete Records:**
- Contributions from individuals + orgs
- Expenses across all categories
- Source file tracking (`sourceFile`, `sourcePage`)

**Sample Profiles:**
- Ahmed Ahmed - Lancaster City Council, DEM, $15k
- Alice Yoder - County Commissioner, DEM, $45k
- Carol Aastad - Top donor, $10k total
- ActBlue PA - Top org donor, $500k
- Small campaign (<$5k)
- Large campaign (>$50k)

---

## Technical Notes

**Data Size:**
- Keep individual files <1MB
- Paginate large donor lists if needed
- Pre-compute expensive aggregates

**Search:**
- Client-side: Fuse.js or Lunr.js on loaded indexes
- Server-side: Consider Algolia/Meilisearch later

**Charts:**
- Static SVGs in `assets/charts/`
- Datawrapper embed IDs in campaign JSON
- Client-side D3.js/Chart.js with loaded data

**Future:**
- Precinct-level data (when available)
- Demographics integration
- Real-time election results
- CSV export for researchers
