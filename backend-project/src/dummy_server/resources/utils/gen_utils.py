import random

import numpy as np
import pandas as pd
import torch
from torch_geometric.utils.num_nodes import maybe_num_nodes
from scipy.sparse import csr_matrix
import scipy.sparse as sp
from scipy.special import softmax
from torch_geometric.utils import (
    from_scipy_sparse_matrix,
    k_hop_subgraph,
    to_scipy_sparse_matrix,
    to_dense_adj,
    subgraph,
)

def padded_datalist(data_list, adj_list, max_num_nodes):
    for i, data in enumerate(data_list):
        data.adj_padded = padding_graphs(adj_list[i], max_num_nodes)
        data.x_padded = padding_features(data.x, max_num_nodes)
    return data_list

def padding_graphs(adj, max_num_nodes):
    num_nodes = adj.shape[0]
    adj_padded = np.eye((max_num_nodes))
    adj_padded[:num_nodes, :num_nodes] = adj
    return torch.tensor(adj_padded, dtype=torch.long)

def padding_features(features, max_num_nodes):
    feat_dim = features.shape[1]
    num_nodes = features.shape[0]
    features_padded = np.zeros((max_num_nodes, feat_dim))
    features_padded[:num_nodes] = features
    return torch.tensor(features_padded, dtype=torch.float)

