

## Problem Formulation

- **State**
- **Init. State**
- **Goal State**
- **Goal test**
- **Set of actions**
- **Constraints**
- **Cost**



## Table of Uninformed Local Search Algorithms

- only has info. about the likely direction of the global nodes
- only has info. provided by the problem formulation
- https://www.javatpoint.com/ai-uninformed-search-algorithms

| Type                           | Complete                                                     | Optimal                                                      | Time Complexity           | Space Complexity            | Note                                                         | Pros                                                     | Cons                                                         |
| :----------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------- | :-------------------------- | ------------------------------------------------------------ | -------------------------------------------------------- | ------------------------------------------------------------ |
| Breadth<br />First<br />Search | **Yes**, if b is finite                                      | **Yes, if (path cost == depth)**                             | $O(b^{d+1})$              | $O(b^{d+1})$                | - FIFO queue                                                 | - Guaranteed to return the **shallowest goal** (depth d) | - take long time and memory to find final solution with a large # of steps |
| Bidirectional Search           | Yes                                                          | **Yes**                                                      | $O(b^d)$                  | $O(b^d)$                    | - Search start from initial and goal state simultaneously, <br />- Bi-BFS |                                                          |                                                              |
| Uniform <br />Cost<br />Search | **Yes**                                                      | Yes                                                          | $O(b^{[C^*/\epsilon]+1})$ | $O(b^{[C^*/\epsilon]+1})$   | - BCS, expanding lowest cost node first<br />Ex: **Dijkstra's single-shortest-path algo<br />**- Depth explored before action $C^*/\epsilon$<br />- $\epsilon$: min cost of all other branches<br />- Depth of the fringe nodes: $C^*/\epsilon + 1$ |                                                          | - $\geq O(b^{d+1})$, under equal step<br />- It does not care about the number of steps involve in searching and only concerned about path cost. Due to which this algorithm may be stuck in an infinite loop. |
| Depth<br />First<br />Search   | No, fails in $\infin$ depth space <br />**Yes**, if m (depth) is finite | No                                                           | $O(b^m)$                  | $O(b*m)$ <br />Linear space | - LIFO queue / stack<br />- Does not keep all nodes on the open list, ony retains the children of a single state<br /> - b: max branching factor<br />- m: max depth of any node | Memory Efficient                                         | - Incompleteness<br />- May not be optimal if there are multiple solution |
| DFS<br />Limited               |                                                              |                                                              | -                         | -                           | - DFS, but with depth limited                                |                                                          |                                                              |
| DFS Iterative Deepening        |                                                              | **Yes**, if path cost is a non-decreaasing function of the depth of the node | -                         | -                           | - DFS, but with incremental depth limiter                    |                                                          |                                                              |



## Table of Informed Local Search Algorithms

- Use info. about the domain to head in the general direction of the goal nodes
- "Heuristic Search"
  - h(n): estimated cost of the cheapest path from node 'n' => goal node
  - specifically in **algorithms** related to pathfinding, a heuristic function is said to be **admissible**,
    - if it **never overestimates the cost of reaching the goal**, i.e. the cost it estimates to reach the goal is not higher than the lowest possible cost from the current point in the path
- https://www.javatpoint.com/ai-informed-search-algorithms

