import numpy as np

def points_in_circle(radius, x0=0, y0=0, ):
    x_ = np.arange(x0 - radius - 1, x0 + radius + 1, dtype=int)
    y_ = np.arange(y0 - radius - 1, y0 + radius + 1, dtype=int)
    x, y = np.where((x_[:,np.newaxis] - x0)**2 + (y_ - y0)**2 <= radius**2)
    for x, y in zip(x_[x], y_[y]):
        yield x, y

def check_overlap(point, border_dist, min_dist, image):
    min_point = lambda p: max(0, p - min_dist)
    max_point = lambda p: min(width, p + min_dist)
    width = image.shape[0]
    x, y = point
    r = 20


    for x_t, y_t in points_in_circle(radius=r, x0=point[0], y0=point[1]):
        if x_t > (width - border_dist) or y_t > (width - border_dist) \
                or x_t < border_dist or y_t < border_dist:
            return True

        if image[y_t, x_t] != image[point[1], point[0]]:
            return True

    return False

def get_idxs(masks):
    mask_vals = np.unique(masks)
    mask_val = np.random.choice(mask_vals[1:])
    mask_idx = list(mask_vals[1:]).index(mask_val)
    mask = np.where(masks == mask_val, masks, 0)
    y, x = np.where(masks == mask_val)
    return y, x, mask, mask_val, mask_idx

def generate_probe_location(masks, probe_touching):
    location_found = False
    if not probe_touching:
        mask_val = 0
        y, x = np.where(masks == 0)
        mask = None
        mask_idx = 0
        possible_locations = [loc for loc in  zip(x, y)]

    max_tries = 50
    tries = 0
    while not location_found:
        if probe_touching:
            y, x, mask, mask_val, mask_idx = get_idxs(masks)
            possible_locations = [loc for loc in  zip(x, y)]

        min_dist = 20
        border_dist = 20
        width = masks.shape[0]

        loc = possible_locations[np.random.choice(len(possible_locations))]
        overlap = check_overlap(loc, border_dist, min_dist, masks)
        tries += 1
        if not overlap or tries > max_tries:
            return [int(l) for l in loc], mask, mask_idx, mask_val

def get_probe_location(masks, probe_touching=True):

    probe_location, mask, mask_idx, mask_val = generate_probe_location(masks, probe_touching)

    # Compute bounding boxes
    if mask is not None:
        mask_y, mask_x = np.where(mask)
        x_min = int(np.min(mask_x))
        x_max = int(np.max(mask_x))
        y_min = int(np.min(mask_y))
        y_max = int(np.max(mask_y))
        coords = ((x_min, y_min), (x_max, y_max))
        bounding_box = coords
    else:
        bounding_box = []

    return probe_location, bounding_box, mask_idx, mask_val
