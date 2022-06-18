const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");
const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieSession({
    name: "ayolaundry-session",
    secret: "COOKIE_SECRET",
    httpOnly: true
}));

const db = require("./models");
const Role = db.role;
db.sequelize.sync();
// db.sequelize.sync({force: true}).then(() => {
//     console.log('Drop and Resync Db');
// });

app.get("/", (req, res) => {
    res.json({
        message: "Welcome to AyoLaundry!"
    })
});

require('./routes/auth.routes')(app);
require('./routes/toko.routes')(app);
require('./routes/product.routes')(app);
require('./routes/trans.routes')(app);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
