import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import { logger } from "./winston/logger";
import { dataController } from "./controllers/dataController";
import { readConfigFile } from "./config";
import Kafka from "node-rdkafka";
import { MongoClient } from "mongodb";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/data", dataController);
const mongoClient = new MongoClient("mongodb://localhost:27017/mydatabase");

mongoose.connect("mongodb://localhost:27017/mydatabase");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  logger.info("MongoDB connected");
});

app.listen(3000, async () => {
  const config = readConfigFile("client.properties");
  config["group.id"] = "node-group";

  const consumer = new Kafka.KafkaConsumer(config, {
    "auto.offset.reset": "earliest",
  });

  consumer.connect();
  consumer.on("ready", () => {
    consumer.subscribe(["express-kafka-app"]);
    consumer.consume();
    console.log("Message Consuming Started");
  });
  consumer.on("data", async (message) => {
    const consumedMessage = message?.value
      ? JSON.parse(message?.value?.toString())
      : null;
    logger.info("consumed message: ", consumedMessage);

    const pipeline = [
      {
        $match: {
          gender: "female",
        },
      },
      {
        $group: {
          _id: {
            name: "$name",
            eyeColor: "$eyeColor",
            age: "$age",
          },
        },
      },
      {
        $merge: {
          into: "materialized_view",
          on: "_id",
          whenMatched: "replace",
          whenNotMatched: "insert",
        },
      },
    ];

    const materialized_view = mongoClient.db().collection("datamodels");
    const result = await materialized_view.aggregate(pipeline).toArray();
    materialized_view.insertOne({ result });
    logger.info("materialized_view created successfully", result);
  });

  logger.info("Server listening on port 3000");
});
