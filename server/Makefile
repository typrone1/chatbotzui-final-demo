help:
	@echo "    train-core"
	@echo "        Train a dialogue model using Rasa core."
	@echo "    run-core"
	@echo "        Spin up the core server on the command line"
	@echo "    run-actions"
	@echo "        Spin up the action server"
	@echo "    run"
	@echo "        Spin up both core and the action server"
	@echo "    visualize"
	@echo "        Show your stories as a graph"


train-core:
	python3 -m rasa_core.train -s ./data/dialogue/stories.md -d domain.yml -o ./models/dialogue/default/dialogue_model -c ./default_config.yml --debug

run-actions:
	python3 -m rasa_core_sdk.endpoint --actions actions

train-interactive:
	python3 -m rasa_core.train interactive -s ./data/dialogue/stories.md -d domain.yml -o models/dialogue -c ./default_config.yml --debug --endpoints endpoints.yml

visualize:
	python3 -m rasa_core.visualize -s ./data/dialogue/stories.md -d domain.yml -o graph.html -c config.yml

train-nlu:
	python3 -m rasa_nlu.train -c config.yml --fixed_model_name current --data ./data/nlu -o ./models/nlu/default/nlu_model --project nlu --verbose