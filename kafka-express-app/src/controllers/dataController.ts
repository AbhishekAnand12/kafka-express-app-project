import express, { Request, Response } from "express";
import { Producer } from "node-rdkafka";
import DataModel from "../models/DataModel";
import { logger } from "../winston/logger";
import { readConfigFile } from "../config";


export const dataController = async (req: Request, res: Response) => {
  try {
    const newData = await DataModel.insertMany(req.body);
    res.status(201).send(newData);

    logger.info("data saved successfully::", newData);

    const producer = new Producer(readConfigFile("client.properties"));
    producer.connect();

    producer.on("ready", () => {
      const jsonString = JSON.stringify(newData);
      const producedMessage = producer.produce(
        "express-kafka-app",
        -1,
        Buffer.from(jsonString)
      );
      logger.info("message produced to kafka", producedMessage);
    });

  } catch (err: any) {
    res.status(500).send(err.message);
  }
};
