/**
 * Constructs the official BIS e-Sale search URL for a given IS standard number.
 *
 * URL Pattern:
 * https://standardsbis.bsbedge.com/BIS_SearchStandard.aspx?Standard_Number={ENCODED_IS_NUMBER}&id=0
 *
 * Fallback:
 * https://standards.bis.gov.in/website/know-your-standards
 */
export function getBisStandardUrl(standardNumber?: string): string {
  if (!standardNumber || typeof standardNumber !== 'string' || !standardNumber.trim()) {
    return 'https://standards.bis.gov.in/website/know-your-standards';
  }

  const trimmed = standardNumber.trim();
  const encoded = encodeURIComponent(trimmed);
  return `https://standardsbis.bsbedge.com/BIS_SearchStandard.aspx?Standard_Number=${encoded}&id=0`;
}
