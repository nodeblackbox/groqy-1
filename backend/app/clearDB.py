import qdrant_client
from qdrant_client.http.models import PointIdsSelector  # Ensure correct import

# Connect to Qdrant
client = qdrant_client.QdrantClient(url="http://localhost:6333")

# Specify the collection and point IDs you want to delete
try:
    client.delete(
        collection_name="Mind",
        points_selector=PointIdsSelector(ids=[1234, 5678])  # Correct usage
    )
    print("Points deleted successfully.")
except Exception as e:
    print(f"An error occurred: {e}")

# Optionally, you can drop the entire collection if needed:
# client.delete_collection(collection_name="Mind")
