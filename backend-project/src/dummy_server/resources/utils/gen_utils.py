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

def from_edge_index_to_adj(edge_index, edge_weight, max_n):
    adj = to_scipy_sparse_matrix(edge_index, edge_attr=edge_weight).toarray()
    assert len(adj) <= max_n, "The adjacency matrix contains more nodes than the graph!"
    if len(adj) < max_n:
        adj = np.pad(adj, (0, max_n - len(adj)), mode="constant")
    return torch.FloatTensor(adj)


def from_adj_to_edge_index_torch(adj):
    adj_sparse = adj.to_sparse()
    edge_index = adj_sparse.indices().to(dtype=torch.long)
    edge_attr = adj_sparse.values()
    return edge_index, edge_attr


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

def data_to_dict(data_obj):
    return {key: data.numpy().tolist() for key, data in data_obj}