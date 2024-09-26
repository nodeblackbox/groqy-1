# Custom Agents in agentChef

Users can create custom agents to extend the functionality of the agentChef package. Here's how to define and use custom agents:

## Defining a Custom Agent

To create a custom agent, inherit from the `CustomAgentBase` class and implement the required methods:

```python
from agentChef.cutlery import CustomAgentBase
import pandas as pd

class MyCustomAgent(CustomAgentBase):
    def __init__(self, llm_manager, template_manager, file_handler, prompt_manager, document_loader):
        super().__init__(llm_manager, template_manager, file_handler, prompt_manager, document_loader)
        # Add any custom initialization here

    def process_data(self, data: Any) -> pd.DataFrame:
        # Implement your custom data processing logic here
        # This method should return a pandas DataFrame
        processed_data = ...  # Your processing logic
        return pd.DataFrame(processed_data)

    def scrape_data(self, source: str) -> Any:
        # Implement your custom data scraping logic here
        # This method can return data in any format that your process_data method can handle
        scraped_data = ...  # Your scraping logic
        return scraped_data

    # Optionally, add any custom methods you need
    def custom_method(self, ...):
        # Custom functionality
        pass

# The `run` method is inherited from CustomAgentBase and typically doesn't need to be overridden
```

## Example: Reddit Comment Scraper Agent

Here's an example of a custom agent that scrapes comments from a Reddit post:

```python
import praw
from agentChef.cutlery import CustomAgentBase
import pandas as pd

class RedditCommentAgent(CustomAgentBase):
    def __init__(self, llm_manager, template_manager, file_handler, prompt_manager, document_loader):
        super().__init__(llm_manager, template_manager, file_handler, prompt_manager, document_loader)
        self.reddit = praw.Reddit(client_id='YOUR_CLIENT_ID',
                                  client_secret='YOUR_CLIENT_SECRET',
                                  user_agent='YOUR_USER_AGENT')

    def scrape_data(self, source: str) -> List[Dict[str, str]]:
        submission = self.reddit.submission(url=source)
        submission.comments.replace_more(limit=None)
        comments = []
        for comment in submission.comments.list():
            comments.append({
                'author': str(comment.author),
                'body': comment.body,
                'score': comment.score
            })
        return comments

    def process_data(self, data: List[Dict[str, str]]) -> pd.DataFrame:
        df = pd.DataFrame(data)
        # Additional processing if needed
        return df

# Usage:
# reddit_agent = RedditCommentAgent(llm_manager, template_manager, file_handler, prompt_manager, document_loader)
# reddit_data = reddit_agent.run('https://www.reddit.com/r/AskReddit/comments/abcxyz/example_post/')
```

## Registering and Using Custom Agents

Once you've defined your custom agent, you can register and use it with the DatasetKitchen:

```python
from agentChef import DatasetKitchen
from my_custom_agents import RedditCommentAgent

# Initialize DatasetKitchen
config = {...}  # Your configuration
kitchen = DatasetKitchen(config)

# Register your custom agent
kitchen.register_custom_agent('reddit_scraper', RedditCommentAgent)

# Use your custom agent
reddit_agent = kitchen.get_agent('reddit_scraper')
reddit_data = reddit_agent.run('https://www.reddit.com/r/AskReddit/comments/abcxyz/example_post/')

# The resulting reddit_data will be a pandas DataFrame containing the scraped and processed Reddit comments
```

By following this pattern, you can create custom agents for various data sources and processing needs, integrating them seamlessly into the agentChef workflow.