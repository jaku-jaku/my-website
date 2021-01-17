<img src="Resources/Blog_imgs/457A_Final_Review_assets/4.png" alt="4" style="zoom:80%;" />

[TOC]

















---

# Week 8 - ACO (Ant Colony Optimization)

## ACO - Simulation

- To simulate the behaviour of ants: 

  - assume we have a nest and a food source connected through two paths with different lengths.

  - ```mermaid
    graph LR
    
    N-->|p1, len1 = 1| S
    S-->|p2, len2 = 2|N
    
    ```

- Assign initial artificial pheromone values for every path, $\tau_1$ and $\tau_2$ ,

  - Initially, both values are equal: $\tau_1 = \tau_2 = c > 0$

- Place $m$ ants at the nest,

  - For each ant $k$,
    - Traverses path 1 with a probability: $p_1 = \frac{\tau_1}{\tau_1 + \tau_2}$
    - Traverses path 2 with a probability: $p_2 = 1 - p_1$

- An evaporation phase is applied:

  - To simulate the evaporation of real pheromone
  - To avoid quick convergence to sub-optimal paths

  - $\tau_i = (1-\rho) \times \tau_i, \; \rho \in (0,1)$
    - $\rho$  specifies the rate of evaporation
      - $\rho == 1 \Rightarrow$  move becomes random
  - Each ant leaves **more pheromone** on its traversed path
    - $\tau_i = \tau_i + \frac{1}{len_i}$

### Real AC vs. Artificial AC

| Real                               | Artificial                                  |
| ---------------------------------- | ------------------------------------------- |
| Rea ant and pheromone              | Artificial ant (agent) and pheromone(value) |
| Food                               | Solution                                    |
| Continuous                         | Discrete                                    |
| pheromone update while moving      | pheromone update after traverse             |
| Solutions are evaluated implicitly | Explicit function to evaluate solutions     |

## ACO-Algorithm

### **Scene Setup / IC:**

- Let $G=(N,E)$ denote a graph, where:

  - $N$ is the set of nodes (vertices) 
  - $E$ is the set of arcs (edges)

- Each arc $(i,j)$ is associated:

  - with a value $d_{ij}$ denoting the ***distance*** between nodes $i$ and $j$
    - => A simple ant algorithm could be used to **find** the **shortest path** between two given nodes in the graph
  - with a value $\tau_{ij}$ denoting the ***artificial pheromone***
    - At the beginning, the **small amount** of $\tau_{ij}$ is placed on all arcs

- Place a group of $m$ ants at the source node

  ![img 1](Resources/Blog_imgs/457A_Final_Review_assets/1.png)

### **Ant Actions:**

- At each node $i$, the ant has:

  - a choice to move to any of the $j$ nodes connected to it

- Each node $j \in N_i$ connected to $i$ has:

  - a probability to be selected by ant $K^i$:

    - $p_{ij}^k = \begin{cases} \frac{\tau_{ij}^{\alpha}/d_{ij}^{\beta}}{\sum_{n\in N_i}{\tau_{ij}^{\alpha}/d_{ij}^{\beta}}} & \text{if} \quad j \in N_i \\ 0 & \text{if} \quad j \notin N_i\end{cases}$
- 

### **Pheromone Update** ($\alpha$ and $\beta$)

- $\alpha$ and $\beta$ are chosen to balance the ***local*** vs. ***global*** search ability of the ant
- **Evaporate** the artificial pheromone:
  - $\tau_i = (1-\rho) \times \tau_i, \quad \rho \in (0,1]$
- The ant deposits extra phermonone on the arc it chooses:
  - $\tau_{ij} = \tau_{ij} + \Delta \tau$

#### ACO -- ***online step-by-step*** pheromone update:

- This will increase the probability of a subsequent ant choosing the same arc
- release pheromone while building their solutions.
- Choose value of $\Delta \tau$:
  - **Ant Density Model**, + $\Delta \tau = Q$
    - const. value
    - => hence the final pheromone added to the edg will be proportional to the number of ants choosing it
    - <span style="color:red"> This does not take the edge length into account </span>
  - **Ant Quantity Model**,  $\Delta \tau_{ij} = Q/d_{ij}$
    - taking the edge length into account,
    - => hence enforcing the ant local search ability

