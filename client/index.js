const client = require('../client/client');
const path = require('path');
const express = require('express');

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(express.json());
app.use(express.urlencoded({ extended : false}));

app.get("/", (req, res) => {
    client.getAll(null, (err, data) => {
        if (!err) {
            res.render("jobs", {
                results: data.jobs
            });
        }
    });
});

app.post("/save", (req, res) => {
    let newJob = {
        company: req.body.company,
        role: req.body.role,
        location: req.body.location
    };

    client.insert(newJob, (err, data) => {
        if (err) throw err;

        console.log("Job created successfully", data);
        res.redirect("/");
    });
});

app.post("/update", (req, res) => {
    const updateJob = {
        id: req.body.id,
        company: req.body.company,
        role: req.body.role,
        location: req.body.location
    };

    client.update(updateJob, (err, data) => {
        if (err) throw err;

        console.log("Job updated successfully", data);
        res.redirect("/");
    });
});


app.post("/remove", (req, res) => {
    client.remove({ id: req.body.job_id }, (err, _) => {
        if (err) throw err;

        console.log("Job removed successfully");
        res.redirect("/");
    });
});

app.listen(5000,()=>{
    console.log('Client side Server Up');
})