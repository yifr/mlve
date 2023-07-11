import os
import sys
from tqdm import tqdm
import scipy
import numpy as np
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt


def plot_accuracy(df, title, accuracy_key, target_key, errorbar=("ci", 95)):
    """
    Returns barplot for accuracy by target as well as boxplot summary
    Params:
        df: DataFrame of results (presumably cleaned)
        accuracy_key: name of column to compute accuracy over
        target_key: Who the accuracy is computed for (ie; userID, stimulus)
        ignore_duplicates: will ignore duplicate values
    """
    fig, axs = plt.subplots(1, 2, figsize=(16, 8))
    
    accuracy_by_target = df.groupby(target_key)[accuracy_key].mean().sort_values()

    sns.barplot(y=accuracy_key, x=target_key, order=accuracy_by_target.keys(), errorbar=errorbar, data=df, ax=axs[0])
    sns.boxplot(data=accuracy_by_target, ax=axs[1])
    # axs[0].barplot(accuracy_by_target)
    # axs[1].boxplot(accuracy_by_target)
    
    axs[0].set_xticks([], [])
    axs[0].set_ylabel("Accuracy", fontsize=18)
    axs[0].set_xlabel(f"{target_key}")
    axs[1].set_xticks([], [])
    axs[1].set_xlabel("Accuracy Overview")
    axs[0].set_ylim(0, 1)
    axs[1].set_ylim(0, 1)
    plt.suptitle(title, fontsize=24)
    return fig, accuracy_by_target.mean()

