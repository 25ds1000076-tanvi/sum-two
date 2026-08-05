const { chromium } = require("playwright");

const seeds = [79, 80, 81, 82, 83, 84, 85, 86, 87, 88];

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  let grandTotal = 0;

  for (const seed of seeds) {
    const url = `https://sanand0.github.io/tdsdata/js_table/?seed=${seed}`;
    await page.goto(url, { waitUntil: "networkidle" });

    // Wait for at least one table to actually appear (it's JS-generated)
    await page.waitForSelector("table");

    // Grab every number from every table cell on the page
    const pageSum = await page.evaluate(() => {
      const cells = Array.from(document.querySelectorAll("table td, table th"));
      let sum = 0;
      for (const cell of cells) {
        const text = cell.textContent.trim();
        // Pull out numbers only (handles things like "1,234" or "12.5")
        const cleaned = text.replace(/,/g, "");
        const num = parseFloat(cleaned);
        if (!isNaN(num)) {
          sum += num;
        }
      }
      return sum;
    });

    console.log(`Seed ${seed}: sum = ${pageSum}`);
    grandTotal += pageSum;
  }

  console.log(`GRAND TOTAL: ${grandTotal}`);

  await browser.close();
})();
