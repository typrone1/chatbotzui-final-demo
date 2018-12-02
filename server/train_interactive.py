from __future__ import absolute_import
from __future__ import division
from __future__ import print_function
from __future__ import unicode_literals

from rasa_core.agent import Agent
from rasa_core.channels.console import CmdlineInput
from rasa_core.interpreter import RegexInterpreter
from rasa_core.policies.keras_policy import KerasPolicy
from rasa_core.policies.memoization import MemoizationPolicy
from rasa_core.interpreter import RasaNLUInterpreter
from rasa_core.training import interactive
from rasa_core.utils import EndpointConfig


def train_agent(input_channel, nlu_interpreter,
                          domain_file="domain.yml",
                          training_data_file='./data/dialogue/stories.md'):

    #endpoints = "endpoints.yml"
    agent = Agent(domain_file,
                  policies=[MemoizationPolicy(max_history=2), KerasPolicy()],
                  interpreter=nlu_interpreter)
    data = agent.load_data(training_data_file)
    agent.train(data, input_channel=input_channel, batch_size=50, epochs=200, max_training_samples=300)
    agent = Agent.load('models/dialogue/default/dialogue_model', interpreter = nlu_interpreter, action_endpoint=EndpointConfig(url = "http://localhost:5055/webhook"))
    interactive.run_interactive_learning(agent, training_data_file)

    return agent


if __name__ == '__main__':
    nlu_interpreter = RasaNLUInterpreter('./models/nlu/default/nlu_model')
    train_agent(CmdlineInput(), nlu_interpreter)