def plot_surface_normal_split_half(df, title, measure="correlation"):
    """
    Returns split half and spearman brown corrected split half
    """
    # Find batch with greatest number of participants
    get_batch_key = lambda x: [k for k in x if "batch" in k][0]
    batch_key = get_batch_key(df.columns)
    batch_counts = df[batch_key].value_counts()
    batches = list(batch_counts.keys())
    max_batch = batches[batch_counts.argmax()]
    batch_df = df.loc[df[batch_key] == max_batch]
    
    # Build data table
    trials = [np.array(x[1].values[:]) for x in batch_df.groupby("imageURL")["indicatorFinalDirection"]]
    data = []
    min_subs_per_point = np.min([len(x) for x in trials])
    print("Minimum people per trial:", min_subs_per_point)
    if min_subs_per_point < 7:
        print("Not enough people to check split half.")
        return None, None
    
    for x in trials:
        data.append([])
        for y in range(min_subs_per_point):
            data[-1].append(x[y])
    data = np.array(data)
    print(f"{data.shape} trials to choose from")

    # Take 1000 random splits of participants
    splits = 1000
    split_halfs = np.ndarray((splits, 3))
    n_subs_half = min_subs_per_point // 2

    subs_per_split = np.arange(2,(min_subs_per_point // 2) + 1, 1)
    print("Subs per split", subs_per_split)
    split_halfs_by_n = np.ndarray((len(subs_per_split), splits, 3))
    split_halfs_by_n_sb = np.ndarray((len(subs_per_split), splits, 3))
    for i0, n_subs_half in enumerate(subs_per_split):
        for i in range(splits):
            inds = np.random.choice(range(min_subs_per_point), int(n_subs_half*2), replace=False)
            vec0 = np.mean(data[:,inds[:n_subs_half],:], axis=1)
            vec1 = np.mean(data[:, inds[n_subs_half:], :], axis=1)
            for dim in range(3):
                if measure == "correlation":
                    stat = np.corrcoef(vec1[:,dim], vec0[:,dim])[0][1]
                else:
                    stat = 1 - scipy.spatial.distance.cosine(vec1[:, dim], vec0[:, dim]) #np.corrcoef(vec1[:,dim], vec0[:,dim])[0][1]
                split_halfs_by_n[i0, i, dim] = stat
                split_halfs_by_n_sb[i0, i, dim] = (2*stat) / (1+stat)

    fig = plt.figure(figsize=(12,12))
    cs = ["r", "g", "b"]
    dim = ["x", "y", "z"]
    n_split_halfs = len(np.mean(split_halfs_by_n, axis=1))
    for i in range(3):
        #plt.plot(np.mean(split_halfs_by_n, axis=1)[:, i], lw=1, c=cs[i], ls="--", label=dim[i])
        plt.plot(np.mean(split_halfs_by_n_sb, axis=1)[:, i], lw=3, c=cs[i], label=dim[i])

    plt.xticks(range(len(subs_per_split)), [x * 2 for x in subs_per_split])

    handles, labels = plt.gca().get_legend_handles_labels()
    by_label = dict(zip(labels, handles))
    plt.xlabel("# Participants")
    plt.ylabel("Split Half Reliability")
    plt.legend(by_label.values(), by_label.keys())
    plt.title("Spearman Brown Corrected Split Half")
    plt.suptitle(title, y=0.95)
    plt.show()

    return split_halfs_by_n, split_halfs_by_n_sb


def unit_vector(vector):
    """ Returns the unit vector of the vector.  """
    return vector / np.linalg.norm(vector)

def angular_dist(v1, v2, use_degrees=True):
    """ Returns the angle in radians between vectors 'v1' and 'v2':
    """
    v1_u = unit_vector(v1)
    v2_u = unit_vector(v2)
    radians = np.arccos(np.clip(np.dot(v1_u, v2_u), -1.0, 1.0))
    degrees = np.degrees(radians)
    if not use_degrees:
        return radians
    else:
        return degrees
    
def plot_average_response_angular_error(df, title, errorbar=("ci", 95)):
    avg_response_error = []
    avg_responses = []
    true_directions = []
    probe_ids = []
    batch_key = [x for x in df.columns if "batch" in x][0]
    for (url, batch), trials in df.groupby(["imageURL", batch_key]):
        avg_response = np.array(trials["indicatorFinalDirection"].tolist()).mean(axis=0)
        avg_responses.append(avg_response)
        true_direction = trials["trueArrowDirection"].iloc[0]
        true_directions.append(true_direction)
        error = angular_dist(avg_response, true_direction)
        avg_response_error.append(error)
        probe_id = (url + "_" + str(batch))
        probe_ids.append(probe_id)
        
    fig, axs = plt.subplots(1, 2, figsize=(16, 8))
    tmp_df = pd.DataFrame({"averaged_response_error": avg_response_error, 
                           "true_direction": true_directions,
                           "averaged_response": avg_responses, 
                           "probeID": probe_ids})
    
    ordering = tmp_df.groupby("probeID")["averaged_response_error"].mean().sort_values()
    
    sns.barplot(y="averaged_response_error", x="probeID", order=ordering.keys(),
                 errorbar=errorbar, data=tmp_df, ax=axs[0], lw=0.)
    
    sns.boxplot(data=avg_response_error, ax=axs[1])
    # axs[0].barplot(accuracy_by_target)
    # axs[1].boxplot(accuracy_by_target)
    
    axs[0].set_xticks([], [])
    axs[0].set_ylabel("Averaged Response - Angular Error", fontsize=18)
    axs[0].set_xlabel(f"Probe Location")
    axs[1].set_xticks([], [])
    axs[1].set_xlabel("Mean Angular Error")
    axs[0].set_ylim(0, 180)
    axs[1].set_ylim(0, 180)
    plt.suptitle(title, fontsize=24)
    return fig, np.array(avg_response_error).mean()

def plot_mean_angular_error(df, title, target_key, errorbar=("ci", 95)):
    df["angular_error"] = df.apply(lambda x: angular_dist(x["indicatorFinalDirection"], x["trueArrowDirection"]), axis=1)
    accuracy_by_target = df.groupby(target_key)["angular_error"].mean().sort_values()
    
    fig, axs = plt.subplots(1, 2, figsize=(16, 8))
    sns.barplot(y="angular_error", x=target_key, order=accuracy_by_target.keys(), errorbar=errorbar, data=df, ax=axs[0])
    sns.boxplot(data=accuracy_by_target, ax=axs[1])
    # axs[0].barplot(accuracy_by_target)
    # axs[1].boxplot(accuracy_by_target)
    
    axs[0].set_xticks([], [])
    axs[0].set_ylabel("Mean Angular Error", fontsize=18)
    axs[0].set_xlabel(f"{target_key}")
    axs[1].set_xticks([], [])
    axs[1].set_xlabel("Mean Angular Error")
    axs[0].set_ylim(0, 180)
    axs[1].set_ylim(0, 180)
    plt.suptitle(title, fontsize=24)
    return fig, accuracy_by_target.mean()

    
def plot_mean_angular_agreement(df, title):
    """
    Computes a Leave One Out mean angular agreement by getting angular error between 
    """
    get_batch_key = lambda x: [k for k in x if "batch" in k][0]
    batch_key = get_batch_key(df.columns)
    batch_idxs = np.sort(df[batch_key].unique())

    mean_angular_agreement = []
    for batch in tqdm(batch_idxs):
        batch_angular_agreement = []

        batch_df = df[df[batch_key] == batch]
        for stimulus, trials in batch_df.groupby("imageURL"):
            users = trials["userID"].unique()
            n_users = len(users)

            trial_loo_angular_agreement = [] # Leave one out angular distance
            # Compute leave-one-out angular agreement between every participant for a given point
            for i in range(n_users - 1): 
                u1 = users[i]
                u1_angular_agreement = []
                u1_resp = trials[trials["userID"] == u1]["indicatorFinalDirection"].values[:][0]

                for j in range(i + 1, n_users):
                    u2 = users[j]
                    u2_resp = trials[trials["userID"] == u2]["indicatorFinalDirection"].values[:][0]
                    ang_agreement = angular_dist(u1_resp, u2_resp)
                    u1_angular_agreement.append(ang_agreement)
                
                mean_user_agreement = np.mean(u1_angular_agreement)
                if mean_user_agreement == np.nan:
                    print("NaNs in the walls msss")
                trial_loo_angular_agreement.append(mean_user_agreement)
            
            if sum(trial_loo_angular_agreement) > 0:   # ignore nans?
                trial_mean_agreement = np.mean(trial_loo_angular_agreement)
                batch_angular_agreement.append(trial_mean_agreement)
        
        batch_mean_angular_agreement = np.mean(batch_angular_agreement)
        mean_angular_agreement.append(batch_mean_angular_agreement)
    
    fig, axs = plt.subplots(1, 2, figsize=(12,8))
    axs[0].bar(x=range(len(mean_angular_agreement)), height=mean_angular_agreement)
    axs[1].boxplot(mean_angular_agreement)
    axs[0].set_ylabel("Mean Angular Agreement (LOO)")
    axs[0].set_xlabel("Batch")
    axs[1].set_xlabel("Mean Angular Agreement")
    plt.suptitle(title)
    return fig

def plot_split_half(df, target_key, title, measure="correlation"):
    # Find batch with greatest number of participants
    get_batch_key = lambda x: [k for k in x if "batch" in k][0]
    batch_key = get_batch_key(df.columns)
    batch_counts = df[batch_key].value_counts()
    batches = list(batch_counts.keys())
    max_batch = batches[batch_counts.argmax()]
    batch_df = df.loc[df[batch_key] == max_batch]
    
    # Build data table
    trials = [np.array(x[1].values[:]) for x in batch_df.groupby("imageURL")[target_key]]
    data = []
    min_subs_per_point = np.min([len(x) for x in trials])
    print("Minimum people per trial:", min_subs_per_point)
    if min_subs_per_point < 7:
        print("Not enough people to check split half.")
        return
    
    for x in trials:
        data.append([])
        for y in range(min_subs_per_point):
            data[-1].append(x[y])
    data = np.array(data)
    print(f"{data.shape} trials to choose from")

    # Take 1000 random splits of participants
    splits = 1000
    split_halfs = np.ndarray((splits, 1))
    n_subs_half = min_subs_per_point // 2

    subs_per_split = np.arange(2,(min_subs_per_point // 2) + 1, 1)
    print("Subs per split", subs_per_split)

    split_halfs_by_n_sb = np.ndarray((len(subs_per_split), splits))
    for i0, n_subs_half in enumerate(subs_per_split):
        for i in range(splits):
            inds = np.random.choice(range(min_subs_per_point), int(n_subs_half*2), replace=False)
            vec0 = np.mean(data[:,inds[:n_subs_half]], axis=1)
            vec1 = np.mean(data[:, inds[n_subs_half:]], axis=1)
            if measure == "correlation":
                stat = np.corrcoef(vec1[:], vec0[:])[0][1]
            else:
                stat = 1 - scipy.spatial.distance.cosine(vec1[:], vec0[:]) #np.corrcoef(vec1[:], vec0[:])[0][1]
            split_halfs_by_n_sb[i0, i] = (2*stat) / (1+stat)

    fig = plt.figure(figsize=(12,12))

    n_split_halfs = len(np.mean(split_halfs_by_n_sb, axis=1))
    plt.plot(np.mean(split_halfs_by_n_sb, axis=1)[:], lw=3)

    plt.xticks(range(len(subs_per_split)), [x * 2 for x in subs_per_split])

    handles, labels = plt.gca().get_legend_handles_labels()
    by_label = dict(zip(labels, handles))
    plt.ylim(0, 1)
    plt.xlabel("# Participants")
    plt.ylabel("Split Half Reliability")
    plt.legend(by_label.values(), by_label.keys())
    plt.title("Spearman Brown Corrected Split Half")
    plt.suptitle(title, y=0.95)
    plt.show()

    return split_halfs_by_n_sb

def plot_user_consistency():
    pass

