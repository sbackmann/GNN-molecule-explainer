import numpy as np
import torch
import networkx as nx
import matplotlib.pyplot as plt
from torch_geometric.data import Data

def visualize_mol(data: Data):
    graphid = data.idx
    topk = 4

    pos_edges = []
    filter_edges = []

    list_edges = data.edge_index.t().cpu().numpy()
    edge_weights = np.ones(list_edges.shape[0])

    sorted_edge_weights = np.sort(edge_weights)
    thres_index = max(int(edge_weights.shape[0] - topk), 0)
    thres = sorted_edge_weights[thres_index]

    for i in range(len(edge_weights)):
        u, v = list_edges[i]
        d = float(edge_weights[i])
        if u < v:
            continue
        if d >= thres:
            pos_edges.append((u, v))
        filter_edges.append((u, v))

    one_hot_label = data.x.cpu().numpy()
    node_label = np.argmax(one_hot_label, 1)
    max_label = np.max(node_label) + 1
    nmb_nodes = data.num_nodes

    G = nx.Graph()
    G.add_nodes_from(range(nmb_nodes))
    G.add_edges_from(filter_edges)

    pos_edges = [(u, v) for (u, v) in pos_edges if u in G.nodes() and v in G.nodes()]
    pos = nx.kamada_kawai_layout(G)


    colors = ['orange','red','lime','green','blue','orchid','darksalmon','darkslategray','gold','bisque','tan','lightseagreen','indigo','navy']
    atom_labels_dict = {0: 'C', 1: 'N', 2: 'O', 3: 'F', 4: 'I', 5: 'Cl', 6: 'Br'}


    label2nodes = []
    for i in range(max_label):
        label2nodes.append([])
    for i in range(nmb_nodes):
        if i in G.nodes():
            label2nodes[node_label[i]].append(i)

    atom_labels = np.zeros(nmb_nodes, dtype=object)
    for i in range(max_label):
        node_filter = []
        for j in range(len(label2nodes[i])):
            node_filter.append(label2nodes[i][j])
        atom_labels[node_filter] = atom_labels_dict[i]
        nx.draw_networkx_nodes(G, pos,
                               nodelist=node_filter,
                               node_color=colors[i],
                               node_size=300)

    nx.draw_networkx_edges(G, pos, width=2, edge_color='grey')

    nx.draw_networkx_edges(G, pos,
                           edgelist=pos_edges,
                           width=2)

    labels = {}
    node_idx = np.array(list(G.nodes()))
    for A, B in zip(node_idx, atom_labels):
        labels[A] = B
    nx.draw_networkx_labels(G, pos, labels=labels, font_size=12)

    plt.title('Graph: '+str(graphid.item())+' label: '+str(data.y.item()))
    plt.axis('off')
    plt.show()
    plt.clf()
