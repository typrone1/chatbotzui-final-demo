from rasa_core_sdk import Action
from rasa_core_sdk.events import SlotSet

class ActionSuggestLocation(Action):
   def name(self):
      # type: () -> Text
      return "action_suggest_location"

   def run(self, dispatcher, tracker, domain):
      return []