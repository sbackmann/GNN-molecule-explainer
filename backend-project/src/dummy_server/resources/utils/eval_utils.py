""" fidelity.py
    Compute Fidelity+ and Fidelity- scores.
"""

import numpy as np
import torch


def fidelity_acc(related_preds):
    labels = related_preds["true_label"]
    ori_labels = np.argmax(related_preds["origin"])
    unimportant_labels = np.argmax(related_preds["maskout"])
    p_1 = np.array(ori_labels == labels).astype(int)
    p_2 = np.array(unimportant_labels == labels).astype(int)
    drop_probability = np.abs(p_1 - p_2)
    return drop_probability.mean().item()


def fidelity_acc_inv(related_preds):
    labels = related_preds["true_label"]
    ori_labels = np.argmax(related_preds["origin"])
    important_labels = np.argmax(related_preds["masked"])
    p_1 = np.array([ori_labels == labels]).astype(int)
    p_2 = np.array([important_labels == labels]).astype(int)
    drop_probability = np.abs(p_1 - p_2)
    return drop_probability.mean().item()


def fidelity_gnn_acc(related_preds):
    labels = related_preds["pred_label"]
    ori_labels = np.argmax(related_preds["origin"])
    unimportant_labels = np.argmax(related_preds["maskout"])
    p_1 = np.array(ori_labels == labels).astype(int)
    p_2 = np.array(unimportant_labels == labels).astype(int)
    drop_probability = np.abs(p_1 - p_2)
    return drop_probability.mean().item()


def fidelity_gnn_acc_inv(related_preds):
    labels = related_preds["pred_label"]
    ori_labels = np.argmax(related_preds["origin"])
    important_labels = np.argmax(related_preds["masked"])
    p_1 = np.array([ori_labels == labels]).astype(int)
    p_2 = np.array([important_labels == labels]).astype(int)
    drop_probability = np.abs(p_1 - p_2)
    return drop_probability.mean().item()


# Fidelity+  metric  studies  the  prediction  change  by
# removing  important  nodes/edges/node  features.
# Higher fidelity+ value indicates good explanations -->1
def fidelity_prob(related_preds):
    labels = int(related_preds["true_label"])
    ori_probs = np.choose(labels, related_preds["origin"])
    unimportant_probs = np.choose(labels, related_preds["maskout"])
    drop_probability = ori_probs - unimportant_probs
    return drop_probability.mean().item()


# Fidelity-  metric  studies  the  prediction  change  by
# removing  unimportant  nodes/edges/node  features.
# Lower fidelity- value indicates good explanations -->0
def fidelity_prob_inv(related_preds):
    labels = related_preds["true_label"]
    ori_probs = np.choose(labels, related_preds["origin"])
    important_probs = np.choose(labels, related_preds["masked"])
    drop_probability = ori_probs - important_probs
    return drop_probability.mean().item()


# Fidelity+  metric  studies  the  prediction  change  by
# removing  important  nodes/edges/node  features.
# Higher fidelity+ value indicates good explanations -->1
def fidelity_gnn_prob(related_preds):
    labels = related_preds["pred_label"]
    ori_probs = np.choose(labels, related_preds["origin"])
    unimportant_probs = np.choose(labels, related_preds["maskout"])
    drop_probability = np.abs(ori_probs - unimportant_probs)
    return drop_probability.mean().item()


# Fidelity-  metric  studies  the  prediction  change  by
# removing  unimportant  nodes/edges/node  features.
# Lower fidelity- value indicates good explanations -->0
def fidelity_gnn_prob_inv(related_preds):
    labels = related_preds["pred_label"]
    ori_probs = np.choose(labels, related_preds["origin"])
    important_probs = np.choose(labels, related_preds["masked"])
    drop_probability = np.abs(ori_probs - important_probs)
    return drop_probability.mean().item()
