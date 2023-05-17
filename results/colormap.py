import numpy as np

COLORS = np.array(
    [
        0.000, 0.447, 0.741,
        0.850, 0.325, 0.098,
        0.929, 0.694, 0.125,
        0.494, 0.184, 0.556,
        0.466, 0.674, 0.188,
        0.301, 0.745, 0.933,
        0.635, 0.078, 0.184,
        0.300, 0.300, 0.300,
        0.600, 0.600, 0.600,
        1.000, 0.000, 0.000,
        1.000, 0.500, 0.000,
        0.749, 0.749, 0.000,
        0.000, 1.000, 0.000,
        0.000, 0.000, 1.000,
        0.667, 0.000, 1.000,
        0.333, 0.333, 0.000,
        0.333, 0.667, 0.000,
        0.333, 1.000, 0.000,
        0.667, 0.333, 0.000,
        0.667, 0.667, 0.000,
        0.667, 1.000, 0.000,
        1.000, 0.333, 0.000,
        1.000, 0.667, 0.000,
        1.000, 1.000, 0.000,
        0.000, 0.333, 0.500,
        0.000, 0.667, 0.500,
        0.000, 1.000, 0.500,
        0.333, 0.000, 0.500,
        0.333, 0.333, 0.500,
        0.333, 0.667, 0.500,
        0.333, 1.000, 0.500,
        0.667, 0.000, 0.500,
        0.667, 0.333, 0.500,
        0.667, 0.667, 0.500,
        0.667, 1.000, 0.500,
        1.000, 0.000, 0.500,
        1.000, 0.333, 0.500,
        1.000, 0.667, 0.500,
        1.000, 1.000, 0.500,
        0.000, 0.333, 1.000,
        0.000, 0.667, 1.000,
        0.000, 1.000, 1.000,
        0.333, 0.000, 1.000,
        0.333, 0.333, 1.000,
        0.333, 0.667, 1.000,
        0.333, 1.000, 1.000,
        0.667, 0.000, 1.000,
        0.667, 0.333, 1.000,
        0.667, 0.667, 1.000,
        0.667, 1.000, 1.000,
        1.000, 0.000, 1.000,
        1.000, 0.333, 1.000,
        1.000, 0.667, 1.000,
        0.333, 0.000, 0.000,
        0.500, 0.000, 0.000,
        0.667, 0.000, 0.000,
        0.833, 0.000, 0.000,
        1.000, 0.000, 0.000,
        0.000, 0.167, 0.000,
        0.000, 0.333, 0.000,
        0.000, 0.500, 0.000,
        0.000, 0.667, 0.000,
        0.000, 0.833, 0.000,
        0.000, 1.000, 0.000,
        0.000, 0.000, 0.167,
        0.000, 0.000, 0.333,
        0.000, 0.000, 0.500,
        0.000, 0.000, 0.667,
        0.000, 0.000, 0.833,
        0.000, 0.000, 1.000,
        0.000, 0.000, 0.000,
        0.143, 0.143, 0.143,
        0.857, 0.857, 0.857,
        1.000, 1.000, 1.000
    ]
).astype(np.float32).reshape(-1, 3) 

def rgb_to_labels(rgb_mask):
    """
    Converts an RGB mask to a label mask. The RGB mask can be of shape
    (height, width, 3). The label mask will be of shape
    (height, width).

    Args:
        rgb_mask: np.ndarray mask of shape (height, width, 3)

    Returns:
        label_mask: np.ndarray mask of shape (height, width)
    """
    if len(rgb_mask.shape) == 2:
        return rgb_mask
    
    height, width, _ = rgb_mask.shape
    label_mask = np.zeros((height, width), dtype=np.uint8)
    label_colors = np.unique(rgb_mask.reshape(-1, 3), axis=0)
    for index, label_color in enumerate(label_colors):
        label_mask[np.where(np.all(rgb_mask == label_color, axis=-1))] = index
    
    return label_mask

def remap_labels(mask, label_assignment=None):
    """
    Relabels a mask based on label_assignment. If label_assignment is None,
    then the mask is relabeled sequentially from 0 to num_labels - 1.

    Args:
        mask: np.ndarray mask of shape (height, width) or (height, width, 3)
        label_assignment: dict of label assignments
    
    Returns:
        relabeled_mask: np.ndarray mask of shape (height, width)
    """
    if len(mask.shape) == 3:
        mask = rgb_to_labels(mask)
    
    height, width = mask.shape
    mask_labels = np.unique(mask)
    relabeled_mask = np.zeros((height, width), dtype=np.uint8)
    
    if label_assignment is None:
        label_assignment = {label: i for i, label in enumerate(mask_labels)}

    n_labels = len(label_assignment)
    hungarian_missing_labels = 0

    for index, (old_label, new_label) in enumerate(label_assignment.items()):
        if new_label == -1:
            # Hungarian algorithm couldn't find appropriate match
            new_label = n_labels - hungarian_missing_labels
            hungarian_missing_labels += 1

        relabeled_mask[mask == old_label] = new_label

    return relabeled_mask    
    

def labels_to_rgb(mask):
    """
    Converts a mask to RGB using the color map defined above.

    Args:
        mask: np.ndarray mask of shape (height, width)
    
    Returns:
        rgb_mask: np.ndarray mask of shape (height, width, 3)
    """
    assert len(mask.shape) == 2
    height, width = mask.shape
    rgb_mask = np.zeros((height, width, 3), dtype=np.float32)
    labels = np.unique(mask)
    for index, label in enumerate(labels):
        if index >= len(COLORS):
            rgb = np.random.random(3)
        else:
            rgb = COLORS[index]
            
        rgb_mask[mask == label] = rgb 
    
    return rgb_mask


from scipy.optimize import linear_sum_assignment
def hungarian_assigmnent(gt, pred):
    """
    Compute an optimal assignment of predicted labels to ground truth
    labels using the hungarian algorithm. 

    Args: 
        gt (`np.ndarray`):
            Array of labels with shape (height x width)
        pred (`np.ndarray`):
            Array of predicted labels with shape (height x width)
    
    Returns:
        assignment (`np.ndarray`):
            The assignment of predicted labels to ground truth labels
        metric (`np.float64`):
            The metric evaluation for the given assignment
    """
    assert len(gt.shape) == 2 and len(pred.shape) == 2

    gt_labels = np.unique(gt)
    pred_labels = np.unique(pred)
    n_labels = max(len(gt_labels), len(pred_labels))

    cost_matrix = np.zeros((n_labels, n_labels))  
    label_matrix = np.ones((n_labels, n_labels)) * -1   # unnasigned labels will be given a -1 

    # build cost matrix
    # For each predicted label, compute the iou
    # if it was associated with a different ground truth label   
    for i, pred_label in enumerate(pred_labels):
        for j, gt_label in enumerate(gt_labels):
            pred_match = pred == pred_label
            gt_match = gt == gt_label

            intersection = np.sum(pred_match & gt_match)
            union = np.sum(pred_match | gt_match)
            score = intersection / union
            cost_matrix[i, j] = score   
            label_matrix[i, j] = gt_label
            
    row_inds, col_inds = linear_sum_assignment(cost_matrix=cost_matrix, maximize=True)
    label_assignment = {}
    for row in row_inds:
        label_assignment[row] = int(label_matrix[row, col_inds[row]])

    return label_assignment