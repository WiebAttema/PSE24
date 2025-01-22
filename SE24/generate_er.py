from backend.__init__ import create_app
from backend.db_models import db
from sqlalchemy_schemadisplay import create_schema_graph

# Create an application instance using the factory
app = create_app()

# Create a context to access the database
with app.app_context():
    # Generate the ER diagram
    graph = create_schema_graph(
        metadata=db.Model.metadata,
        engine=db.engine,
        show_datatypes=True,  # Show datatypes in the diagram
        show_indexes=True,  # Show indexes in the diagram
        rankdir="LR",  # Left to right layout
        concentrate=False,  # Don't merge multiple edges
    )

    # Save the diagram to a file
    graph.write_png("er_diagram.png")

