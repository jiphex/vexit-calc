"use strict";
/**
 * UK Civil Service Voluntary Exit Scheme Calculator
 */
class VexitCalculator {
    constructor() {
        // Statutory redundancy caps and rates
        this.WEEKLY_PAY_CAP = 751; // Current rate
        this.MAX_REDUNDANCY_YEARS = 20;
    }
    /**
     * Calculate statutory redundancy payment
     * Based on age and years of service
     */
    calculateStatutoryRedundancy(salary, yearsService, age) {
        const actualWeeklyPay = salary / 52;
        const weeklyPay = Math.min(actualWeeklyPay, this.WEEKLY_PAY_CAP);
        const wholeYears = Math.floor(yearsService); // Statutory redundancy only counts whole years
        const years = Math.min(wholeYears, this.MAX_REDUNDANCY_YEARS);
        let working = '<div class="workings-section"><h3>Statutory Redundancy</h3>';
        working += `<p>Annual salary: £${salary.toFixed(2)}</p>`;
        working += `<p>Weekly pay: £${salary.toFixed(2)} ÷ 52 = £${actualWeeklyPay.toFixed(2)}</p>`;
        if (actualWeeklyPay > this.WEEKLY_PAY_CAP) {
            working += `<p>Weekly pay capped at: £${this.WEEKLY_PAY_CAP.toFixed(2)}</p>`;
        }
        working += `<p>Years of service: ${yearsService.toFixed(4)}</p>`;
        working += `<p>Whole years (statutory counts whole years only): ${wholeYears}</p>`;
        if (wholeYears > this.MAX_REDUNDANCY_YEARS) {
            working += `<p>Capped at: ${this.MAX_REDUNDANCY_YEARS} years</p>`;
        }
        working += `<p>Current age: ${age}</p>`;
        working += '<p><br><strong>Weekly multipliers by age bracket:</strong></p>';
        let weeks = 0;
        let weeksUnder22 = 0;
        let weeks22to40 = 0;
        let weeksOver40 = 0;
        // Work backwards from current age through each year of service
        for (let i = 0; i < years; i++) {
            const ageInThisYear = age - i;
            if (ageInThisYear >= 41) {
                weeks += 1.5;
                weeksOver40 += 1.5;
            }
            else if (ageInThisYear >= 22) {
                weeks += 1;
                weeks22to40 += 1;
            }
            else {
                weeks += 0.5;
                weeksUnder22 += 0.5;
            }
        }
        if (weeksUnder22 > 0)
            working += `<p>Under 22: ${weeksUnder22} weeks (0.5 weeks per year)</p>`;
        if (weeks22to40 > 0)
            working += `<p>Age 22-40: ${weeks22to40} weeks (1 week per year)</p>`;
        if (weeksOver40 > 0)
            working += `<p>Age 41+: ${weeksOver40} weeks (1.5 weeks per year)</p>`;
        working += `<p><br><strong>Calculation:</strong></p>`;
        working += `<p>£${weeklyPay.toFixed(2)} × ${weeks} weeks = £${(weeklyPay * weeks).toFixed(2)}</p>`;
        working += '</div>';
        if (yearsService !== wholeYears) {
            working += `<p><em>Note: Fractional years (${(yearsService - wholeYears).toFixed(4)}) are not counted in statutory redundancy.</em></p>`;
        }
        return { amount: weeklyPay * weeks, working };
    }
    /**
     * Calculate compensation payment
     * Typically 1 month's salary per year of service (capped)
     */
    calculateCompensationPayment(salary, yearsService) {
        const monthlySalary = salary / 12;
        const cappedYears = Math.min(yearsService, 21); // Usually capped at 21 years
        let working = '<div class="workings-section"><h3>Compensation Payment</h3>';
        working += `<p>Annual salary: £${salary.toFixed(2)}</p>`;
        working += `<p>Monthly salary: £${salary.toFixed(2)} ÷ 12 = £${monthlySalary.toFixed(2)}</p>`;
        working += `<p>Years of service: ${yearsService.toFixed(4)}</p>`;
        if (yearsService > 21) {
            working += `<p>Capped at: 21 years</p>`;
        }
        working += '<p><br><strong>Calculation:</strong></p>';
        working += `<p>1 month per year of service</p>`;
        working += `<p>£${monthlySalary.toFixed(2)} × ${cappedYears.toFixed(1)} = £${(monthlySalary * cappedYears).toFixed(2)}</p>`;
        working += '</div>';
        return { amount: monthlySalary * cappedYears, working };
    }
    /**
     * Calculate UKRI 2025 scheme payment
     * Age-based tapering with £95,000 cap
     */
    calculateUKRI2025(salary, yearsService, age, pensionAge) {
        const monthlySalary = salary / 12;
        const UKRI_CAP = 95000;
        let working = '<div class="workings-section"><h3>UKRI 2025 Compensation Payment</h3>';
        working += `<p>Annual salary: £${salary.toFixed(2)}</p>`;
        working += `<p>Monthly salary: £${salary.toFixed(2)} ÷ 12 = £${monthlySalary.toFixed(2)}</p>`;
        working += `<p>Years of service: ${yearsService.toFixed(4)}</p>`;
        working += `<p>Current age: ${age}</p>`;
        working += `<p>Pension age: ${pensionAge}</p>`;
        const monthsToPensionAge = (pensionAge - age) * 12;
        working += `<p>Months to pension age: ${monthsToPensionAge.toFixed(1)}</p>`;
        let maxMonths;
        let baseMonths = yearsService; // 1 month per year of service
        if (age >= pensionAge) {
            // Above pension age: max 6 months
            maxMonths = 6;
            working += '<p><br><strong>Above pension age:</strong> Maximum 6 months</p>';
        }
        else {
            // Below pension age: apply tapering
            const standardMax = 21;
            const taperedMax = Math.round(monthsToPensionAge) + 6; // Months to pension age + 6, rounded
            maxMonths = Math.min(standardMax, taperedMax);
            working += '<p><br><strong>Below pension age with tapering:</strong></p>';
            working += `<p>Standard maximum: ${standardMax} months</p>`;
            working += `<p>Tapered maximum: ${monthsToPensionAge.toFixed(1)} months to pension age + 6 = ${taperedMax} months</p>`;
            working += `<p>Applied maximum: ${maxMonths} months (lesser of the two)</p>`;
        }
        const cappedMonths = Math.min(baseMonths, maxMonths);
        working += `<p><br><strong>Calculation:</strong></p>`;
        working += `<p>Base entitlement: ${baseMonths.toFixed(4)} months (1 month per year)</p>`;
        if (baseMonths > maxMonths) {
            working += `<p>Capped at: ${maxMonths} months</p>`;
        }
        let uncappedAmount = monthlySalary * cappedMonths;
        working += `<p>£${monthlySalary.toFixed(2)} × ${cappedMonths.toFixed(4)} = £${uncappedAmount.toFixed(2)}</p>`;
        let finalAmount = Math.min(uncappedAmount, UKRI_CAP);
        if (uncappedAmount > UKRI_CAP) {
            working += `<p><br><strong>UKRI cap applied:</strong> £${UKRI_CAP.toFixed(2)}</p>`;
            working += `<p>Final payment: £${finalAmount.toFixed(2)}</p>`;
        }
        working += '</div>';
        return { amount: finalAmount, working };
    }
    /**
     * Calculate ex-gratia payment
     * Additional discretionary payment based on scheme and circumstances
     */
    calculateExGratia(salary, yearsService, scheme) {
        const monthlySalary = salary / 12;
        // Ex-gratia varies by scheme and is often discretionary
        // These are typical multipliers
        let multiplier = 0;
        let multiplierRate = 0;
        let cap = 0;
        let schemeName = '';
        switch (scheme) {
            case 'classic':
                multiplierRate = 0.5;
                cap = 6;
                schemeName = 'Classic';
                multiplier = Math.min(yearsService * multiplierRate, cap);
                break;
            case 'premium':
                multiplierRate = 0.4;
                cap = 5;
                schemeName = 'Classic Plus / Premium';
                multiplier = Math.min(yearsService * multiplierRate, cap);
                break;
            case 'nuvos':
                multiplierRate = 0.3;
                cap = 4;
                schemeName = 'Nuvos';
                multiplier = Math.min(yearsService * multiplierRate, cap);
                break;
            case 'alpha':
                multiplierRate = 0.25;
                cap = 3;
                schemeName = 'Alpha';
                multiplier = Math.min(yearsService * multiplierRate, cap);
                break;
            default:
                multiplier = 0;
        }
        let working = '<div class="workings-section"><h3>Ex-Gratia Payment</h3>';
        working += '<p><strong style="color: #dc3545;">⚠️ Warning: These multipliers are illustrative only and NOT based on official figures.</strong></p>';
        working += `<p>Pension scheme: ${schemeName}</p>`;
        working += `<p>Monthly salary: £${monthlySalary.toFixed(2)}</p>`;
        working += `<p>Years of service: ${yearsService.toFixed(4)}</p>`;
        working += `<p>Illustrative multiplier rate: ${multiplierRate} months per year (capped at ${cap} months)</p>`;
        const uncappedMultiplier = yearsService * multiplierRate;
        working += `<p><br><strong>Calculation:</strong></p>`;
        working += `<p>${yearsService.toFixed(1)} years × ${multiplierRate} = ${uncappedMultiplier.toFixed(2)} months</p>`;
        if (uncappedMultiplier > cap) {
            working += `<p>Capped at: ${cap} months</p>`;
        }
        working += `<p>£${monthlySalary.toFixed(2)} × ${multiplier.toFixed(2)} = £${(monthlySalary * multiplier).toFixed(2)}</p>`;
        working += '</div>';
        return { amount: monthlySalary * multiplier, working };
    }
    /**
     * Calculate total voluntary exit payment
     */
    calculate(inputs) {
        const { salary, yearsService, age, scheme, includeExGratia, mode, pensionAge } = inputs;
        let statutory = { amount: 0, working: '' };
        let compensation = { amount: 0, working: '' };
        let exGratia = { amount: 0, working: '' };
        if (mode === 'ukri2025') {
            // UKRI 2025 scheme replaces standard compensation
            if (!pensionAge) {
                throw new Error('Pension age is required for UKRI 2025 calculations');
            }
            compensation = this.calculateUKRI2025(salary, yearsService, age, pensionAge);
        }
        else if (mode === 'statutory') {
            // Statutory redundancy only
            statutory = this.calculateStatutoryRedundancy(salary, yearsService, age);
        }
        else {
            // Standard scheme
            compensation = this.calculateCompensationPayment(salary, yearsService);
            if (includeExGratia) {
                exGratia = this.calculateExGratia(salary, yearsService, scheme);
            }
        }
        const totalPayment = statutory.amount + compensation.amount + exGratia.amount;
        let workings = '';
        if (statutory.working) {
            workings += statutory.working;
        }
        if (compensation.working) {
            workings += compensation.working;
        }
        if (exGratia.working) {
            workings += exGratia.working;
        }
        // Only show total breakdown if there's more than one component
        const componentCount = (statutory.amount > 0 ? 1 : 0) + (compensation.amount > 0 ? 1 : 0) + (exGratia.amount > 0 ? 1 : 0);
        if (componentCount > 1) {
            workings += '<div class="workings-section"><h3>Total Payment</h3>';
            if (statutory.amount > 0) {
                workings += `<p>Statutory Redundancy: £${statutory.amount.toFixed(2)}</p>`;
            }
            if (compensation.amount > 0) {
                workings += `<p>Compensation Payment: £${compensation.amount.toFixed(2)}</p>`;
            }
            if (exGratia.amount > 0) {
                workings += `<p>Ex-Gratia Payment: £${exGratia.amount.toFixed(2)}</p>`;
            }
            workings += `<p><br><strong>Total: £${totalPayment.toFixed(2)}</strong></p>`;
            workings += '</div>';
        }
        return {
            statutoryRedundancy: statutory.amount,
            compensationPayment: compensation.amount,
            exGratia: exGratia.amount,
            totalPayment,
            workings
        };
    }
}
// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: 'GBP',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
}
// Initialize calculator
const calculator = new VexitCalculator();
// Common calculation function
function performCalculation(mode) {
    const salaryInput = document.getElementById('salary');
    const yearsServiceInput = document.getElementById('yearsService');
    const ageInput = document.getElementById('age');
    const schemeInput = document.getElementById('scheme');
    const includeExGratiaInput = document.getElementById('includeExGratia');
    const pensionAgeInput = document.getElementById('pensionAge');
    // Validate required fields based on mode
    if (!salaryInput.value || !yearsServiceInput.value) {
        alert('Please enter salary and years of service');
        return;
    }
    if ((mode === 'statutory' || mode === 'ukri2025') && !ageInput.value) {
        alert('Please enter your age for this calculation');
        return;
    }
    if (mode === 'ukri2025' && !pensionAgeInput.value) {
        alert('Please enter your normal pension age for UKRI 2025 calculations');
        return;
    }
    if (mode === 'standard' && includeExGratiaInput.checked && !schemeInput.value) {
        alert('Please select your pension scheme for ex-gratia calculations');
        return;
    }
    const inputs = {
        salary: parseFloat(salaryInput.value),
        yearsService: parseFloat(yearsServiceInput.value),
        age: ageInput.value ? parseInt(ageInput.value) : 0,
        scheme: schemeInput.value || '',
        includeExGratia: includeExGratiaInput.checked && mode === 'standard',
        mode: mode,
        pensionAge: pensionAgeInput.value ? parseInt(pensionAgeInput.value) : undefined
    };
    const results = calculator.calculate(inputs);
    // Update UI with results
    const statutoryRedundancyEl = document.getElementById('statutoryRedundancy');
    const statutoryRowEl = document.getElementById('statutoryRow');
    const compensationPaymentEl = document.getElementById('compensationPayment');
    const exGratiaEl = document.getElementById('exGratia');
    const exGratiaRowEl = document.getElementById('exGratiaRow');
    const totalPaymentEl = document.getElementById('totalPayment');
    const resultsEl = document.getElementById('results');
    const workingsEl = document.getElementById('workings');
    const workingsContentEl = document.getElementById('workingsContent');
    if (statutoryRedundancyEl)
        statutoryRedundancyEl.textContent = formatCurrency(results.statutoryRedundancy);
    if (statutoryRowEl) {
        statutoryRowEl.style.display = results.statutoryRedundancy > 0 ? 'table-row' : 'none';
    }
    if (compensationPaymentEl)
        compensationPaymentEl.textContent = formatCurrency(results.compensationPayment);
    if (exGratiaEl)
        exGratiaEl.textContent = formatCurrency(results.exGratia);
    if (exGratiaRowEl) {
        exGratiaRowEl.style.display = results.exGratia > 0 ? 'table-row' : 'none';
    }
    if (totalPaymentEl)
        totalPaymentEl.textContent = formatCurrency(results.totalPayment);
    if (workingsContentEl) {
        workingsContentEl.innerHTML = results.workings;
    }
    if (resultsEl) {
        resultsEl.classList.add('show');
    }
    if (workingsEl) {
        workingsEl.classList.add('show');
        workingsEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    // Show/hide UKRI notice
    const ukriNoticeEl = document.getElementById('ukriNotice');
    if (ukriNoticeEl) {
        if (mode === 'ukri2025') {
            ukriNoticeEl.classList.add('show');
        }
        else {
            ukriNoticeEl.classList.remove('show');
        }
    }
}
// Handle button clicks
document.getElementById('calculateStandard')?.addEventListener('click', () => {
    performCalculation('standard');
});
document.getElementById('calculateUKRI')?.addEventListener('click', () => {
    performCalculation('ukri2025');
});
document.getElementById('calculateStatutory')?.addEventListener('click', () => {
    performCalculation('statutory');
});
// Function to update field visibility based on selections
function updateFieldVisibility() {
    const includeExGratia = document.getElementById('includeExGratia')?.checked || false;
    const schemeGroup = document.getElementById('schemeGroup');
    const schemeInput = document.getElementById('scheme');
    // Scheme is needed for ex-gratia only
    const schemeNeeded = includeExGratia;
    if (schemeGroup) {
        schemeGroup.style.display = schemeNeeded ? 'block' : 'none';
    }
    if (schemeInput) {
        if (schemeNeeded) {
            schemeInput.setAttribute('required', 'required');
        }
        else {
            schemeInput.removeAttribute('required');
        }
    }
}
// Handle checkbox changes
document.getElementById('includeExGratia')?.addEventListener('change', updateFieldVisibility);
// Initialize field visibility on page load
updateFieldVisibility();