| Type                                      | Complete                                                     | Optimal | Time Complexity                                              | Space Complexity                         | Note                                                         | Pros                                        | Cons                                                         |
| :---------------------------------------- | ------------------------------------------------------------ | ------- | ------------------------------------------------------------ | :--------------------------------------- | ------------------------------------------------------------ | ------------------------------------------- | ------------------------------------------------------------ |
| Best <br />First<br />Search              |                                                              |         |                                                              |                                          | - Tree-search or Graph-search, in which a node is selected for expansion based on the evaluation function f(n)<br />- **Priority Queue** : in ascending f(n) <br />- The best node is expanded first based of f(n) |                                             |                                                              |
| Greedy Search                             | NO, can stuck in loop                                        | NO      | $O(b^m),$ <br />good h(n) -> better and dramatic improvements | $O(b^n)$,<br />keeps all nodes in memory | Best First Search when f(n) = h(n)                           |                                             |                                                              |
| Beam<br />Search <br />(Informed BFS)     | NO                                                           | NO      | $O(\beta b)$                                                 | $O(\beta b)$                             | - Minimize the memory requirement of the Breadth First Algorithm<br />- Informed **Breadth First Search**<br />- Expands only the 1st $\beta$ promising nodes at each level<br />- $\beta$ : Beam Width<br />- Max size of the nodes list is $\beta$<br /> | More space efficient than **Greedy Search** | May throw away a node that is on a solution path             |
| A                                         | No, if h(n) can be $\infin$                                  |         |                                                              |                                          | - f(n) = g(n) + h(n)<br />- Add "Breadth First Search" component<br />- Perfect Heuristic if $h(n) == h^{\star} (n)$ <br />       - => only nodes in correct path expanded<br />       - => optimal solution<br />- Null Heuristic if $h(n) = 0$<br />       - => X NOT optimal solution<br />- Better Heuristic  if $h(n) < h^{\star} (n)$ <br />       - => additional nodes expanded<br />       - => optimal solution<br />- Worst Heuristic if $h(n) > h^{\star} (n)$ <br />       - => optimal solution can be overlooked<br /> |                                             |                                                              |
| A*                                        | YES, if branch factor is finite, and every operator has a fixed +ve cost | YES     |                                                              |                                          | - f(n) = g(n) + h(n)<br />- A with constraint that $h(n) \leq h^{\star} (n)$, admissible, never overestimate the cost to reach the goal <br />- $h^{\star}$ = true cost of the minimal cost path from 'n' => goal<br />- 1st solution is always optimal, admissible | Find optimal solution                       |                                                              |
| Hill Climbing Search <br />(Informed DFS) | No                                                           | No      |                                                              |                                          | - Informed **Depth First Search**<br />- iterative algorithm start with an arbitrary solution to a problem, and attempt to find a better solution<br />- sorts successors of a node based of h(n)<br />- Apply to "travelling sales man"<br />- Variations: Stochastic HC, First-Choice HC, Random-restart HC | Improve **Depth-First-Search**<br />        | - **can fall into local maxia** or **minima**, when trying to find global solution |



## Game Playing as Search

1. Problem Formulation
2. Search Objective
   1. Find the sequence of player's decisions => maximize its utility
   2. Consider opponent's move & their utility
3. Types:
   1. Perfect Information
      1. Deterministic: Chess , Checkers
      2. Chance: Backgammon, Monopoly
   2. Imperfect Information
      1. Chances: Poker, Bridge

### MIN/MAX Search

- Assumption:
  - both players play optimally
  - MAX (player) vs. MIN (opponent) relative to player view
- Algo:
  1. Gen game tree based on **Limited Depth First Search** to 'm' ply depth
  2. Appy **utility / evaluation function** to each terminate state to get its value
  3. **Propagate** from Bottom Up, determine the higher level nodes => From root node, selet the move which leads to highest values
     1. MAX lvl => choose max values
     2. MIN lvl => choose min values
- Limited Depth => to reduce too much branching, to make it feasible to compute
- Evaluation Function:
  -  num possible wins not blocked by opponent - num possible wins for opponent not blocked by current player

#### $\alpha - \beta$ Pruning

- alpha cut-off: min pos $\leq$ alpha-val of its parent => stop
- beta cut-off: max $\geq$ beta-val of its parent => stop generating
- Alpha : best val for MAX seen so far
- Beta: best val for MIN so far
- http://homepage.ufp.pt/jtorres/ensino/ia/alfabeta.html



## Meta Heuristic Search

- Property:
  - mimics physical annealing process
  - **Neighborhood Search Approach** : iteratively to find best solution
  - T:
    - Low: restrict exploration
    - High: explore parameter space
    - Decrease: probability of acceptance to a worse state decreases
- **Acceptance Probability: (Heuristic Function)**
  - 1, if $\Delta E \leq 0$                                => always accept better solution
  - $P(\Delta E)=e^{\frac{- \Delta E}{k * t}}$ , if $\Delta E > 0$    => acccept worse solution with a probability
