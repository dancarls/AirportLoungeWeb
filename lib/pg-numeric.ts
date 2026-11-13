/**
 * PostgreSQL `numeric` / `decimal` (OID 1700) is sent as text because the
 * type can exceed IEEE-754. Columns in this schema are bounded:
 *   rating       DECIMAL(3, 2)
 *   guest_fee    DECIMAL(10, 2)
 *   latitude     DECIMAL(10, 6)
 *   longitude    DECIMAL(10, 6)
 * Those values round-trip through Number the same way PostgREST did, which
 * is what `.toFixed`, `typeof === 'number'`, and JSON-LD geo expect.
 */
export function parsePgNumeric(value: string): number {
  return Number(value)
}
