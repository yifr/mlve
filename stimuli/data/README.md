# Dataset Structure

For each dataset, we provide a standardized format of 100 images
with separate directories for images, normals, depths, instance masks,
and metadata for that frame (this varies across datasets).

# To-Do
### Gestalt
    1. Randomly select 100 images (33, 33, 34 across textures)
    2. Write all the normals to hdf5 (cam normals)
    3. Depths to HDF5
    4. Write out metadata per-frame

### Hypersim
    1. Last frame first camera first 100 scenes
    2. Get camera position from cam data

### NSD
    1. Already formatted

### TDW 
    1. Copy over + structure

