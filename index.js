const express = require('express')
const cors = require('cors');
//const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();


const app = express();
const port = process.env.PORT || 2000;


// middle wares
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.xwlx9fx.mongodb.net/?retryWrites=true&w=majority`;
//console.log(uri);


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});




async function run() {
    try {
        const appointmentOptionCollection = client.db('lawFirm').collection('appointmentOptions');
        const bookingsCollection = client.db('lawFirm').collection('bookings');



        app.get('/appointmentOptions', async (req, res) => {
            const date = req.query.date;
            //console.log(date);
            const query = {};
            const options = await appointmentOptionCollection.find(query).toArray();
            const bookingQuery = { appointmentDate: date }
            const alreadyBooked = await bookingsCollection.find(bookingQuery).toArray();
            options.forEach(option => {
                const optionBooked = alreadyBooked.filter(book => book.treatment === option.name);
                const bookedSlots = optionBooked.map(book => book.slot);
                const remainingSlots = option.slots.filter(slot => !bookedSlots.includes(slot))
                option.slots = remainingSlots;
                //console.log(date, option.name, remainingSlots.length);
            })
            res.send(options);
        });


        app.post('/bookings', async (req, res) => {
            const booking = req.body;
            //console.log(booking);
            const result = await bookingsCollection.insertOne(booking);
            res.send(result);
        })


    }




    finally {

    }
}
run().catch(console.log);







// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);







app.get('/', (req, res) => {
    res.send('Law Firm server is running');
});

app.listen(port, () => {
    console.log(`Law Firm server running on ${port}`);
})