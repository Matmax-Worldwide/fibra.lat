import React from 'react';

const CrossBorderInvestment: React.FC = () => {
  return (
    <div className="container">
      <h1>Cross Border Investment Guide</h1>
      <p>Tax implications comparison between US REITs and Peru FIBRAs</p>
      
      <section>
        <h2>US REIT Tax Structure</h2>
        <ul>
          <li>Minimum 90% of taxable income must be distributed to shareholders</li>
          <li>REITs generally pay no corporate income tax</li>
          <li>Dividends are taxed at the individual investor level</li>
          <li>Foreign investors typically subject to 30% withholding tax (may be reduced by treaty)</li>
        </ul>
      </section>
      
      <section>
        <h2>Peru FIBRA Tax Structure</h2>
        <ul>
          <li>Minimum 95% of taxable income must be distributed to certificate holders</li>
          <li>FIBRAs operate with tax transparency, paying no entity-level tax</li>
          <li>Distributions taxed at the individual level (typically 5% for individuals)</li>
          <li>Foreign investors subject to 5% withholding tax</li>
        </ul>
      </section>
      
      <section>
        <h2>Comparative Analysis</h2>
        <table className="tax-comparison">
          <thead>
            <tr>
              <th>Feature</th>
              <th>US REITs</th>
              <th>Peru FIBRAs</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Minimum Distribution</td>
              <td>90%</td>
              <td>95%</td>
            </tr>
            <tr>
              <td>Corporate Tax</td>
              <td>Generally Exempt</td>
              <td>Exempt</td>
            </tr>
            <tr>
              <td>Dividend Tax (Domestic)</td>
              <td>Up to 37% (income dependent)</td>
              <td>5%</td>
            </tr>
            <tr>
              <td>Withholding Tax (Foreign)</td>
              <td>30% (may be reduced)</td>
              <td>5%</td>
            </tr>
            <tr>
              <td>Capital Gains</td>
              <td>Up to 20%</td>
              <td>5%</td>
            </tr>
          </tbody>
        </table>
      </section>
      
      <section>
        <h2>Investment Strategy</h2>
        <p>For investors considering cross-border real estate investments:</p>
        <ul>
          <li>Peru FIBRAs offer significantly lower tax rates for both domestic and international investors</li>
          <li>US REITs provide greater market liquidity and diversification options</li>
          <li>Consider currency risk when investing in Peru FIBRAs (USD to PEN conversion)</li>
          <li>Evaluate investment holding period - longer term investments may benefit more from Peru's favorable tax structure</li>
        </ul>
      </section>
    </div>
  );
};

export default CrossBorderInvestment; 