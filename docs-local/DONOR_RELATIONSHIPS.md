# Donor Relationships Feature

Mock data includes relationship tracking between donors (family members, business partners, organizational affiliations).

## Data Structure

**Relationship Record** in `test/mocks/publicledger-data/data/entities/donors.json`:

```json
{
  "donors": {
    "relationships": [
      {
        "id": "rel-siblings-wellington",
        "type": "siblings",
        "description": "Siblings",
        "members": ["donor-ind-8821", "donor-ind-8822"],
        "notes": "Sarah and Michael Wellington are siblings..."
      }
    ]
  }
}
```

**Fields:**
- `id` - Unique identifier
- `type` - Machine-readable type (siblings, spouse, business-partner)
- `description` - Human-readable label
- `members` - Array of donor IDs
- `notes` - Optional context

**Individual Donor Reference:**

```json
{
  "id": "donor-ind-8821",
  "name": "SARAH WELLINGTON",
  "relationships": ["rel-siblings-wellington"]
}
```

---

## API Functions

**`getRelationship(relationshipId)`** - Fetch specific relationship

```javascript
const rel = await PublicLedgerData.getRelationship('rel-siblings-wellington');
```

**`getDonorRelationships(donorId)`** - Get all relationships for a donor

```javascript
const rels = await PublicLedgerData.getDonorRelationships('donor-ind-8821');
```

---

## Front-End Display

`donor.hbs` template automatically displays relationships:

1. Checks for relationships on load
2. Hides section if none exist
3. Shows card with:
   - Relationship type/description
   - Editorial notes
   - Links to related donors
   - Contribution totals

**Example output:**

```
Related Donors
━━━━━━━━━━━━━━━━━━━━━
Siblings

Sarah and Michael Wellington are siblings...

Related Donors:
• Michael Wellington - $4,200 in 3 contributions
```

---

## Example Data

**Sarah Wellington** (`donor-ind-8821`):
- Address: 423 Oak Ridge Lane, Lancaster, PA
- Total: $5,500 in 4 contributions

**Michael Wellington** (`donor-ind-8822`):
- Address: 789 Maple Street, Lancaster, PA
- Total: $4,200 in 3 contributions

**Combined Impact:** $9,700 from Wellington family

---

## Multi-Member Relationships

Supports 2+ members:

```json
{
  "id": "rel-family-smith",
  "type": "family",
  "members": ["donor-ind-001", "donor-ind-002", "donor-ind-003"]
}
```

---

## Performance

- Relationships cached with donor entities (single JSON file)
- No additional HTTP for basic display
- Fetching related donor details is async (one request per)
- Consider lazy loading for donors with >5 relationships
