import { test } from "@playwright/test";
import * as fs from "fs";

test("DOM inspection", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(1500);

  const h1s = await page.$$eval("h1", els =>
    els.map(el => el.textContent?.trim().slice(0, 120))
  );

  const links = await page.$$eval("a, button", els =>
    els.slice(0, 25).map(el => ({
      tag: el.tagName,
      text: el.textContent?.trim().slice(0, 60),
      href: (el as HTMLAnchorElement).href || "",
    }))
  );

  const navLinks = await page.$$eval("nav a", els =>
    els.map(el => el.textContent?.trim())
  );

  await page.keyboard.press("End");
  await page.waitForTimeout(800);

  const footerText = await page
    .$eval("footer", el => el.textContent?.slice(0, 500))
    .catch(() => "NO FOOTER");

  const formData = await page
    .$$eval("form label, form input, form button, form textarea, form select", els =>
      els.map(el => ({
        tag: el.tagName,
        text: el.textContent?.trim().slice(0, 60),
        name: (el as HTMLInputElement).name,
        placeholder: (el as HTMLInputElement).placeholder,
        type: (el as HTMLInputElement).type,
      }))
    )
    .catch(() => []);

  const result = {
    h1s,
    firstLinks: links,
    navLinks,
    footerPreview: footerText,
    formFields: formData,
  };

  fs.writeFileSync("dom-inspect-result.json", JSON.stringify(result, null, 2));
  console.log("Written to dom-inspect-result.json");
});
