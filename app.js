"use strict";
/**
 * UK Civil Service Voluntary Exit Scheme Calculator
 */
class VexitCalculator {
    constructor() {
        // Statutory redundancy caps and rates
        this.WEEKLY_PAY_CAP = 643; // 2024 rate
        this.MAX_REDUNDANCY_YEARS = 20;
    }
    /**
     * Calculate statutory redundancy payment
     * Based on age and years of service
     */
    calculateStatutoryRedundancy(salary, yearsService, age) {
        const weeklyPay = Math.min(salary / 52, this.WEEKLY_PAY_CAP);
        const years = Math.min(yearsService, this.MAX_REDUNDANCY_YEARS);
        let weeks = 0;
        let currentAge = age;
        let remainingYears = years;
        // Work backwards from current age
        for (let i = 0; i < years && remainingYears > 0; i++) {
            const yearAge = currentAge - i;
            if (yearAge >= 41) {
                weeks += 1.5; // 1.5 weeks per year for age 41+
            }
            else if (yearAge >= 22) {
                weeks += 1; // 1 week per year for age 22-40
            }
            else {
                weeks += 0.5; // 0.5 weeks per year for under 22
            }
            remainingYears--;
        }
        return weeklyPay * weeks;
    }
    /**
     * Calculate compensation payment
     * Typically 1 month's salary per year of service (capped)
     */
    calculateCompensationPayment(salary, yearsService) {
        const monthlySalary = salary / 12;
        const cappedYears = Math.min(yearsService, 21); // Usually capped at 21 years
        // 1 month per year of service
        return monthlySalary * cappedYears;
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
        switch (scheme) {
            case 'classic':
                // Classic scheme typically gets higher ex-gratia
                multiplier = Math.min(yearsService * 0.5, 6);
                break;
            case 'premium':
                multiplier = Math.min(yearsService * 0.4, 5);
                break;
            case 'nuvos':
                multiplier = Math.min(yearsService * 0.3, 4);
                break;
            case 'alpha':
                multiplier = Math.min(yearsService * 0.25, 3);
                break;
            default:
                multiplier = 0;
        }
        return monthlySalary * multiplier;
    }
    /**
     * Calculate total voluntary exit payment
     */
    calculate(inputs) {
        const { salary, yearsService, age, scheme } = inputs;
        const statutoryRedundancy = this.calculateStatutoryRedundancy(salary, yearsService, age);
        const compensationPayment = this.calculateCompensationPayment(salary, yearsService);
        const exGratia = this.calculateExGratia(salary, yearsService, scheme);
        const totalPayment = statutoryRedundancy + compensationPayment + exGratia;
        return {
            statutoryRedundancy,
            compensationPayment,
            exGratia,
            totalPayment
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
// Handle form submission
document.getElementById('calculatorForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const salaryInput = document.getElementById('salary');
    const yearsServiceInput = document.getElementById('yearsService');
    const ageInput = document.getElementById('age');
    const schemeInput = document.getElementById('scheme');
    const inputs = {
        salary: parseFloat(salaryInput.value),
        yearsService: parseFloat(yearsServiceInput.value),
        age: parseInt(ageInput.value),
        scheme: schemeInput.value
    };
    const results = calculator.calculate(inputs);
    // Update UI with results
    const statutoryRedundancyEl = document.getElementById('statutoryRedundancy');
    const compensationPaymentEl = document.getElementById('compensationPayment');
    const exGratiaEl = document.getElementById('exGratia');
    const totalPaymentEl = document.getElementById('totalPayment');
    const resultsEl = document.getElementById('results');
    if (statutoryRedundancyEl)
        statutoryRedundancyEl.textContent = formatCurrency(results.statutoryRedundancy);
    if (compensationPaymentEl)
        compensationPaymentEl.textContent = formatCurrency(results.compensationPayment);
    if (exGratiaEl)
        exGratiaEl.textContent = formatCurrency(results.exGratia);
    if (totalPaymentEl)
        totalPaymentEl.textContent = formatCurrency(results.totalPayment);
    if (resultsEl) {
        resultsEl.classList.add('show');
        resultsEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
});