#### AS (Ant System) Algo. -- ***online delayed*** pheromone update ("***ant cycle model***") 

- After the ant builds the solution, 

  - it traces the path backward 
  - and updates the pheromone trails on the visited arcs according to the solution quality

- This variant performs better, referred as **AS (Ant System) Algorithm**

  - use same basic steps outlined in [ACO Metaheuristic Problems](###ACO Metaheuristic Problems:)
  - adopt "online delayed pheromone update" (BELOW)

- Pheromone update is done by adding (done **after the evaporation phase**:

  - $\Delta \tau_{ij} = \frac{Q}{L^k}$ 
  - for every arc $(i,j)$ on the path
  - $L^k$ Is the length of the path found by **ant** $k$
  - Repeat the process for different initialization of pheromone

  <img src="Resources/Blog_imgs/457A_Final_Review_assets/2.png" alt="2" style="zoom:80%;" />

![img 3](Resources/Blog_imgs/457A_Final_Review_assets/3.png)

### ACO Metaheuristic Problems:

#### Algorithm Pseudo: Ant colony optimization metaheuristic 

- ```pseudocode
  Set parameters, initialize pheromone trails 
  while termination conditions not met do
  	ConstructAntSolutions
  	ApplyLocalSearch (optional) 
  	UpdatePheromones 
  end 
  ```

#### Termination Conditions:

- Max number of iterations reached 
- Acceptable solution reached
- All ants (or most of them) follow the same path, i.e stagnation.

#### Parameters

- Number of ants: more ants more computations, but also more exploration.
- Max number of iterations: has to be enough to allow convergence.
- Initial pheromone: constant, random, max value, small value.
- Pheromone decay parameter $\rho$

#### Components

- Transition rule: probability of selection for the ant
- Pheromone evaporation rule
- Pheromone update rule
- Problem heuristic if used
- Quality of solution measure
- Memory or list for constraints (Tabu list)
- Termination Criteria

### ACS (Ant Colony System Algorithm) : uses Elitist strategy

- Proposed by Gambardella and Dorigo [8], 
- Based on [AS Algo.](####***online delayed*** pheromone update ("***ant cycle model***") -- **AS (Ant System) Algorithm**) 
  - but uses a **different transition rule** based on **Elitist strategy** which is called **pseudo-random** proportional rule
- Establishes a trade-off between **exploration and exploitation**

#### ACS v1 : Bias $q0\rightarrow$  better quality

- If $q<q_0$:
  - $j = argmax_{j\in N^k_i}{\tau_{ij}(t) \eta_{ij}^{\beta}}$
  - $q$ is a random number
  - $q_0$ is a user-defined constant control parameter in $(0,1)$
  - $j$ is the next node to be selected

- Else:
  - $p^k_{ij}(t) = 
    \begin{cases}
    \frac{[\tau_{ij}(t)]^\alpha[\eta_{ij}]^{\beta}}{\sum_{k\in allowed_k}{[\tau_{ik}(t)]^{\alpha}[\eta_{ik}]^{\beta}}} & \text{if} \quad j \in \text{allowed}_k \\ 0 & \text{if} \quad \text{otherwise}
    \end{cases}$
  - ==This creates **bias** ($q_0$ ) towards choices of **better quality**==
  - q_0$ is a user specified parameter to control this bias

#### ACS v2: New Pheromone Update Rule (Best Only)

- Introduced a new pheromone update rule (using the best solution only).
- Uses the offline pheromone update, 
  - where only the globally best ant 
    - (i.e., the ant which constructed the shortest tour from the beginning of the trial) 
      - is allowed to deposit pheromone.
- ==Best here can be **iteration** best or **global** best==
- $ \tau_{ij} (t + 1) = (1 − \rho_1 )\tau_{ij} (t ) + \rho_1 \Delta \tau_{ij}^{best} (t )$
- An online step-by-step is performed after the global update of $\tau_{ij}$ . 
  - This way, no pheromone trail value can fall below $\tau_0$
  - (This also encourages ants for exploration why?)
    - $\tau_{ij}=(1-\rho_2)\tau_{ij} + \rho_2 \tau_0$

### MMAS (MAX-MIN Ant System Algorithm)

- Proposed by Stutzle and Hoos overcome stagnation.
- The update is done using 
  - the best solution (best ant) in the current iteration or the best solution over all, 
  - also **decay** in the update of the pheromone
- $\tau_{ij}(t+1) = (1-\rho) \tau_{ij}(t) + \rho \Delta \tau_{ij}^{best} (t)$
- **Findings:**
  - The values of the pheromone are restricted between $\tau_{min}$ and $\tau_{max}$, 
    - allows high explorationin the beginning ($\tau_{max}$) and more intensification later
  - The values of $\tau_{min}$ and $\tau_{max}$ are chosen experimentally, 
    - although they could be calculated analytically if the optimal solution is known
  - Improved the performance significantly over **AS**

---

# Week 9 - PSO (Practicle Swarm Optimization)

## Background

- The main idea is to simulate the collective behavior of social animals
- In particular, bird flocking and fish schooling behaviors
- Individuals have no knowledge of the global behavior of the group
- Ability to move together based on social interaction between neighbours

### Three Behaviors:

- first computer program written by Reynolds in 1986 to simulate swarms for computer graphics and movies:

| Separation                                                   | Alignment                                                    | Cohesion                                                     |
| ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| <img src="Resources/Blog_imgs/457A_Final_Review_assets/img 5.png" alt="5" style="zoom:80%;" /> | <img src="Resources/Blog_imgs/457A_Final_Review_assets/img 55.png" alt="55" style="zoom:80%;" /> | <img src="Resources/Blog_imgs/457A_Final_Review_assets/img 6.png" alt="6" style="zoom:80%;" /> |
| Each agent tries to move away from its nearby mates if they are too close | Each agent steers towards the average heading of its nearby mates | Each agent tries to go towards the average position of its nearby mates |
| **(Collision Avoidance)**                                    | **(Velocity Matching)**                                      | **(Centering or position control)**                          |

### Roost

- **Roost** is in the form of a memory of previous own best and neighborhood best positions (Cornfield)
- Best two positions serve as attractor
- By adjusting the positions of the flock proportion to the distance from the best positions, 
  - => they converge to the goal
- Kennedy & Eberhart in 1995

| Individuals are atttracted to the roost                      | Each memorizes the position in which it was closest to the roost | Each shares its information with all the others              |
| ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| <img src="Resources/Blog_imgs/457A_Final_Review_assets/img 9.png" alt="9" style="zoom:80%;" /> | <img src="Resources/Blog_imgs/457A_Final_Review_assets/img 8.png" alt="8" style="zoom:80%;" /> | <img src="Resources/Blog_imgs/457A_Final_Review_assets/img 7.png" alt="7" style="zoom:80%;" /> |

- At the end of simulation, all the individuals landed on roost
- => PSO 
  - a population based approach similar to GA and other EC approaches

### PSO vs. GA

|                | PSO                                                    | GA                               |
| -------------- | ------------------------------------------------------ | -------------------------------- |
| Whole Solution | Swarm                                                  | Population                       |
| A Solution     | Particle                                               | Individual                       |
|                | Fitness                                                | Fitness                          |
|                | Less fit **don't die**                                 | **Survival** of the fittest      |
|                | Uses **past experience and relationship to neighbors** | Uses **crossover and mutations** |



## PSO

### PSO - Intro.

- A stochastic optimization approach that manipulates a number of candidate solutions at once
- A solution is reffered to as a **particle**
  - the whole solution is referred to as a **swarm**
- Each particle holds **info. essential** for its movement [PSO - Motion](###PSO - Motion)

### PSO - Motion

- **Each particle holds:**
  - ==$x_i$==: currrent position [Equations of motion](####Motion Updates (Equations of motion):)
  - ==$v_i$==: current velocity [Equations of motion](####Motion Updates (Equations of motion):) & [Max Velocity](####Max Velocity)
  - ==$pbest_i$ ($p_i$)==: [**Personal Best**](#####Personal Best) -- best position it achieved so far
  - ==$Nbest_i$==: [**Neighbor Best**](#####Neighbor Best) -- Best position achieved by particles in its neighbourhood
    - If the neighbourhood is **the whole swarm**
      - => ==$gbest_i$ ($p_g$)== : **Global Best**
        - the best achieved by the whole swarm
    - If the neighbourhood is **restricted to few particles**
      - => ==$lbest$ ($p_l$)== : **Local Best**

- ==Each particle **adjusts its velocity**== 
  - to **move towards** its **personal best** and the swarm neighbourhood best
  - => after the velocity is updated, ==then the particle **adjusts its position**.==

#### Motion Updates (Equations of motion):

- $\begin{align} v^{id}_{t+1} &= w*v_t^{id} + c_1 r_1^{id} (pbest_t^{id} - x_t^{id}) + c_2 r_2^{id}(Nbest_t^{id} - x_t^{id}) \\ x_{t+1}^{id} &= x_t^{id} + v_{t+1}^{id} \end{align}$

- **Where:**

  - ==$w$== is the inertia weight
  - ==$c_1, c_2$== are the acceleration coefficients
  - ==$r_1, r_2$== are **randomly** generated numbers in $[0,1]$
    - ==Note:== 
      - random numbers are generated **for each dimension** and <span style="color:red">not for each particle</span>
        - ex: if the function you are optimizing has 3 variables, the particle will have 3 dimensions.
      - If the numbers are generated for each particle, the algorithm is referred to as ***linear PSO***
        - which usually produces sub-optimal solutions in comparision with PSO.
  - ==$t$== is the iteration number
  - ==$i$ and $d$== are the particle number and the dimension

- **Motion Components:**

  ​		$\begin{align} v^{id}_{t+1} =& w*v_t^{id}  & \rightarrow\text{Inertia} \\ & + c_1 r_1^{id} (pbest_t^{id} - x_t^{id}) & \rightarrow\text{Cognitive Component} \\ &+ c_2 r_2^{id}(Nbest_t^{id} - x_t^{id}) & \rightarrow\text{Social Component} \end{align}$

  1. The **inertia component**:

     - accomodates the fact that a bird (particle) cannot suddenly change its direction of movement

  2. The $c_1$ and $c_2$ factors:

     - balance the weights in which each particle:
       - Trusts its own experience, **cognitive component**
       - Trusts the swarm experience, **social components**

     - Effects: [PSO - Initialization](###PSO - Initialization)

  <img src="Resources/Blog_imgs/457A_Final_Review_assets/img 10.png" alt="img 10" style="zoom:80%;" />

#### Best Updates

##### Personal Best

- After that, each particle pdates its own personal best (for a minimization problem):

  $pbest_{t+1}^i = \begin{cases} x_{t+1}^i & ,\text{if } f(x^i_{t+1} \leq f(pbest_t^i)) \\ pbest_t^i &,\text{otherwise} \end{cases}$

##### Neighbor Best

- After that, each swarm updates its global best (assuming a minimization problem):

  $Nbest_{t+1}^i = \arg \min_{pbest_{t+1}^i \in N} f(pbest_{t+1}^i)$

#### Max Velocity

- An important factor to set is the max velocity allowed for the particles ($V_{max}$):
  - too high -> particles can fly past optimal solutions
  - too low -> particles can get stuck in local optima
- Usually set according to the domain of the search space

### PSO - Sync vs. Async Update Algorithms

|            | Synchronous Update                                           | ==Asynchronous Update== (Better)                             |
| ---------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| Pseudo     | <br />Init. swarm<br />While *Termination Criteria* not met:<br />.    For each particle:<br />.           Update particle velocity<br />.           Update particle position<br />.           Update particle **pBest**<br />.    end For<br />.    ==Update the **Nbest**<br />==end While | <br />Init. swarm<br />While *Termination Criteria* not met:<br />.    For each particle:<br />.           Update particle velocity<br />.           Update particle position<br />.           Update particle **pBest**<br />.           ==Update the **Nbest**<br />==.    end For<br />end While |
| Difference | If the neighbourhood best is updated <br />**after all the pop. has been updated as well** | If the neighbourhood best is updated <br />**after every particle** |
|            |                                                              | Usually Produces **better** results <br />as it causes the particles to use a **move up-to-date information** |

#### PSO - Termination Criteria

- Can be:
  - Max Number of Iterations
  - Max Number of Function Evaluations
  - Acceptable Solution has been found
  - No improvement over a number of iterations

#### PSO - Neighbourhoods

- In PSO, each particle **shares its personal best information** with **other particles**
- A proper neighborhood 
  - => affects the convergence 
  - => helps in avoiding getting stuck at local minima

##### Different Neighbourhoods Topologies

|                                                    | gbest model                                                  | lbest model                                                  |
| -------------------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| **Diagram:**                                       | <img src="Resources/Blog_imgs/457A_Final_Review_assets/11.png" alt="11" style="zoom:80%;" /> | <img src="Resources/Blog_imgs/457A_Final_Review_assets/12.png" alt="12" style="zoom:80%;" /> |
| **Def:**                                           | Each particle is influenced by all the other particles       | Each particle is influenced only by particles in its own neighbourhood |
| **Propagation of information<br />in population:** | **fastest**                                                  | **slowest**                                                  |
| **Local Minima**                                   | **Can get stuck easily**                                     | <span style="color:red">Does not get stuck easily </span><br />but might **increase the computational cost** |



- The most obvious way to select the neighbours for a certain particle $m$ is to choose the particles that are closest to it in the search space (physical neighbors)
- The notion of the closest is based on the distance in the Cartesian space
- This approach might be computationally expensive as distances has to be computed each time the particle changes its position
- ex: If the particles are kept in a matrix data structure
  - The most commonly  used approach is to picke the particles that are stored next to $m$ in the matrix (social neighbors)
  - The performance is affected by the size of the neighbourhood selected (2, 4, 6, ...).



- Most successful structure: **Square Topology**  (Von neumann Model)
  - Formed by arranging the particles in a grid and connecting the neighbours above, below and to the right and left
  - ![13](Resources/Blog_imgs/457A_Final_Review_assets/13.png)

### PSO - Initialization

- For each particle need to initialize the particle position and velocity
- Particles positions can be initialized randomly in the range
- Particles velocities can be initialized to zero or small values, large values will result in large updates which may lead to divergence
- Personal best position is initialized to the particle's initial position
- Parameters:
  - $w, c_1, c_2, r_1, r_2$
  - $\begin{align} v^{id}_{t+1} &= w*v_t^{id} + c_1 r_1^{id} (pbest_t^{id} - x_t^{id}) + c_2 r_2^{id}(Nbest_t^{id} - x_t^{id}) \end{align}$
  - using $c_1=0$ reduces the velocity model to **Social-only model** (particles are all attracted to **Nbest**)
  - using $c_2 = 0$ reduces to **cognition-only model** (particles are **independent hill climbers**)
  - In most applications, $c_1 = c_2$, 
    - small values will result in smooth trajectories
    - high values cause more acceleration with abrupt movement towards or past good regions
  - The value of $w$ is most important to balance the exploration and exploiration
    - Large values promote exploration
    - Small promote exploitation (allowing more control to Cog and Social components)



### PSO - Convergence

- wrong settings can cause the particles to explode out of the search space
- Deterministic PSO - randomness removed
  - random numbers replaced by their expected values
  - $r_1 = r_2 = 1/2$
  - => $\begin{align} v^{id}_{t+1} &= w*v_t^{id} + \frac{c_1}{2} (pbest_t^{id} - x_t^{id}) + \frac{c_2}{2}(Nbest_t^{id} - x_t^{id}) \end{align}$
- Let:
  - $c = \frac{c_1 + c_2}{2}$
  - $p = \frac{c_1}{c_1 + c_2} pbest + \frac{c_2}{c_1 + c_2} gbest$
- => $\begin{align} v_{t+1} &= w*v_t + c(p-x_t) \end{align}$
  - $x_{t+1}=x_t + v_{t+1}$
- Now:
  - $y_{t+1} = A y_t + Bp$
  - where $y_t = \begin{bmatrix} x_t \\ v_t \end{bmatrix}, A=\begin{bmatrix} 1-c & w \\ -c & w \end{bmatrix}, B= \begin{bmatrix} c \\ c \end{bmatrix}$
- Hence: with characteristic equation, we find conditions for stability:
  - $w < 1, \; c>0, \; 2*w -c +2 > 0$
  - The convergence domain would be inside the triangle shown
  - <img src="Resources/Blog_imgs/457A_Final_Review_assets/14.png" alt="14" style="zoom:50%;" />

### Compare to GA

<img src="Resources/Blog_imgs/457A_Final_Review_assets/15.png" alt="15" style="zoom:50%;" />



## Discrete PSO

### Binary PSO

- Each particle represents a position in the binary space
- Each element can take the value of 0 or 1
- Velocities re defined as probabilities that one element will be in one state or the other
  - restricted in range $[0,1]$
  - sigmoid function:
    - $sig(V_t^{id})=\frac{1}{1+ e^{-V_t^{id}}}$
- Position update equation:
  - $x^{id}_{t+1} = \begin{cases} 1 &, \text{if } r < sig(v_{t+1}^id) \\ 0 &, \text{otherwise}\end{cases}$
  - where $r$ is randomly generated number in [0,1]
  - => Meaning:
    - $prob(x_{t+1}^{id}=1)=\begin{cases} 0.5 &, v_{t+1}^{id}=0 \\ <0.5 &, v_{t+1}^{id} < 0 \\ >0.5 &, v_{t+1}^{id}>0\end{cases}$
    - Note that the velocity components could remain as real-valued numbers using the original equation,
      - but fed to the sigmoid function before updating the position vector
- Objective:
  - optimize different functions that were generated using a random function generator
  - => allows the creation of random binary problems, with specified characteristics:
    - Number of local optima, bit strings
    - Dimension, no of components (bits)
    - Fitness function
      - $f(c) = \frac{1}{L} \max_{i=1}^{P} {L- Hamming(c, Peak_i)}$
    - In the study, 
      - the only algorithm found the local optimum on every single trial, regardless of problem features
        - comparing to GAs
      - BPSO progressed  faster than the other algorithms

### Permutation PSO

- Several attempts have been made to apply PSO to permutation problems
- The difficulty of extending PSO to such problems is that the notions of velocity and direction have no natural extensions for these problems
- Three operations were re-defined for the new search space:
  - Adding a velocity to a position:
    - the operation is performed by applying the sequence of swaps defined by the velocity to the position vector
    - <img src="Resources/Blog_imgs/457A_Final_Review_assets/16.png" alt="16" style="zoom:70%;" />
  - Subtracting 2 positions
    - produce a velocity
    - produce the sequenc of swaps that could transform one position to other
  - Multiplying a velocity by a constant
    - performed by changing the length of the velocity vector (number of swaps) according to the constant $c$:
      - If c = 0, the length is set to zero
      - If c < 1, the velocity is truncated
      - If c > 1, the velocity is augmented
    - <img src="Resources/Blog_imgs/457A_Final_Review_assets/18.png" alt="18" style="zoom:80%;" />
  - but can be computationally expensive for larger problems
    - due to handling of multiple solution
- To evaluate the **particle fitness**
  - they performed a **space transformation**
    - from a particle in the continuous domain to a permutation in the solution space
  - Rule: ***Great Value Priority (GVP)***
    - all the elements in the position vector (along with their indices) were sorted to get a sorted list in descending order
    - The sorted indices were taken as the permutation
- Idea:
  - if $x_i$ had the highest value in the position vector, it means that city number $i$ comes first in the permutation vector
  - This transformation was carried before calculating the particles fitness

---
