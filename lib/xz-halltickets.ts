/**
 * XZ College Hall Ticket Generator (Autonomous Format)
 * 
 * XZ College offers:
 * - CSE (Regular and Lateral)
 * - IT (Lateral)
 * 
 * Format: YYXZYANNNN
 * - YY: Year (23, 24, 25)
 * - XZ: College code
 * - YA: Type + Branch
 *   - 1A = Regular CSE
 *   - 5A = Lateral IT
 * - NNNN: Roll number (multiple formats)
 */

// XZ College Branch Configurations
const XZ_BRANCH_CONFIG = [
    { code: '1A', name: 'CSE (Regular)', type: 'regular' },
    { code: '5A', name: 'IT (Lateral)', type: 'lateral' },
];

// Regulations to scrape
const REGULATIONS = [
    { regulation: 'R22', year: '23' },
    { regulation: 'R23', year: '24' },
    { regulation: 'R25', year: '25' },
];

/**
 * Generate regular roll numbers (0001-0999)
 */
function* generateRegularRolls() {
    for (let roll = 1; roll <= 999; roll++) {
        yield roll.toString().padStart(4, '0');
    }
}

/**
 * Generate lateral entry roll numbers
 * Includes multiple formats:
 * 1. Numeric: 0001-0999
 * 2. B-format: 01B1-99B9
 * 3. A-format: 05A1-99A9 (for CSE lateral)
 */
function* generateLateralRolls() {
    // Format 1: Numeric (0001-0999)
    for (let roll = 1; roll <= 999; roll++) {
        yield roll.toString().padStart(4, '0');
    }

    // Format 2: B-format (01B1-99B9)
    for (let num = 1; num <= 99; num++) {
        const numStr = num.toString().padStart(2, '0');
        for (let suffix = 1; suffix <= 9; suffix++) {
            yield `${numStr}B${suffix}`;
        }
    }

    // Format 3: A-format (05A1-99A9) - for CSE lateral
    for (let num = 5; num <= 99; num++) {
        const numStr = num.toString().padStart(2, '0');
        for (let suffix = 1; suffix <= 9; suffix++) {
            yield `${numStr}A${suffix}`;
        }
    }
}

/**
 * Generate CSE-specific rolls (includes A-format lateral)
 */
function* generateCSERolls() {
    // Regular numeric rolls
    for (let roll = 1; roll <= 999; roll++) {
        yield roll.toString().padStart(4, '0');
    }

    // A-format lateral (05A1-99A9)
    for (let num = 5; num <= 99; num++) {
        const numStr = num.toString().padStart(2, '0');
        for (let suffix = 1; suffix <= 9; suffix++) {
            yield `${numStr}A${suffix}`;
        }
    }
}

/**
 * Generate all XZ college hall tickets
 */
export function* generateXZHallTickets() {
    for (const reg of REGULATIONS) {
        for (const branch of XZ_BRANCH_CONFIG) {
            let rollGenerator;

            if (branch.code === '1A') {
                // CSE: Regular + A-format lateral
                rollGenerator = generateCSERolls();
            } else if (branch.type === 'lateral') {
                // IT: All lateral formats
                rollGenerator = generateLateralRolls();
            } else {
                // Default: Regular only
                rollGenerator = generateRegularRolls();
            }

            for (const roll of rollGenerator) {
                yield `${reg.year}XZ${branch.code}${roll}`;
            }
        }
    }
}

/**
 * Get total count
 */
export function getXZTotalCount() {
    let total = 0;

    for (const reg of REGULATIONS) {
        for (const branch of XZ_BRANCH_CONFIG) {
            if (branch.code === '1A') {
                // CSE: 999 regular + 855 A-format (95 numbers × 9 suffixes)
                total += 999 + (95 * 9);
            } else if (branch.type === 'lateral') {
                // IT: 999 numeric + 891 B-format + 855 A-format
                total += 999 + (99 * 9) + (95 * 9);
            } else {
                total += 999;
            }
        }
    }

    return total;
}

/**
 * Get breakdown by regulation and branch
 */
export function getXZBreakdown() {
    const breakdown = [];

    for (const reg of REGULATIONS) {
        for (const branch of XZ_BRANCH_CONFIG) {
            let rollCount;
            let formats;

            if (branch.code === '1A') {
                rollCount = 999 + (95 * 9);
                formats = 'Numeric (0001-0999) + A-format (05A1-99A9)';
            } else if (branch.type === 'lateral') {
                rollCount = 999 + (99 * 9) + (95 * 9);
                formats = 'Numeric + B-format + A-format';
            } else {
                rollCount = 999;
                formats = 'Numeric only';
            }

            breakdown.push({
                regulation: reg.regulation,
                year: reg.year,
                branch: branch.name,
                branch_code: branch.code,
                type: branch.type,
                total_rolls: rollCount,
                formats: formats,
                sample_numeric: `${reg.year}XZ${branch.code}0001`,
                sample_lateral: branch.code === '1A' ? `${reg.year}XZ${branch.code}05A1` : `${reg.year}XZ${branch.code}01B1`
            });
        }
    }

    return breakdown;
}

/**
 * Get hall tickets as array (for chunking)
 */
export function getXZHallTicketsArray(): string[] {
    return Array.from(generateXZHallTickets());
}

/**
 * Split into chunks for parallel processing
 */
export function getXZChunks(chunkSize: number): string[][] {
    const allTickets = getXZHallTicketsArray();
    const chunks: string[][] = [];

    for (let i = 0; i < allTickets.length; i += chunkSize) {
        chunks.push(allTickets.slice(i, i + chunkSize));
    }

    return chunks;
}

/**
 * Calculate estimated scraping time
 */
export function estimateScrapingTime(delayMs: number, avgStudentsPerBranch: number = 150) {
    const totalTickets = getXZTotalCount();
    const totalBranches = REGULATIONS.length * XZ_BRANCH_CONFIG.length;

    // Realistic estimate based on average students per branch
    const realisticTickets = totalBranches * avgStudentsPerBranch;

    const worstCaseSeconds = (totalTickets * delayMs) / 1000;
    const realisticSeconds = (realisticTickets * delayMs) / 1000;

    return {
        total_possible_tickets: totalTickets,
        realistic_valid_tickets: realisticTickets,
        worst_case_minutes: Math.ceil(worstCaseSeconds / 60),
        realistic_minutes: Math.ceil(realisticSeconds / 60),
        delay_ms: delayMs,
        branches: totalBranches
    };
}
