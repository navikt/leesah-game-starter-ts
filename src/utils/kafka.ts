import dotenv from "dotenv";
import fs from "fs";
import { Consumer, Kafka, Producer } from "kafkajs";
import { v4 as uuidv4 } from "uuid";
import YAML from "yaml";
import { MessageType, Question } from "../types";

dotenv.config();

const certsYAMLAsJSON =
  process.env.IS_NAIS === "true"
    ? YAML.parse(fs.readFileSync("./certs/leesah-quiz-certs.yaml", "utf-8"))
    : undefined;

const QUIZ_TOPIC = certsYAMLAsJSON?.topics[0] ?? "topic-test";

const BROKER_URL = certsYAMLAsJSON?.broker ?? `${process.env.HOST_IP}:9092`;
const CONSUMER_GROUP_ID = process.env.IS_NAIS
  ? `new-group-${Math.random()}`
  : "test-group";

let producer: Producer;
let teamName: string;

export const loadKafka = async (
  team: string,
): Promise<{ consumer: Consumer }> => {
  if (!BROKER_URL)
    throw new Error(`Broker url er feil! Broker url: ${BROKER_URL}`);

  teamName = team;

  const kafka = new Kafka({
    clientId: `leesah-game-${team}`,
    brokers: [BROKER_URL],
    ssl:
      process.env.IS_NAIS === "true"
        ? {
            rejectUnauthorized: false,
            ca: [certsYAMLAsJSON.ca],
            key: certsYAMLAsJSON.user.access_key,
            cert: certsYAMLAsJSON.user.access_cert,
          }
        : undefined,
  });

  const consumer = kafka.consumer({ groupId: CONSUMER_GROUP_ID });
  await consumer.connect();
  await consumer.subscribe({ topic: QUIZ_TOPIC, fromBeginning: true });

  producer = kafka.producer();
  await producer.connect();

  return { consumer };
};

export const answerQuestion = async (question: Question, answer: string) => {
  await producer.send({
    topic: QUIZ_TOPIC,
    messages: [
      {
        value: JSON.stringify({
          messageId: uuidv4(),
          type: MessageType.Answer,
          created: new Date().toISOString(),
          questionId: question.messageId,
          category: question.category,
          teamName,
          answer,
        }),
      },
    ],
  });
};
