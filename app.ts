/**
 * UK Civil Service Voluntary Exit Scheme Calculator
 */

interface CalculationInputs {
    salary: number;
    yearsService: number;
    age: number;
    scheme: string;
    includeStatutory: boolean;
}

interface CalculationResults {
    statutoryRedundancy: number;
    compensationPayment: number;
    exGratia: number;
    totalPayment: number;
    workings: string;
}

class VexitCalculator {
    // Statutory redundancy caps and rates
    private readonly WEEKLY_PAY_CAP = 643; // 2024 rate
    private readonly MAX_REDUNDANCY_YEARS = 20;

    /**
     * Calculate statutory redundancy payment
     * Based on age and years of service
     */
    private calculateStatutoryRedundancy(salary: number, yearsService: number, age: number): { amount: number; working: string } {
        const actualWeeklyPay = salary / 52;
        const weeklyPay = Math.min(actualWeeklyPay, this.WEEKLY_PAY_CAP);
        const years = Math.min(yearsService, this.MAX_REDUNDANCY_YEARS);
        
        let working = '<div class="workings-section"><h3>1. Statutory Redundancy</h3>';
        working += `<p>Annual salary: £${salary.toFixed(2)}</p>`;
        working += `<p>Weekly pay: £${salary.toFixed(2)} ÷ 52 = £${actualWeeklyPay.toFixed(2)}</p>`;
        
        if (actualWeeklyPay > this.WEEKLY_PAY_CAP) {
            working += `<p>Weekly pay capped at: £${this.WEEKLY_PAY_CAP.toFixed(2)}</p>`;
        }
        
        working += `<p>Years of service: ${yearsService.toFixed(1)}</p>`;
        if (yearsService > this.MAX_REDUNDANCY_YEARS) {
            working += `<p>Capped at: ${this.MAX_REDUNDANCY_YEARS} years</p>`;
        }
        working += `<p>Current age: ${age}</p>`;
        working += '<p><br><strong>Weekly multipliers by age bracket:</strong></p>';
        
        let weeks = 0;
        let currentAge = age;
        let remainingYears = years;
        let weeksUnder22 = 0;
        let weeks22to40 = 0;
        let weeksOver40 = 0;

        // Work backwards from current age
        for (let i = 0; i < years && remainingYears > 0; i++) {
            const yearAge = currentAge - i;
            
            if (yearAge >= 41) {
                weeks += 1.5;
                weeksOver40 += 1.5;
            } else if (yearAge >= 22) {
                weeks += 1;
                weeks22to40 += 1;
            } else {
                weeks += 0.5;
                weeksUnder22 += 0.5;
            }
            
            remainingYears--;
        }

        if (weeksUnder22 > 0) working += `<p>Under 22: ${weeksUnder22} weeks (0.5 weeks per year)</p>`;
        if (weeks22to40 > 0) working += `<p>Age 22-40: ${weeks22to40} weeks (1 week per year)</p>`;
        if (weeksOver40 > 0) working += `<p>Age 41+: ${weeksOver40} weeks (1.5 weeks per year)</p>`;
        
        working += `<p><br><strong>Calculation:</strong></p>`;
        working += `<p>£${weeklyPay.toFixed(2)} × ${weeks} weeks = £${(weeklyPay * weeks).toFixed(2)}</p>`;
        working += '</div>';

        return { amount: weeklyPay * weeks, working };
    }