- k is the Boltzmann Const., k is ignored in this case





## Tabu Search

- Property:

  - Memory-based strategy
  - ==a combination of **Local Search + Memory Structure**==

- Recall:

  - Local Search:

    ```pseudocode
    s = init. feasible solution
    while termination_criterion not met:
     	s* = Neighbor(s) # local modifications
      if s* > s:# it is better
        s = s*
    END
    ```

- Strategy:

  - Key Concepts:

    1. Memory:

       - Tabu incorporates two type of memory: long term memory and short term memory. Short term memory stores more recent moves and long term memory keeps all the related moves.

         Short-­‐term: The list of solutions recently considered. If a potential solution appears on this list, it cannot be revisited until it reaches an expiration point. Long-­‐term: Rules that promote diversity in the search process (i.e. regarding resets when the search becomes stuck in a plateau or a suboptimal dead-­end).

       1. Tabu List
          + **STM** based on **Recency** of Occurrence
            + to **prevent** **revisiting** previously visited solutions
              + == prevent reverse move
            + Keep track of good components, to **intensify** the search
              + Intensification: exploting a **small portion** of the search space
                + or penalizing solutions that are **far from current solution**
       2. Tabu Tenure
          - **LTM** based on **Frequency** of Occurence
            - ==The length of time t for which a move is forbidden==
              - t too small - risk of cycling
              - t too large - may restrict the search too much
              - Rule of thumb:  $t = \sqrt{n}$
            - of solution components from the start of the iterations
            - to **diversify** the search
              - Diversification: refers to **forcing** the search into previously **unexplored** areas of the search space,
                - or penalizing solution that are **close to current**
              - Approaches:
                - Restart Diversification: forces to restart the search from rarely appear in current solution
                - Continuous Diversification: bias the evaluation of possible moves by adding to the objective function a term related to component frequency
            - explore unvisited areas **by avoiding frequently** visited components
          - Approaches:
            - Static: choose T to be a const. or as a guideline $\sqrt{n}$
            - Dynamic: choose T to vary randomly between $T_{min}$ and $T_{max}$
            - *: Can make threshold $T_{min}$ and $T_{max}$ vary for attributes
          - Limitations:
            - Fixed Length Tabu Lists, cannot always prevent cycling
            - There could exist some cycles with lengths longer than the tabu tenure

    2. Move
       - Toggle var btwn 0 and 1
       - swap nodes in a routing tour
       - Insert/delete edge in graph
       - Interchange variables

    3. Solution - Init, Current, Best

    4. Neighborhood
       - N(s)
       - when selecting a new state, we consider the neighbors that are **not in STM (Tabu List)**

    5. Termination Condition
       - No feasible solution in neighborhood of current solution
       - reached maximum num of iterations allowed
       - exceed num of iterations since the best improvements 
       - Evidence shows it is the Optimum Solution

    6. Candidate List
       - Help to address some of search space issue
       - used to reduce num of iterations examined on a given iterations
       - isolate regions of the neighborhood containing moves with desirable features

    7. Aspiration List
       - sometimes, it's useful to allow a certain move even if it's in tabu => to prevent **Stagnation**
       - Approaches used to cancel the Tabus are referred **Aspiration Criteria**
         - A tabu move => admissible,
           - By Default:
             - if it yields a solution that is better than any obtained solution so far
           - By Objective:
             - if it yields a solution that is better than an aspiration value
           - By Search Direction
             - if the direction of the search (improving or non-improving) does not changes
         - Tabus may sometimes be too powerful: they may prohibit attractive moves, even when there is no danger of cycling, or they may lead to an overall stagnation of the searching process. It may, therefore, become necessary to revoke tabus at times. The criterion used for this to happen in the present problem of TSP is to allow a move, even if it is tabu, if it results in a solution with an objective value better than that of the current best-­‐known solution.

  - Algo.:

    - ``` pseudocode
      s = init. feasible solution
      while termination_criterion not met:
       	s* = Neighbor(s) - Tabu(s) + Aspiration(s)
        if s* > s:# it is better
          s = s*
        update(T(s), A(s))
      END
      ```

  - 

