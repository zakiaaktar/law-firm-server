const express = require('express')
const cors = require('cors');
//const jwt = require('jsonwebtoken');

require('dotenv').config();



const app = express();
const port = process.env.PORT || 4000;


// middle wares
app.use(cors());
app.use(express.json());





app.get('/', (req, res) => {
    res.send('Law Firm server is running');
});

app.listen(port, () => {
    console.log(`Law Firm server running on ${port}`);
})