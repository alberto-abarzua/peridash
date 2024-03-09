import { createTransport } from "nodemailer";
import { NotificationInfo } from "./db.ts";

export const transporter = createTransport({
    host: Deno.env.get("SMTP_HOST"),
    port: Number(Deno.env.get("SMTP_PORT")),
    secure: false,
    auth: {
        user: Deno.env.get("SMTP_USER"),
        pass: Deno.env.get("SMTP_PASS"),
    },
});

export const html_template = (tickerData: NotificationInfo[]) => {
    const tickers = tickerData
        .map(
            (ticker) => {
                return `
    <div class="ticker">
      <div class="ticker-name">${ticker.symbol} (${ticker.exchange})</div>
      <div class="ticker-details">
        <p>Current Price: ${ticker.current_price.toFixed(2)}</p>
        <p>Buy Price: ${ticker.set_prices.buy}</p>
        <p>Gain Price: ${ticker.set_prices.gain}</p>
        <p>Loss Price: ${ticker.set_prices.loss}</p>
        <p>Trigger Reason: <span class="ticker-reason">${ticker.reason}</span></p>
        <p>Percentage Difference: ${ticker.price_diff.toFixed(2)}%</p>
      </div>
    </div>
  `;
            },
        )
        .join("");

    const base = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Peridash - Ticker Alerts!</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f7fafc;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background-color: #2d3748;
          color: #ffffff;
          padding: 20px;
          text-align: center;
        }
        .ticker {
          background-color: #ffffff;
          border-radius: 4px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          margin-bottom: 20px;
          padding: 20px;
        }
        .ticker-name {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 10px;
        }
        .ticker-details {
          margin-bottom: 10px;
        }
        .ticker-reason {
          font-style: italic;
          color: #4a5568;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Peridash Ticker Alerts</h1>
        </div>
        ${tickers}
      </div>
    </body>
    </html>
  `;

    return base;
};

export const sendEmailUser = async (to: string[], subject: string, html: string) => {
    await transporter.sendMail({
        from: Deno.env.get("SMTP_USER"),
        to,
        subject,
        html,
    });
};

export const sendEmail = async (notificationInfo: NotificationInfo[][]) => {
    for (const tickerData of notificationInfo) {
        console.log("Ticker Data: ", tickerData);
        if (tickerData.length === 0) {
            continue;
        }
        const html = html_template(tickerData);
        console.log("Sending email to: ", tickerData[0]);
        if (tickerData[0].emails_to.length === 0) {
            console.log("No email to send to");
            continue;
        }

        await sendEmailUser(tickerData[0].emails_to, "Peridash - Notifications", html);
    }
};
