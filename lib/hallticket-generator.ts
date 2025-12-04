/**
 * R22 Hall Ticket Generator
 * Generates all possible R22 hall ticket combinations for both autonomous and regular colleges
 */

// Common R22 Autonomous College Codes (2-letter codes)
const AUTONOMOUS_COLLEGES = [
    'A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9',
    'B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B9',
    'C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9',
    'D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9',
    'E1', 'E2', 'E3', 'E4', 'E5', 'E6', 'E7', 'E8', 'E9',
    'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9',
    'G1', 'G2', 'G3', 'G4', 'G5', 'G6', 'G7', 'G8', 'G9',
    'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'H7', 'H8', 'H9',
    'J1', 'J2', 'J3', 'J4', 'J5', 'J6', 'J7', 'J8', 'J9',
    'K1', 'K2', 'K3', 'K4', 'K5', 'K6', 'K7', 'K8', 'K9',
    'L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8', 'L9',
    'M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7', 'M8', 'M9',
    'N1', 'N2', 'N3', 'N4', 'N5', 'N6', 'N7', 'N8', 'N9',
    'P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8', 'P9',
    'R1', 'R2', 'R3', 'R4', 'R5', 'R6', 'R7', 'R8', 'R9',
    'S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8', 'S9',
    'T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9',
    'V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7', 'V8', 'V9',
    'W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9',
    'XZ', // Your college!
];

// Common Branch Codes for Autonomous
const AUTONOMOUS_BRANCHES = [
    '1A', // CSE
    '1B', // CSE (AI&ML)
    '1C', // CSE (DS)
    '2A', // ECE
    '3A', // EEE
    '4A', // MECH
    '5A', // CIVIL
    '6A', // IT
    '7A', // CSE (Cyber Security)
    '8A', // AIDS
];

/**
 * Generate all R22 Autonomous hall tickets
 * Format: 23XXYANNNN (e.g., 23XZ1A0525)
 */
export function* generateAutonomousHallTickets() {
    for (const college of AUTONOMOUS_COLLEGES) {
        for (const branch of AUTONOMOUS_BRANCHES) {
            for (let roll = 1; roll <= 999; roll++) {
                const rollStr = roll.toString().padStart(4, '0');
                yield `23${college}${branch}${rollStr}`;
            }
        }
    }
}

/**
 * Generate all R22 Regular hall tickets
 * Format: 22CCCCBBBNNN (e.g., 220123456789)
 */
export function* generateRegularHallTickets() {
    // College codes: 0100 to 9999 (realistic range)
    for (let college = 100; college <= 9999; college++) {
        const collegeStr = college.toString().padStart(4, '0');

        // Branch + Roll: 000001 to 999999
        // But realistically, we can limit to common ranges
        for (let branchRoll = 1; branchRoll <= 999999; branchRoll++) {
            const branchRollStr = branchRoll.toString().padStart(6, '0');
            yield `22${collegeStr}${branchRollStr}`;
        }
    }
}

/**
 * Generate ALL R22 hall tickets (both formats)
 */
export function* generateAllR22HallTickets() {
    // First, generate all autonomous
    yield* generateAutonomousHallTickets();

    // Then, generate all regular
    yield* generateRegularHallTickets();
}

/**
 * Estimate total hall tickets
 */
export function estimateTotal() {
    const autonomous = AUTONOMOUS_COLLEGES.length * AUTONOMOUS_BRANCHES.length * 999;
    const regular = 9900 * 999999; // This is HUGE (9.9 billion)

    return {
        autonomous,
        regular,
        total: autonomous + regular,
        realistic: autonomous + (100 * 10000) // More realistic: 100 colleges, 10k students each
    };
}
