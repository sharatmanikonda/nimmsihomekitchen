# Menu sheet

Nimmi posts each day's menu from a Google Sheet, "Nimmi's Home Kitchen – Daily Menu". The
website reads it directly, so there is nothing to upload or deploy. Changes show up within a
few minutes.

Its id is set in `menuSheetId` in `src/data/kitchen.js`. The sheet must stay shared as
**Anyone with the link → Viewer**, or the website can't read it and shows "menu coming soon".

## Posting a menu (every day)

In the **Settings** tab, row 2:

| Column | What to enter |
| --- | --- |
| Delivery date | The day the food is delivered. The site only shows the menu until its cutoff. |
| Cutoff time | When orders close, e.g. `8:00 PM` (India time). |
| Cutoff date | Leave empty to mean "the day before delivery". Fill it in for a different day. |
| Delivery slots | Separate slots with `\|`, e.g. `Lunch · 12–2 PM \| Evening · 5–7:30 PM`. |
| Note | Optional message to customers. |

In the **Menu** tab, set **Today** to **Yes** for each dish being cooked, and to **No** (or
empty) for the rest. Put a number in **Limit** to cap how many can be ordered, or leave it
empty for no cap.

Once the cutoff passes, the website shows "menu coming soon" for the next day until Nimmi sets a
new delivery date.

The tab names (**Menu**, **Settings**) and the row 1 headings must stay exactly as they are.

## Adding a new dish

New dishes are added to `MENU` in `src/data/kitchen.js` (name, price, unit, category). Then add a
row to the **Menu** tab with the same value in the **id** column. Rows whose id isn't in `MENU`
are ignored.

## Recreating the sheet

`Menu.csv` and `Settings.csv` hold the starting contents. To build a new sheet from them: import
each CSV into a tab with the matching name, format Settings A2/C2 as dates and B2 as a time,
share it as "Anyone with the link → Viewer", and put its id (the part of the URL between `/d/`
and `/edit`) in `menuSheetId`.
