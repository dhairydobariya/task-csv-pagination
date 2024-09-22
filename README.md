const readmeContent = `
# Task Management Application

## Overview
This Task Management Application allows users to efficiently manage their tasks with features such as CSV import/export, complex filtering and sorting, pagination, and error handling.

## Features
1. **CSV Import/Export Functionality**
   - Users can export all tasks to a CSV file, which includes details such as:
     - Task Title
     - Description
     - Due Date
     - Priority
     - Status
     - Assigned Users
   - Bulk import of tasks via a CSV file with validation for:
     - Correct data format
     - Valid statuses
     - Non-empty required fields
   - Clear error messages for incorrect formats or missing fields
   - Limit on maximum CSV file size to ensure performance

2. **Data Validation and Error Handling**
   - Thorough validation of imported tasks, including:
     - Duplicate tasks check
     - Due date validation (cannot be in the past)
     - Non-empty task titles and uniqueness
   - Downloadable error report CSV for failed imports detailing rows and reasons for failure

3. **Complex Task Filtering and Sorting**
   - Users can filter and sort tasks by:
     - Status
     - Priority
     - Due Date
     - Assignee
   - Support for complex filters (e.g., high-priority tasks due this week)
   - Save and load custom filters for future use

4. **Pagination and Performance Optimization**
   - Implementation of pagination to improve performance with batch loading (10 or 20 tasks per page)
   - Optimization for handling large datasets during export and import operations

5. **Testing and Deployment**
   - Thorough testing of CSV import/export functionality with various data sets
   - Deployment of the updated application to Vercel for both frontend and backend
   - Ensured all new features are functional and meet performance expectations in the live environment

## Installation
1. Clone the repository:
   \`\`\`
   git clone https://github.com/yourusername/task-csv-pagination.git
   \`\`\`
2. Navigate to the project directory:
   \`\`\`
   cd task-csv-pagination
   \`\`\`
3. Install dependencies:
   \`\`\`
   npm install
   \`\`\`
4. Set up your environment variables in a .env file:
   \`\`\`
   PORT=your_port
   DATABASE_URL=your_database_url
   \`\`\`
5. Start the server:
   \`\`\`
   npm start
   \`\`\`

## Usage
- Access the application at \`http://localhost:your_port\`
- Use the provided endpoints for importing, exporting, filtering, and managing tasks.

## License
This project is licensed under the MIT License.

## Acknowledgements
- [Express.js](https://expressjs.com/) for server-side framework
- [Mongoose](https://mongoosejs.com/) for MongoDB object modeling
- [csv-parser](https://www.npmjs.com/package/csv-parser) for CSV parsing
- [dotenv](https://www.npmjs.com/package/dotenv) for environment variable management
`;

console.log(readmeContent);
