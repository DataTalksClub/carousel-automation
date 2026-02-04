# Using Figma MCP with this project

This project can pull design context (HTML/CSS) from Figma using the **Figma MCP** server. Use it to sync the cover, title-paragraph, outro, or any frame from your Figma file into the carousel templates.

## What you need

1. **Figma MCP** enabled in Cursor (the "Figma" MCP server).
2. **A link to your Figma design** – either:
   - The whole file: `https://figma.com/design/YOUR_FILE_KEY/YourFileName`
   - A specific frame (recommended): right‑click the frame in Figma → **Copy link to selection**. The URL will look like:
     `https://figma.com/design/YOUR_FILE_KEY/YourFileName?node-id=123-456`

## How to use it

1. In Figma, select the frame you want to turn into a carousel frame (e.g. the cover).
2. Copy the link (Share → Copy link, or right‑click frame → Copy link to selection).
3. In Cursor, ask the agent to **update the [cover / title-paragraph / outro] from Figma** and paste the link.

The agent will:

- Call the Figma MCP **get_design_context** with your `fileKey` and `nodeId` (from the URL).
- Request **plain HTML + CSS** so the output fits this stack.
- Map the result into `templates/frames/<type>.html` and `templates/css/frames/<type>.css` (one frame type at a time).

## URL format

From a URL like:

`https://www.figma.com/design/Abc12XyZ/Carousel-Frames?node-id=42-123`

we use:

- **fileKey:** `Abc12XyZ`
- **nodeId:** `42:123` (replace `-` with `:` in `node-id`)

## Tips

- **One frame per call** – Share a link to a single frame (e.g. the cover) so the MCP returns that frame only.
- **Name frames clearly** – Names like "cover", "title-paragraph-1", "outro" in Figma make it easier to match them to our frame types.
- **Our canvas is 630×1200 (vertical)** – If your Figma frame is another size, the agent will scale or adapt the layout to fit.

## Design references (frame type → Figma)

| Frame type        | Figma link |
|-------------------|------------|
| **title-paragraph** | [DataTalks.Club event banners – node 3389-164](https://www.figma.com/design/Q0752C6PS1AbIdY4bmRAFA/DataTalks.Club-event-banners?node-id=3389-164) |
| **outro**         | [DataTalks.Club event banners – node 3389-186](https://www.figma.com/design/Q0752C6PS1AbIdY4bmRAFA/DataTalks.Club-event-banners?node-id=3389-186) |

Use these links when updating a frame from Figma (e.g. “update title-paragraph from this Figma”) or when adding new frame types from the same file.

## If you use Figma Desktop

With the Figma desktop app and the desktop MCP server, you can **select a frame in Figma** and ask the agent to “generate my selection as plain HTML + CSS for the carousel cover” without pasting a URL. The agent will use the current selection.
