let express = require('express');
let app = express();
let route = require('./routes/routes');
let filterRouter = require('./routes/filterRoutes'); // Renamed for clarity

const bodyParser = require('body-parser');
const mongoose = require('./database/db');
const cookieParser = require('cookie-parser');
require('dotenv').config();

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', route);
app.use('/filter', filterRouter); // Corrected this line

let port = process.env.PORT || 4010; // Added default port

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
