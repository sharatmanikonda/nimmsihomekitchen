# Menu sheet setup

Nimmi posts each day's menu from a Google Sheet. The website reads it directly, so there is
nothing to upload or deploy. Changes show up within a few minutes.

## One-time setup

1. Create a new Google Sheet (for example "Nimmi's menu").
2. Rename the first tab to **Menu**. Use **File → Import → Upload** with `Menu.csv`, and choose
   "Replace current sheet".
3. Select the **Today** column (C2 down to the last dish) and choose **Insert → Checkbox**.
4. Add a second tab named **Settings** and import `Settings.csv` into it the same way.
5. In **Settings**, click A2 and choose **Format → Number → Date**. Click B2 and choose
   **Format → Number → Time**.
6. Click **Share → General access → Anyone with the link → Viewer**. The website can only read
   the sheet with this setting.
7. Copy the sheet's id from its address bar: the long part between `/d/` and `/edit`. Put it in
   `menuSheetId` in `src/data/kitchen.js`, then commit and push.

The tab names (**Menu**, **Settings**) and the header names in row 1 must stay exactly as they are.

## Posting a menu (every day)

In **Settings** row 2:

| Column | What to enter |
| --- | --- |
| Delivery date | The day the food is delivered. The site only shows the menu until its cutoff. |
| Cutoff time | When orders close, e.g. `20:00` or `8:00 PM` (India time). |
| Cutoff date | Leave empty to mean "the day before delivery". Fill it in for a different day. |
| Delivery slots | Separate slots with `\|`, e.g. `Lunch · 12–2 PM \| Evening · 5–7:30 PM`. |
| Note | Optional message to customers. |

In **Menu**, tick **Today** for each dish being cooked. Put a number in **Limit** to cap how
many can be ordered, or leave it empty for no cap. Untick yesterday's dishes that aren't being
made again.

Once the cutoff passes, the website shows "menu coming soon" for the next day until Nimmi sets a
new delivery date and ticks the dishes.

## Adding a new dish

New dishes are added to `MENU` in `src/data/kitchen.js` (name, price, unit, category). Then add a
row to the **Menu** tab with the same `id`. Rows whose id isn't in `MENU` are ignored.