    /**
     * Calculate compensation payment
     * Typically 1 month's salary per year of service (capped)
     */
    private calculateCompensationPayment(salary: number, yearsService: number): { amount: number; working: string } {
        const monthlySalary = salary / 12;
        const cappedYears = Math.min(yearsService, 21); // Usually capped at 21 years
        
        let working = '<div class="workings-section"><h3>2. Compensation Payment</h3>';
        working += `<p>Annual salary: £${salary.toFixed(2)}</p>`;
        working += `<p>Monthly salary: £${salary.toFixed(2)} ÷ 12 = £${monthlySalary.toFixed(2)}</p>`;
        working += `<p>Years of service: ${yearsService.toFixed(1)}</p>`;
        
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
     * Calculate ex-gratia payment
     * Additional discretionary payment based on scheme and circumstances
     */
    private calculateExGratia(salary: number, yearsService: number, scheme: string): { amount: number; working: string } {
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
        
        let working = '<div class="workings-section"><h3>3. Ex-Gratia Payment</h3>';
        working += `<p>Pension scheme: ${schemeName}</p>`;
        working += `<p>Monthly salary: £${monthlySalary.toFixed(2)}</p>`;
        working += `<p>Years of service: ${yearsService.toFixed(1)}</p>`;
        working += `<p>Multiplier rate: ${multiplierRate} months per year (capped at ${cap} months)</p>`;
        
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
    public calculate(inputs: CalculationInputs): CalculationResults {
        const { salary, yearsService, age, scheme, includeStatutory } = inputs;

        const statutory = includeStatutory ? this.calculateStatutoryRedundancy(salary, yearsService, age) : { amount: 0, working: '' };
        const compensation = this.calculateCompensationPayment(salary, yearsService);
        const exGratia = this.calculateExGratia(salary, yearsService, scheme);
        const totalPayment = statutory.amount + compensation.amount + exGratia.amount;

        let workings = '';
        if (includeStatutory) {
            workings += statutory.working;
        }
        workings += compensation.working + exGratia.working;
        workings += '<div class="workings-section"><h3>Total Payment</h3>';
        if (includeStatutory) {
            workings += `<p>Statutory Redundancy: £${statutory.amount.toFixed(2)}</p>`;
        }
        workings += `<p>Compensation Payment: £${compensation.amount.toFixed(2)}</p>`;
        workings += `<p>Ex-Gratia Payment: £${exGratia.amount.toFixed(2)}</p>`;
        workings += `<p><br><strong>Total: £${totalPayment.toFixed(2)}</strong></p>`;
        workings += '</div>';

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
function formatCurrency(amount: number): string {
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
document.getElementById('calculatorForm')?.addEventListener('submit', (e: Event) => {
    e.preventDefault();

    const salaryInput = document.getElementById('salary') as HTMLInputElement;
    const yearsServiceInput = document.getElementById('yearsService') as HTMLInputElement;
    const ageInput = document.getElementById('age') as HTMLInputElement;
    const schemeInput = document.getElementById('scheme') as HTMLSelectElement;
    const includeStatutoryInput = document.getElementById('includeStatutory') as HTMLInputElement;

    const inputs: CalculationInputs = {
        salary: parseFloat(salaryInput.value),
        yearsService: parseFloat(yearsServiceInput.value),
        age: parseInt(ageInput.value),
        scheme: schemeInput.value,
        includeStatutory: includeStatutoryInput.checked
    };

    const results = calculator.calculate(inputs);

    // Update UI with results
    const statutoryRedundancyEl = document.getElementById('statutoryRedundancy');
    const statutoryRowEl = document.getElementById('statutoryRow');
    const compensationPaymentEl = document.getElementById('compensationPayment');
    const exGratiaEl = document.getElementById('exGratia');
    const totalPaymentEl = document.getElementById('totalPayment');
    const resultsEl = document.getElementById('results');
    const workingsEl = document.getElementById('workings');
    const workingsContentEl = document.getElementById('workingsContent');

    if (statutoryRedundancyEl) statutoryRedundancyEl.textContent = formatCurrency(results.statutoryRedundancy);
    if (statutoryRowEl) {
        statutoryRowEl.style.display = inputs.includeStatutory ? 'flex' : 'none';
    }
    if (compensationPaymentEl) compensationPaymentEl.textContent = formatCurrency(results.compensationPayment);
    if (exGratiaEl) exGratiaEl.textContent = formatCurrency(results.exGratia);
    if (totalPaymentEl) totalPaymentEl.textContent = formatCurrency(results.totalPayment);
    
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
});
