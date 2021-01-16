const PROTO_PATH = "../jobs.proto";

const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");

var packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    arrays: true
});

const JobService = grpc.loadPackageDefinition(packageDefinition).JobService;
const client = new JobService(
    "localhost:3000",
    grpc.credentials.createInsecure()
);

module.exports = client;