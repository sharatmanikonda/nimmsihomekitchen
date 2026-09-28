# Menu sheet

Nimmi posts each day's menu from a Google Sheet, "Nimmi's Home Kitchen – Daily Menu". The
website reads it directly, so there is nothing to upload or deploy. Changes show up within a
minute or two.

Its id is set in `menuSheetId` in `src/data/kitchen.js`. The sheet must stay shared as
**Anyone with the link → Viewer**, or the website can't read it and shows "menu coming soon".

## Posting a menu (every day)

1. In the **Settings** tab, row 2:

   | Column | What to enter |
   | --- | --- |
   | Delivery date | The day the food is delivered. The site shows the menu only until its cutoff. |
   | Cutoff time | When orders close, e.g. `10:30 AM` (India time). |
   | Cutoff date | Leave empty to mean "the delivery day". Fill it in only if orders close on an earlier day. |
   | Delivery slots | e.g. `Lunch`. Separate several with `\|`: `Lunch \| Dinner`. |
   | Note | Optional message to customers. |

2. In the **Menu** tab, set **Today** to **Yes** for each dish being cooked, and to **No** (or
   empty) for the rest. Check **Portion** (e.g. `500g`) and **Price** (e.g. `85`). For a new
   dish, add a row at the bottom with at least Dish, Price and Today. **Limit** caps how many can
   be ordered; **Type** marks non-veg dishes.

3. Open the website's `#/post-menu` page. Check that the menu looks right, then tap
   **Share to WhatsApp group**. The message reads like Nimmi's usual posts and ends with the
   order link.

Once the cutoff passes, the website shows "menu coming soon" for the next day until Nimmi sets a
new delivery date.

The tab names (**Menu**, **Settings**) and the row 1 headings must stay exactly as they are.

## How dishes are matched

A dish whose name matches an item in `MENU` in `src/data/kitchen.js` is marked "On today's
menu" in the site's full menu. Any other dish (Sambar, Brinjal fry, …) still appears in
today's menu with the portion and price from the sheet.

## Recreating the sheet

`make_sheet.py` builds `nimmi-menu.xlsx` with both tabs, dropdowns and formats. Upload it to
Google Drive, open it with Google Sheets, share it as "Anyone with the link → Viewer", and put its
id (the part of the URL between `/d/` and `/edit`) in `menuSheetId`.
