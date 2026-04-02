# Muheeb — Image Guide

Replace the placeholder background colors with real photos by adding image files to this folder.

## Required Images

| File name              | Where used              | Recommended size    | What to shoot          |
|------------------------|-------------------------|---------------------|------------------------|
| lifestyle-main.jpg     | Image grid (large left) | 900x1200px portrait | Man wearing thoob      |
| lifestyle-fabric.jpg   | Image grid (top right)  | 800x600px landscape | Fabric close-up        |
| lifestyle-packaged.jpg | Image grid (bottom right)| 800x600px landscape| Folded/packaged thoob  |
| step-1-fabric.jpg      | How it works — step 1   | 800x600px landscape | Fabric selection       |
| step-2-measurements.jpg| How it works — step 2   | 800x600px landscape | Measurements           |
| step-3-delivery.jpg    | How it works — step 3   | 800x600px landscape | Delivery / door drop   |
| wide-banner.jpg        | Wide cinematic section  | 1920x820px wide     | Premium thoob detail   |

## How to add an image

1. Add the image file to this /images/ folder
2. The HTML already references the correct filename via style="background-image: url('images/FILENAME')"
3. If the file exists, it shows automatically. If not, the warm gray placeholder color shows instead.

## Video

To add the intro video:
1. Upload your video to YouTube
2. Copy the YouTube video ID (the part after ?v= in the URL)
3. Open content/content.js
4. Find: youtubeId: null
5. Replace null with your ID in quotes: youtubeId: "your-id-here"
6. Save — the placeholder will automatically be replaced with the YouTube embed
