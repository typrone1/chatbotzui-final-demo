from rasa_core.agent import Agent
from rasa_core.policies.keras_policy import KerasPolicy
from rasa_core.policies.memoization import MemoizationPolicy

if __name__ == '__main__':
    agent = Agent("domain.yml",
                  policies=[MemoizationPolicy(), KerasPolicy()])

    agent.visualize("./data/dialogue/stories.md",
                    output_file="graph.jpg", max_history=2)