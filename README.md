# Explain GNN Prediction on Molecular Data

[[_TOC_]]

## Team Members
1. Kenza Amara
2. Steffen Backmann
3. Petros Polydorou
4. Rushan Wang

## Project Description 
Construct an interactive tool where users can get familiar and play with explainability methods on GNN models for graph or node classification. Moreover, multiple explanations could be provided for a single instance to observe how the scores vary. 

### Users
1. Domain experts in Medicine\Biology
2. Decision makers
3. ML developers and ML experts


### Datasets
MUTAG (https://nrvis.com/download/data/labeled/Mutag.zip)

### Tasks
1. Users can specify their need for the explanations.
2. Users can select the molecule they want to explain.
3. Display the loss accuracy, balance accuracy, and F1 score for the GNN model.
4. Users can choose the explainability method based on the score ranking of all the methods.
5. Display the Fidelity+ score and Fidelity- score of the explainability method (summary score and input score).
6. Users can interact with the explanation, e.g., add and remove edges.


- - -
## Folder Structure
Specify here the structure of you code and comment what the most important files contain

``` bash
├── README.md  
├── backend-project
│   ├── README.md
│   ├── setup.py   # main app
│   ├── pyproject.toml
│   ├── src
│   │   ├── dummy_server
│   │   │     ├── router
│   │   │     │    ├── routes.py
│   │   │     │    ├── app.py
│   │   │     │    └── __init__.py
│   │   │     └── resources
│   │   │         ├── scatter_data.py
│   │   │         └── __init__.py
│   │   └── __init__.py 
│   ├── data
│   │   ├── dataset_blobs.csv
│   │   ├── dataset_circles.csv
│   │   ├── dataset_moons.csv
│   │   └── generate_data.py    # script to create data
│   └── MANIFEST.in
├── react-frontend
│   ├── README.md
│   ├── package-lock.json
│   ├── package.json
│   ├── src
│   │   ├── App.css
│   │   ├── App.test.tsx
│   │   ├── App.tsx
│   │   ├── Visualization.tsx
│   │   ├── router
│   │   │   ├── resources
│   │   │   │   └── data.ts
│   │   │   └── apiClient.ts
│   │   ├── components
│   │   │   ├── utils.ts
│   │   │   ├── ScatterPlot.tsx
│   │   │   ├── DataChoice.tsx
│   │   │   └── ScatterPlot.css
│   │   ├── index.css
│   │   ├── index.tsx
│   │   ├── logo.svg
│   │   ├── react-app-env.d.ts
│   │   ├── reportWebVitals.ts
│   │   ├── setupTests.ts
│   │   └── types
│   │       ├── margin.ts
│   │       └── data.ts
│   ├── tsconfig.json
│   └── public
│        ├── robot.txt
│        ├── manifest.json
│        ├── logo512.png
│        ├── logo192.png
│        ├── index.html
│        └── favicon.ico
└── Dockerfile
```

## Requirements
Write here all instructions to build the environment and run your code.\
**NOTE:** If we cannot run your code following these requirements we will not be able to evaluate it.

## How to Run
Write here **DETAILED** intructions on how to run your code.\
**NOTE:** If we cannot run your code following these instructions we will not be able to evaluate it.

As an example here are the instructions to run the Dummy Project:
To run the dummy project you have to:
- clone the repository;
- open a new terminal instance;
- move to the folder where the project has been downloaded using the command ```cd```;
- open the folder called "dummy-fullstack-main";
To run the backend
- open the backend folder called "backend-project";
- create a virtual environment using the command ```conda create -n nameOfTheEnvironment```;
- activate the virtual environment run the command ```conda activate nameOfTheEnvironment```;
- install the requirements from the txt file using the command ```pip3 install -r requirements.txt```;
- start the backend with the command ```python3 setup.py run```;
To run the frontend
- open a new terminal instance and once again go to the folder called "dummy-fullstack-main"
- open the frontend folder called "react-frontend";
- start the front end by using the following two commands ```npm install```, ```npm start```;
If all the steps have been successfully executed a new browser window will open automatically.

## Milestones
Document here the major milestones of your code and future planned steps.\
- [x] Week 1
  - [x] Familiarization with the GitLab repository
  - [x] Added new backend endpoint for the future Overview of the application: [#0e77e896](https://gitlab.inf.ethz.ch/course-xai-iml23/b2-gnn-explainer/-/commit/0e77e896b66e4f9176b28d1646ae0ca410daddb3)

- [ ] Week 2
  - [ ] Sub-task: [#2](https://gitlab.inf.ethz.ch/COURSE-XAI-IML22/dummy-fullstack/-/issues/2)
  - [ ] Sub-task: ...

Create a list subtask.\
Open an issue for each subtask. Once you create a subtask, link the corresponding issue.\
Create a merge request (with corresponding branch) from each issue.\
Finally accept the merge request once issue is resolved. Once you complete a task, link the corresponding merge commit.\
Take a look at [Issues and Branches](https://www.youtube.com/watch?v=DSuSBuVYpys) for more details. 

This will help you have a clearer overview of what you are currently doing, track your progress and organise your work among yourselves. Moreover it gives us more insights on your progress.  

## Weekly Summary 
Write here a short summary with weekly progress, including challanges and open questions.\
We will use this to understand what your struggles and where did the weekly effort go to.

## Versioning
Create stable versions of your code each week by using gitlab tags.\
Take a look at [Gitlab Tags](https://docs.gitlab.com/ee/topics/git/tags.html) for more details. 

Then list here the weekly tags. \
We will evaluate your code every week, based on the corresponding version.

Tags:
- Week 1: [Week 1 Tag](https://gitlab.inf.ethz.ch/COURSE-XAI-IML22/dummy-fullstack/-/tags/stable-readme)
- Week 2: ..
- Week 3: ..
- ...


