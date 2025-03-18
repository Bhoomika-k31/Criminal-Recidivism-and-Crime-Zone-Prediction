from flask import Flask, render_template, request
import csv

app = Flask(__name__)

# Function to read CSV data and parse it
def read_csv(file_path):
    with open(file_path, 'r') as file:
        reader = csv.reader(file)
        data = [row for row in reader]
    return data

# Home route
@app.route('/')
def home():
    return render_template('index.html')  # Render index.html from the templates folder

# View Database route
@app.route('/view-database')
def view_database():
    data = read_csv('C:\\Users\\KUMAR NAIK\\Desktop\\7th sem project\\jail proj\\synthetic_recidivism_data.csv')  # Path to the CSV file
    headers = data[0]  # The first row contains headers
    rows = data[1:]  # All rows after the header are data
    return render_template('database.html', headers=headers, rows=rows)  # Render database.html

# Search route to find a person by Unique_ID
@app.route('/search', methods=['GET'])
def search():
    search_id = request.args.get('search-id', '')  # Get the search ID from the query string
    data = read_csv('C:\\Users\\KUMAR NAIK\\Desktop\\7th sem project\\jail proj\\synthetic_recidivism_data.csv')  # Read CSV data
    headers = data[0]  # Headers
    rows = data[1:]  # Data rows

    # Find rows with the matching Unique_ID (assuming Unique_ID is the first column)
    matching_rows = [row for row in rows if row[0].strip() == search_id]

    # Return either matching rows or a "not found" message
    if matching_rows:
        return render_template('database.html', headers=headers, rows=matching_rows)  # Render matched rows
    else:
        message = f"No results found for ID: {search_id}"
        return render_template('database.html', message=message)  # Render with the message

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)
