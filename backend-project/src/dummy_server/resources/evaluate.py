#from flask import Flask, request, jsonify
from torch_geometric.data import Data
from .utils.eval_utils import *
from .model import GAT
from scipy.stats import entropy
import argparse
import numpy as np
import torch
import random
import os


def arg_parse():
    parser = argparse.ArgumentParser()
    parser.add_argument('--path_to_model', type=str, default='./model/mutag/gat_3l_cpu_best.pth')
    parser.add_argument('--input_dim', type=int, default=7)
    parser.add_argument('--output_dim', type=int, default=2)
    parser.add_argument('--edge_dim', type=int, default=1)
    parser.add_argument('--num_layers', type=int, default=3)
    parser.add_argument('--hidden_dim', type=int, default=32)
    parser.add_argument('--dropout', type=float, default=0.0)
    parser.add_argument('--readout', type=str, default='max')
    args, unknown = parser.parse_known_args()
    return args

def fix_random_seed(seed):
    np.random.seed(seed)
    random.seed(seed)
    if torch.cuda.is_available():
        torch.cuda.manual_seed(seed)

def load_model(path_to_model, model, device):
    state_dict = torch.load(
        os.path.join(path_to_model)
    )["net"]
    model.load_state_dict(state_dict)
    model = model.to(device)
    model.eval()
    return model

def data_to_pytorchData(data):
    pytorchData = Data(x=torch.FloatTensor(data['x']), 
        edge_index=torch.LongTensor(data['edge_index']), 
        edge_attr=torch.FloatTensor(data['edge_attr']), 
        idx=torch.LongTensor(data['idx']), 
        y=torch.FloatTensor(data['y']),
        batch=torch.zeros(len(data['x']), dtype=torch.int64))
    return pytorchData


class Evaluate(object):
    def __init__(self, model, focus, mask_nature, device):
        self.focus = focus
        self.mask_nature = mask_nature
        self.model = model
        self.device = device

    def related_pred_graph(self, graph, edge_mask):
        data = data_to_pytorchData(graph)
        ori_prob_idx = self.model.get_prob(data).cpu().detach().numpy()[0]
        masked_data, maskout_data = data.clone(), data.clone()
        edge_mask = torch.Tensor(edge_mask).to(self.device)
        if self.mask_nature == "hard":
            masked_data.edge_index = data.edge_index[:, edge_mask > 0].to(self.device)
            masked_data.edge_attr = data.edge_attr[edge_mask > 0].to(self.device)
            maskout_data.edge_index = data.edge_index[:, edge_mask <= 0].to(self.device)
            maskout_data.edge_attr = data.edge_attr[edge_mask <= 0].to(self.device)
        else:
            masked_data.edge_weight = edge_mask
            maskout_data.edge_weight = 1 - edge_mask
        
        masked_prob_idx = self.model.get_prob(masked_data).cpu().detach().numpy()[0]
        maskout_prob_idx = self.model.get_prob(maskout_data).cpu().detach().numpy()[0]

        true_label = data.y.cpu().item()
        pred_label = np.argmax(ori_prob_idx)

        # assert true_label == pred_label, "The label predicted by the GCN does not match the true label."\
        self.related_pred = dict({
                "idx": int(data.idx.cpu().item()),
                "masked": masked_prob_idx,
                "maskout": maskout_prob_idx,
                "origin": ori_prob_idx,
                "true_label": int(true_label),
                "gnn_label": int(pred_label),
            })
        return 

    def eval_fid(self):
        if self.focus == "phenomenon":
            fidelity_scores = {
                "fidelity_acc+": fidelity_acc(self.related_pred),
                "fidelity_acc-": fidelity_acc_inv(self.related_pred),
                "fidelity_prob+": fidelity_prob(self.related_pred),
                "fidelity_prob-": fidelity_prob_inv(self.related_pred),
            }
        else:
            fidelity_scores = {
                "fidelity_gnn_acc+": fidelity_gnn_acc(self.related_pred),
                "fidelity_gnn_acc-": fidelity_gnn_acc_inv(self.related_pred),
                "fidelity_gnn_prob+": fidelity_gnn_prob(self.related_pred),
                "fidelity_gnn_prob-": fidelity_gnn_prob_inv(self.related_pred),
            }
        return fidelity_scores

    def get_mask_properties(self, mask):
        mask_info = {
            "mask_size": mask.sum(),
            "mask_sparsity": 1.0 - mask.sum() / len(mask),
            "mask_entropy": entropy(mask[mask>0])
        }
        return mask_info

def compute_scores(graph, edge_mask, focus, mask_nature):
    fix_random_seed(0)
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    params = arg_parse()
    input_dim, output_dim = params.input_dim, params.output_dim

    model = GAT(input_dim, output_dim, params)
    model = load_model(params.path_to_model, model, device)

    eval_module = Evaluate(model, focus, mask_nature, device)
    
    eval_module.related_pred_graph(graph, edge_mask)
    scores = eval_module.eval_fid()
    
    mask_properties = eval_module.get_mask_properties(edge_mask)
    
    return scores, mask_properties


if __name__ == '__main__':
    graph = {'x':np.array([[0,0,1,0,0,0,0], [1,0,0,0,0,0,0]]), 'edge_index':np.array([[0,1],[1,0]]), 'edge_attr':np.array([[1.], [1.]]), 'y':[1], 'idx':[0]}
    edge_mask = np.array([0.2, 0.8])
    scores, mask_properties = compute_scores(graph, edge_mask, "phenomenon", "hard")
    print('scores', scores)
    print('mask_properties', mask_properties)
    #app.run()
