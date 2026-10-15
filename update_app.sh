#!/bin/bash
# Script to update app.ts for three button modes

# 1. Update the interface to use mode instead of checkboxes
sed -i '' 's/interface CalculationInputs {/type CalculationMode = '\''standard'\'' | '\''ukri2025'\'' | '\''statutory'\'';\'$'\n\n'\''interface CalculationInputs {/' app.ts
sed -i '' '/includeStatutory: boolean;/d' app.ts
sed -i '' 's/useUKRI2025: boolean;/mode: CalculationMode;/' app.ts

# 2. Update the calculate method signature
sed -i '' 's/const { salary, yearsService, age, scheme, includeStatutory, includeExGratia, useUKRI2025, pensionAge } = inputs;/const { salary, yearsService, age, scheme, includeExGratia, mode, pensionAge } = inputs;/' app.ts

# 3. Update the logic in calculate method
sed -i '' 's/if (useUKRI2025) {/if (mode === '\''ukri2025'\'') {/' app.ts
sed -i '' 's/} else {/} else if (mode === '\''statutory'\'') {\'$'\n'\''            \/\/ Statutory redundancy only\'$'\n'\''            statutory = this.calculateStatutoryRedundancy(salary, yearsService, age);\'$'\n'\''        } else {/' app.ts
sed -i '' '/\/\/ Standard scheme/,/if (includeStatutory)/d' app.ts

# 4. Remove old form handler and add new button handlers
# This is complex so let's do it in Python instead
python3 << 'PYEOF'
with open('app.ts', 'r') as f:
    content = f.read()

# Find and replace the form submission handler
import re

# Remove old form submission
old_handler_start = content.find('// Handle form submission')
old_handler_end = content.find('// Function to update field visibility')
if old_handler_start > 0 and old_handler_end > 0:
    before = content[:old_handler_start]
    after = content[old_handler_end:]
    
    # New handlers
    new_handlers = '''// Common calculation function
function performCalculation(mode: CalculationMode) {
    const salaryInput = document.getElementById('salary') as HTMLInputElement;
    const yearsServiceInput = document.getElementById('yearsService') as HTMLInputElement;
    const ageInput = document.getElementById('age') as HTMLInputElement;
    const schemeInput = document.getElementById('scheme') as HTMLSelectElement;
    const includeExGratiaInput = document.getElementById('includeExGratia') as HTMLInputElement;
    const pensionAgeInput = document.getElementById('pensionAge') as HTMLInputElement;

    const inputs: CalculationInputs = {
        salary: parseFloat(salaryInput.value),
        yearsService: parseFloat(yearsServiceInput.value),
        age: ageInput.value ? parseInt(ageInput.value) : 0,
        scheme: schemeInput.value || '',
        includeExGratia: includeExGratiaInput.checked && mode === 'standard',
        mode: mode,
        pensionAge: pensionAgeInput.value ? parseInt(pensionAgeInput.value) : undefined
    };

    const results = calculator.calculate(inputs);

    // Update UI
    const statutoryRedundancyEl = document.getElementById('statutoryRedundancy');
    const statutoryRowEl = document.getElementById('statutoryRow');
    const compensationPaymentEl = document.getElementById('compensationPayment');
    const exGratiaEl = document.getElementById('exGratia');
    const exGratiaRowEl = document.getElementById('exGratiaRow');
    const totalPaymentEl = document.getElementById('totalPayment');
    const resultsEl = document.getElementById('results');
    const workingsEl = document.getElementById('workings');
    const workingsContentEl = document.getElementById('workingsContent');
    const ukriNoticeEl = document.getElementById('ukriNotice');

    if (statutoryRedundancyEl) statutoryRedundancyEl.textContent = formatCurrency(results.statutoryRedundancy);
    if (statutoryRowEl) statutoryRowEl.style.display = results.statutoryRedundancy > 0 ? 'flex' : 'none';
    if (compensationPaymentEl) compensationPaymentEl.textContent = formatCurrency(results.compensationPayment);
    if (exGratiaEl) exGratiaEl.textContent = formatCurrency(results.exGratia);
    if (exGratiaRowEl) exGratiaRowEl.style.display = results.exGratia > 0 ? 'flex' : 'none';
    if (totalPaymentEl) totalPaymentEl.textContent = formatCurrency(results.totalPayment);
    if (workingsContentEl) workingsContentEl.innerHTML = results.workings;
    if (resultsEl) resultsEl.classList.add('show');
    if (workingsEl) {
        workingsEl.classList.add('show');
        workingsEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    if (ukriNoticeEl) {
        if (mode === 'ukri2025') {
            ukriNoticeEl.classList.add('show');
        } else {
            ukriNoticeEl.classList.remove('show');
        }
    }
}

// Handle button clicks
document.getElementById('calculateStandard')?.addEventListener('click', () => performCalculation('standard'));
document.getElementById('calculateUKRI')?.addEventListener('click', () => performCalculation('ukri2025'));
document.getElementById('calculateStatutory')?.addEventListener('click', () => performCalculation('statutory'));

'''
    
    content = before + new_handlers + after
    
with open('app.ts', 'w') as f:
    f.write(content)
PYEOF

echo "Updated app.ts"
