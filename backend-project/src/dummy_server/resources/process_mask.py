import os
import json
import numpy as np

def read_mask(idx, explainer, focus, dataset="mutag", model="gat"):
    mask_root = os.path.join(".", f"data/masks/{explainer}")
    mask_file = f"mask_{dataset}_{model}_{explainer}_{focus}.json"
    with open (os.path.join(mask_root, mask_file), "r") as f:
        dictmask = json.load(f)
    mask = dictmask[str(idx)]
    return mask

def control_sparsity(mask, sparsity):
    r"""
    :param edge_mask: mask that need to transform
    :param sparsity: sparsity we need to control i.e. 0.7, 0.5
    :return: transformed mask where top 1 - sparsity values are set to inf.
    """
    mask_len = len(mask)
    split_point = int((1 - sparsity) * mask_len)
    unimportant_indices = (-mask).argsort()[split_point:]
    mask[unimportant_indices] = 0
    return mask

def transform(mask, mask_nature, mask_transformation, level):
        """Transform masks according to the given strategy (topk, threshold, sparsity) and level."""
        mask = np.array(mask)
        level = min(len(mask), level)
        if mask_transformation == "topk":
            unimportant_indices = (-mask).argsort()[int(level * 2):] # +1 in index removed. Why was it there?
            mask[unimportant_indices] = 0
        if mask_transformation == "sparsity":
            mask = control_sparsity(mask, level)
        if mask_transformation == "threshold":
            mask = np.where(mask > level, mask, 0)
        new_mask = mask.astype("float")
        if mask_nature == "hard":
            new_mask = np.where(new_mask > 0, 1, 0)
        return new_mask



if __name__ == "__main__":
    mask = read_mask(idx=2, explainer='sa', focus='phenomenon')
    mask = transform(mask, mask_nature='soft', mask_transformation='threshold', level=0.5)
    print(mask)