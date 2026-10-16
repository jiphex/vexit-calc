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
        working += `<p>Annual salary: £${salary.toFixed(2)} ÷ 52 = £${actualWeeklyPay.toFixed(2)} weekly</p>`;
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
        }
        working += `<p><strong>Final payment: £${finalAmount.toFixed(2)}</strong></p>`;
        working += '</div>';
        return { amount: finalAmount, working };
    }
    /**
     * Calculate total voluntary exit payment
     */
    calculate(inputs) {
        const { salary, yearsService, age, mode, pensionAge } = inputs;
        let statutory = { amount: 0, working: '' };
        let compensation = { amount: 0, working: '' };
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
        }
        const totalPayment = statutory.amount + compensation.amount;
        let workings = '';
        if (statutory.working) {
            workings += statutory.working;
        }
        if (compensation.working) {
            workings += compensation.working;
        }
        // Only show total breakdown if there's more than one component
        const componentCount = (statutory.amount > 0 ? 1 : 0) + (compensation.amount > 0 ? 1 : 0);
        if (componentCount > 1) {
            workings += '<div class="workings-section"><h3>Total Payment</h3>';
            if (statutory.amount > 0) {
                workings += `<p>Statutory Redundancy: £${statutory.amount.toFixed(2)}</p>`;
            }
            if (compensation.amount > 0) {
                workings += `<p>Compensation Payment: £${compensation.amount.toFixed(2)}</p>`;
            }
            workings += `<p><br><strong>Total: £${totalPayment.toFixed(2)}</strong></p>`;
            workings += '</div>';
        }
        if (totalPayment > 95000) {
            workings += '<div class="workings-section"><h3>Important Note</h3>';
            workings += '<p>This payment exceeds £95,000 and may be subject to capping or Cabinet Office approval.</p>';
            workings += '</div>';
        }
        return {
            statutoryRedundancy: statutory.amount,
            compensationPayment: compensation.amount,
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
    const pensionAgeInput = document.getElementById('pensionAge');
    const salary = parseFloat(salaryInput.value);
    const yearsService = parseFloat(yearsServiceInput.value);
    const age = ageInput.value ? parseInt(ageInput.value) : 0;
    const pensionAge = pensionAgeInput.value ? parseInt(pensionAgeInput.value) : undefined;
    // Validate numeric inputs
    if (isNaN(salary) || salary <= 0) {
        alert('Please enter a valid salary');
        return;
    }
    if (isNaN(yearsService) || yearsService <= 0) {
        alert('Please enter valid years of service');
        return;
    }
    if ((mode === 'statutory' || mode === 'ukri2025') && (isNaN(age) || age < 16 || age > 100)) {
        alert('Please enter a valid age (16-100)');
        return;
    }
    if (mode === 'ukri2025') {
        if (pensionAge === undefined || isNaN(pensionAge) || pensionAge < 16 || pensionAge > 100) {
            alert('Please enter a valid pension age (16-100)');
            return;
        }
    }
    const inputs = {
        salary,
        yearsService,
        age,
        mode,
        pensionAge
    };
    const results = calculator.calculate(inputs);
    // Update UI with results
    const statutoryRedundancyEl = document.getElementById('statutoryRedundancy');
    const statutoryRowEl = document.getElementById('statutoryRow');
    const compensationPaymentEl = document.getElementById('compensationPayment');
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
    if (totalPaymentEl)
        totalPaymentEl.textContent = formatCurrency(results.totalPayment);
    if (workingsContentEl) {
        workingsContentEl.innerHTML = results.workings;
    }
    if (resultsEl) {
        resultsEl.classList.add('show');
        const resultsHeading = resultsEl.querySelector('h2');
        if (resultsHeading) {
            resultsHeading.setAttribute('tabindex', '-1');
            resultsHeading.focus();
        }
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
/**
 * Load UKRI pay bands from JSON and populate the quick-select links.
 */
async function loadPayBands() {
    const container = document.getElementById('payBandSelector');
    const loadingEl = document.getElementById('payBandLoading');
    const errorEl = document.getElementById('payBandError');
    if (!container)
        return;
    try {
        const response = await fetch('ukri-pay-bands.json');
        if (!response.ok)
            throw new Error('Failed to load pay bands');
        const data = await response.json();
        if (loadingEl)
            loadingEl.style.display = 'none';
        const bands = Object.entries(data.minimum_pay).sort(([a], [b]) => a.localeCompare(b));
        let html = `
            <p style="margin-top: 8px; font-size: 13px; color: #666;">Quick select UKRI pay band (from official policy, effective ${data.effective_from}):</p>
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; margin-top: 6px; font-size: 12px;">
                <div><strong>Band</strong></div>
                <div><strong>Base</strong></div>
                <div><strong>S2 (STEM)</strong></div>
                <div><strong>S1 (STEM)</strong></div>
        `;
        for (const [band, pay] of bands) {
            html += `<div><strong>${band}</strong></div>`;
            html += `<a href="#" onclick="setPayBandSalary('${band} Base', ${pay.standard}); return false;" style="color: #0066cc; text-decoration: underline;">£${pay.standard.toLocaleString()}</a>`;
            html += `<a href="#" onclick="setPayBandSalary('${band} S2', ${pay.S2}); return false;" style="color: #0066cc; text-decoration: underline;">£${pay.S2.toLocaleString()}</a>`;
            html += `<a href="#" onclick="setPayBandSalary('${band} S1', ${pay.S1}); return false;" style="color: #0066cc; text-decoration: underline;">£${pay.S1.toLocaleString()}</a>`;
        }
        html += `</div>`;
        html += `<p style="margin-top: 6px; font-size: 12px; color: #999; font-style: italic;">Source: <a href="${data.source}" target="_blank" rel="noopener noreferrer" style="color: #0066cc; text-decoration: underline;">UKRI Pay and Reward Policy</a></p>`;
        container.innerHTML = html;
    }
    catch (err) {
        if (loadingEl)
            loadingEl.style.display = 'none';
        if (errorEl) {
            errorEl.textContent = 'Failed to load UKRI pay bands. Please enter salary manually.';
            errorEl.style.display = 'block';
        }
        console.error('Failed to load pay bands:', err);
    }
}
/**
 * Prefill the salary field from a UKRI pay band figure.
 * Exposed globally so the HTML onclick handlers can call it.
 */
window.setPayBandSalary = (grade, amount) => {
    const salaryInput = document.getElementById('salary');
    if (salaryInput) {
        salaryInput.value = amount.toString();
        salaryInput.dispatchEvent(new Event('input', { bubbles: true }));
    }
};
// Load pay bands when the page is ready
document.addEventListener('DOMContentLoaded', loadPayBands);
