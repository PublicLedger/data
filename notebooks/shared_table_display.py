"""
Shared table display utilities for election data notebooks.
"""

from IPython.display import Markdown, display


def sanitize_markdown_cell(value):
    """Escape pipes and newlines so markdown table formatting stays intact."""
    text = str(value)
    return text.replace('|', '\\|').replace('\n', ' ').strip()


def display_markdown_table(rows, columns):
    """
    Display a list of dictionaries as a markdown table in Jupyter.
    
    Args:
        rows: List of dictionaries containing the data
        columns: List of column names to display, in order
        
    Returns:
        The full markdown table as a string
    """
    if not rows:
        print('No rows to display.')
        return ''
    
    # Build header row
    header_row = '| ' + ' | '.join(columns) + ' |'
    
    # Build separator row
    separator_row = '| ' + ' | '.join(['---'] * len(columns)) + ' |'
    
    # Build all data rows
    all_data_rows = [
        '| ' + ' | '.join(
            sanitize_markdown_cell(row.get(column, ''))
            for column in columns
        ) + ' |'
        for row in rows
    ]
    
    # Build and display full table
    full_markdown_table = '\n'.join([header_row, separator_row, *all_data_rows])
    display(Markdown(full_markdown_table))
    
    return full_markdown_table
