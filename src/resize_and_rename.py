#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Sun Apr  6 08:12:05 2025
"""

from PIL import Image
from pathlib import Path
from tqdm import tqdm
from datetime import datetime

def process_images(input_folder, output_folder, target_size=(800, 1000), background_color=(34, 40, 49),
                   sort_by='modified', aspect_tolerance=0.1,
                   include_date_in_filename=True, date_format="%Y%m%d"):
    """
    Processes images by resizing them to target_size.
    If the image’s aspect ratio differs too much from the target,
    the image is resized preserving its aspect ratio and centered
    on a background of the given color.

    The files are sorted using a chosen date property.
    The original date is optionally prefixed to the new filename.
    The new filename’s sequential number is assigned so that 00001
    is the oldest and the highest number is the newest.
    """
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
                        return datetime.strptime(dt_original, "%Y:%m:%d %H:%M:%S")
            except Exception:
                pass
            return datetime.fromtimestamp(stat.st_mtime)
        elif sort_by == 'oldest':
            dates = [
                datetime.fromtimestamp(stat.st_ctime),
                datetime.fromtimestamp(stat.st_mtime),
                datetime.fromtimestamp(stat.st_atime)
            ]
            try:
                with Image.open(f) as img:
                    exif_data = img.getexif()
                    dt_original = exif_data.get(36867)
                    if dt_original:
                        exif_date = datetime.strptime(dt_original, "%Y:%m:%d %H:%M:%S")
                        dates.append(exif_date)
            except Exception:
                pass
            return min(dates)
        else:
            return datetime.fromtimestamp(stat.st_mtime)

    # Sort files in ascending order (oldest first)
    image_files = sorted(
        [f for f in input_folder.iterdir() if f.suffix.lower() in ['.jpg', '.jpeg', '.png', '.bmp', '.gif']],
        key=lambda f: get_sort_date(f),
        reverse=False
    )

    target_width, target_height = target_size
    target_aspect = target_width / target_height

    total_files = len(image_files)

    for idx, image_path in enumerate(tqdm(image_files, desc="Processing images")):
        with Image.open(image_path) as img:
            img_width, img_height = img.size
            image_aspect = img_width / img_height

            if abs(image_aspect - target_aspect) <= aspect_tolerance:
                result_img = img.resize(target_size, Image.LANCZOS)
            else:
                if image_aspect > target_aspect:
                    new_width = target_width
                    new_height = round(target_width / image_aspect)
                else:
                    new_height = target_height
                    new_width = round(target_height * image_aspect)
                resized_img = img.resize((new_width, new_height), Image.LANCZOS)
                result_img = Image.new("RGB", target_size, background_color)
                paste_x = (target_width - new_width) // 2
                paste_y = (target_height - new_height) // 2
                result_img.paste(resized_img, (paste_x, paste_y))
            
            date_prefix = ""
            if include_date_in_filename:
                dt = get_sort_date(image_path)
                date_prefix = dt.strftime(date_format)
            
            # Assign sequence so that 00001 is oldest
            seq_number = str(idx + 1).zfill(5)
            new_filename = f"{seq_number}_{date_prefix}{image_path.suffix.lower()}"
            result_img.save(output_folder / new_filename)
    
    print("✅ All images processed.")

# Run the script
process_images(
    input_folder=Path("E:/GitHub/artistsoonee_paintings"),
    output_folder=Path("E:/GitHub/artistsoonee/src/assets/images_gallery"),
    target_size=(800, 1000),
    background_color=(34, 40, 49),
    sort_by='oldest',  # Using 'oldest' to get ascending order (oldest first)
    aspect_tolerance=0.1,
    include_date_in_filename=True,
    date_format="%Y%m%d"
)
