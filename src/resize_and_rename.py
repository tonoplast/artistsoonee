#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Sun Apr  6 08:12:05 2025

@author: sungw
"""


from PIL import Image
from pathlib import Path
from tqdm import tqdm
from datetime import datetime

def process_images(input_folder, output_folder, target_size=(800, 1000), background_color=(34, 40, 49),
                   sort_by='modified', reverse=False, aspect_tolerance=0.1,
                   include_date_in_filename=True, date_format="%Y%m%d"):
    """
    Processes images from the input folder by resizing them to the target_size.
    If the image's aspect ratio differs too much from the target, the image is resized
    preserving its aspect ratio and centered on a background of the given color.
    
    The files are sorted using a chosen date property (modified, created, exif, or oldest).
    Optionally, the original date is prefixed to the new filename.
    
    Parameters:
      - input_folder: Folder containing the images.
      - output_folder: Folder where processed images will be saved.
      - target_size: Tuple (width, height) for the output image dimensions.
      - background_color: Background color as an RGB tuple.
      - sort_by: Which date property to use for sorting:
                'modified' (file's modification time),
                'created' (file's creation time),
                'exif' (original capture time from EXIF, if available),
                'oldest' (the earliest among the file's creation, modification, and accessed times).
      - reverse: If True, reverse the sort order (e.g., latest first).
      - aspect_tolerance: Tolerance for aspect ratio difference; if within tolerance, image is directly resized.
      - include_date_in_filename: If True, the chosen date is extracted from the original file and
                                  prefixed to the new filename.
      - date_format: Format string for the date prefix (default "YYYYMMDD").
    """
    # Ensure the folders are Path objects and the output folder exists.
    input_folder = Path(input_folder)
    output_folder = Path(output_folder)
    output_folder.mkdir(exist_ok=True)

    def get_sort_date(f):
        stat = f.stat()
        if sort_by == 'modified':
            return datetime.fromtimestamp(stat.st_mtime)
        elif sort_by == 'created':
            return datetime.fromtimestamp(stat.st_ctime)
        elif sort_by == 'exif':
            try:
                with Image.open(f) as img:
                    exif_data = img.getexif()
                    dt_original = exif_data.get(36867)
                    if dt_original:
                        # EXIF date format: "YYYY:MM:DD HH:MM:SS"
                        return datetime.strptime(dt_original, "%Y:%m:%d %H:%M:%S")
            except Exception:
                pass
            # Fallback if EXIF not available.
            return datetime.fromtimestamp(stat.st_mtime)
        elif sort_by == 'oldest':
            # Return the earliest among creation, modification, and accessed times.
            return datetime.fromtimestamp(min(stat.st_ctime, stat.st_mtime, stat.st_atime))
        else:
            return datetime.fromtimestamp(stat.st_mtime)

    # Gather and sort image files.
    image_files = sorted(
        [f for f in input_folder.iterdir() if f.suffix.lower() in ['.jpg', '.jpeg', '.png', '.bmp', '.gif']],
        key=lambda f: get_sort_date(f),
        reverse=reverse
    )

    # Calculate target aspect ratio.
    target_width, target_height = target_size
    target_aspect = target_width / target_height

    # Process each image.
    for idx, image_path in enumerate(tqdm(image_files, desc="Processing images")):
        with Image.open(image_path) as img:
            img_width, img_height = img.size
            image_aspect = img_width / img_height

            if abs(image_aspect - target_aspect) <= aspect_tolerance:
                # Aspect ratios are similar: simply resize.
                result_img = img.resize(target_size, Image.ANTIALIAS)
            else:
                # Resize while preserving aspect ratio.
                if image_aspect > target_aspect:
                    new_width = target_width
                    new_height = round(target_width / image_aspect)
                else:
                    new_height = target_height
                    new_width = round(target_height * image_aspect)
                resized_img = img.resize((new_width, new_height), Image.ANTIALIAS)
                # Create a new image with the desired background color.
                result_img = Image.new("RGB", target_size, background_color)
                paste_x = (target_width - new_width) // 2
                paste_y = (target_height - new_height) // 2
                result_img.paste(resized_img, (paste_x, paste_y))
            
            # Build new filename            
            date_prefix = ""
            if include_date_in_filename:
                dt = get_sort_date(image_path)
                date_prefix = dt.strftime(date_format)
            # Also include a sequential number (zero-padded to 5 digits).
            seq_number = str(idx + 1).zfill(5)
            new_filename = f"{seq_number}_{date_prefix}{image_path.suffix.lower()}"
            result_img.save(output_folder / new_filename)

    print("✅ All images processed.")

# Process images sorted by the earliest date among created, modified, and accessed times.
# The new file names will have the original date as a prefix.
process_images(
    input_folder=Path("E:/GitHub/artistsoonee_paintings"),
    output_folder=Path("E:/GitHub/artistsoonee/src/assets/images"),
    target_size=(800, 1000),
    background_color=(34, 40, 49),
    sort_by='oldest',  # Options: 'modified', 'created', 'exif', 'oldest'
    reverse=True,      # Set to True if you want the latest (newest) based on the chosen date first.
    aspect_tolerance=0.1,
    include_date_in_filename=True,  # New: include original file date in new filename.
    date_format="%Y%m%d"             # Date format for the prefix; change as needed.
    )


