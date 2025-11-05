1. Core Component: "futures lens"
Theme & Styling:

Overall: Dark mode. The main background is black or near-black.

Accent Color: A bright, saturated coral/orange (e.g., #FF6B4A) for all interactive elements, icons, and handles.

Typography: Use a clean, sans-serif font. The title "futures lens" is centered at the top in white.

Containers: Use border-radius for a soft, modern look on the main container, prompt field, and buttons.

2. Desktop Layout (Default)
A. Main Viewport:

Implement a side-by-side, split-screen comparison area.

This container should have rounded corners and be centered on the page.

B. Left Panel (Input):

Background: Light grey.

Controls: Place two icons in the top-left corner:

An upload arrow icon.

A camera icon.

These icons should be styled with the orange accent color and be interactive (e.g., <button>).

C. Right Panel (Output):

Background: Dark grey.

Controls: Place two icons in the bottom-right corner:

A checkmark icon.

A download arrow icon.

These icons should also be interactive and use the orange accent color.

D. Split-Screen Divider:

Implement a vertical, draggable divider that allows the user to change the relative width of the left and right panels.

Style the draggable handles as the two orange, pill-shaped elements shown in the design (one near the top, one near the bottom). The icons inside them (arrows, refresh) are part of this handle styling.

E. Bottom Control Bar:

This bar contains the main user inputs and should be laid out horizontally using a flexbox or grid.

Prompt Field: On the left, create a text input field with rounded corners. It must have the placeholder text "Your prompt here."

"Familiar/Unfamiliar" Slider:

On the right, implement an HTML range slider (<input type="range">).

Style the track and thumb to match the design (white/grey track, white circular thumb).

Add labels: "Familiar" to the left of the slider and "Unfamiliar" to the right.

The slider's default position should be near "Unfamiliar."

3. Responsive Behavior (Mobile)
This is a critical requirement. The side-by-side layout will not work on narrow screens.

On viewports below 600px (or a similar breakpoint):

Stack the Panels: The layout must change from horizontal (split-screen) to vertical (stacked).

The Left Panel (Input) should be on top.

The Right Panel (Output) should be directly below it.

The vertical split-screen divider and its handles should be hidden (display: none;).

Stack the Controls: The bottom control bar must also adapt.

The Prompt Field ("Your prompt here") should take up the full width (or near-full width) of the container.

The "Familiar/Unfamiliar" Slider (along with its labels) should be placed below the prompt field, also taking up the full width.

This ensures all controls are large, legible, and easy to use on a mobile device, with the "before" and "after" content stacking vertically for scrolling.