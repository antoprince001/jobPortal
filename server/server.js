const PROTO_PATH = '../jobs.proto';

const grpc = require('grpc');
const protoLoader = require("@grpc/proto-loader");

const packageDefinition = protoLoader.loadSync(PROTO_PATH,{
    keepCase : true,
    longs : String,
    enums : String,
    arrays : true
});

const jobsProto = grpc.loadPackageDefinition(packageDefinition);

const { v4 : uuidv4 } = require("uuid");

const server = new grpc.Server();

const jobs = [
    {
        id: "a68b823c-7ca6-44bc-b721-fb4d5312cafc",
        company: "Google",
        role: "SDE",
        location : "chennai"
    },
    {
        id: "34415c7c-f82d-4e44-88ca-ae2a1aaa92b7",
        company: "Microsoft",
        role: "Backend",
        location : "Chennai"
    }
];


server.addService(jobsProto.JobService.service, {
    getAll: (_, callback) => {
        callback(null, { jobs });
    },

    get: (call, callback) => {
        let job = jobs.find(n => n.id == call.request.id);

        if (job) {
            callback(null, job);
        } else {
            callback({
                code: grpc.status.NOT_FOUND,
                details: "Not found"
            });
        }
    },

    insert: (call, callback) => {
        let job = call.request;
        
        job.id = uuidv4();
        jobs.push(job);
        callback(null, job);
    },

    update: (call, callback) => {
        let existingJob = jobs.find(n => n.id == call.request.id);

        if (existingJob) {
            existingJob.company = call.request.company;
            existingJob.role = call.request.role;
            existingJob.location = call.request.location;
            callback(null, existingJob);
        } else {
            callback({
                code: grpc.status.NOT_FOUND,
                details: "Not found"
            });
        }
    },

    remove: (call, callback) => {
        let existingJobIndex = jobs.findIndex(
            n => n.id == call.request.id
        );

        if (existingJobIndex != -1) {
            jobs.splice(existingJobIndex, 1);
            callback(null, {});
        } else {
            callback({
                code: grpc.status.NOT_FOUND,
                details: "Not found"
            });
        }
    }
});

server.bind("127.0.0.1:3000", grpc.ServerCredentials.createInsecure());
console.log("Server running at http://127.0.0.1:3000");
server.start();
