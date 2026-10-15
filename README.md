# UK Civil Service Voluntary Exit Calculator

A simple, single-page web application to calculate payments under the UK Civil Service Voluntary Exit Scheme.

## Features

- Calculate statutory redundancy payments based on age and years of service
- Estimate compensation payments (typically 1 month per year of service)
- Include ex-gratia payments based on pension scheme
- Clean, modern UI with responsive design
- No external dependencies or frameworks

## Calculation Components

The calculator estimates three components of the voluntary exit payment:

1. **Statutory Redundancy**: Based on age, years of service, and weekly pay (capped at £643/week)
   - Age under 22: 0.5 weeks' pay per year
   - Age 22-40: 1 week's pay per year
   - Age 41+: 1.5 weeks' pay per year
   - Maximum 20 years counted

2. **Compensation Payment**: Typically 1 month's salary per year of service (capped at 21 years)

3. **Ex-Gratia Payment**: Additional discretionary payment varying by pension scheme:
   - Classic scheme: Higher multiplier
   - Alpha scheme: Lower multiplier
   - Actual amounts vary by department

## Usage

### View Online

Visit the GitHub Pages site: [https://YOUR_USERNAME.github.io/vexit-calc/](https://YOUR_USERNAME.github.io/vexit-calc/)

### Run Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/vexit-calc.git
   cd vexit-calc
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build TypeScript:
   ```bash
   npm run build
   ```

4. Open `index.html` in your browser or serve it:
   ```bash
   npm run serve
   ```
   Then visit `http://localhost:8000`

## Development

To watch for TypeScript changes during development:
```bash
npm run watch
```

## Important Notes

- This calculator provides **estimates only**
- Actual payments depend on your specific department's terms and conditions
- Different departments may have different calculation methods
- The ex-gratia element is often discretionary
- Always consult your HR department for official calculations
- Tax implications are not included in these calculations

## Pension Schemes

The calculator supports the main Civil Service pension schemes:
- **Alpha**: Joined after April 2015
- **Nuvos**: Joined between 2007-2015
- **Classic**: Joined before 2007
- **Classic Plus / Premium**: Hybrid schemes

## License

MIT License - feel free to use and modify as needed.

## Disclaimer

This calculator is for informational purposes only and does not constitute financial or legal advice. Always verify calculations with your HR department before making any decisions.
