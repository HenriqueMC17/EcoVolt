import { chromium } from "@playwright/test";

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto("http://localhost:3000");
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(1500);

  // 1. H1 heading
  const h1s = await page.$$eval("h1", els => els.map(el => el.textContent?.trim().slice(0, 100)));
  console.log("=== H1 headings ===");
  console.log(JSON.stringify(h1s));

  // 2. All links in hero / above the fold (first 3 sections)
  const heroCTAs = await page.$$eval(
    "a[href], button",
    els => els.slice(0, 20).map(el => ({ tag: el.tagName, text: el.textContent?.trim().slice(0, 60), href: (el as HTMLAnchorElement).href || "" }))
  );
  console.log("=== Hero CTAs (first 20 a/buttons) ===");
  heroCTAs.forEach(c => console.log(c.tag, JSON.stringify(c.text), c.href.slice(0, 60)));

  // 3. Navigation links
  const navLinks = await page.$$eval("nav a", els => els.map(el => el.textContent?.trim()));
  console.log("=== Nav Links ===");
  console.log(JSON.stringify(navLinks));

  // 4. Footer structure
  await page.keyboard.press("End");
  await page.waitForTimeout(500);
  const footerText = await page.$eval("footer", el => el.textContent?.slice(0, 300)).catch(() => "NO FOOTER");
  console.log("=== Footer preview ===");
  console.log(footerText);

  // 5. Form fields
  const formFields = await page.$$eval("form label, form input, form button, form textarea", els =>
    els.map(el => ({ tag: el.tagName, text: el.textContent?.trim().slice(0, 60), name: (el as HTMLInputElement).name, placeholder: (el as HTMLInputElement).placeholder }))
  );
  console.log("=== Form fields ===");
  formFields.forEach(f => console.log(f.tag, JSON.stringify(f.text), f.name, f.placeholder));

  await browser.close();
})();
