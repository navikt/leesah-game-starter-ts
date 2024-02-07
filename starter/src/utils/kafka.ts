import dotenv from 'dotenv'
import YAML from 'yaml'
import fs from 'fs'
import { Consumer, Kafka, KafkaMessage, Producer } from 'kafkajs'
import { LeesahMessage, MessageType, Question } from '../types'
import { v4 as uuidv4 } from 'uuid';

dotenv.config()

const certsYAMLAsJSON = process.env.IS_NAIS ? YAML.parse(fs.readFileSync('../certs/leesah-quiz-certs.yaml', 'utf-8')) : undefined

const QUIZ_TOPIC = certsYAMLAsJSON.topics[0] ?? "topic-test"

const BROKER_URL = certsYAMLAsJSON.broker ?? `${process.env.HOST_IP}:9092`
const CONSUMER_GROUP_ID = process.env.IS_NAIS ? `new-group-${Math.random()}` : "test-group"

export const loadKafka = async (teamName: string): Promise<{ consumer: Consumer, producer: Producer }> => {
    if (!BROKER_URL) throw new Error(`Broker url er feil! Broker url: ${BROKER_URL}`)

    const kafka = new Kafka({
        clientId: `leesah-game-${teamName}`,
        brokers: [BROKER_URL],
        ssl: process.env.IS_NAIS ? {
            rejectUnauthorized: false,
            ca: [certsYAMLAsJSON.ca],
            key: certsYAMLAsJSON.user.access_key,
            cert: certsYAMLAsJSON.user.access_cert
        } : undefined
    })

    const consumer = kafka.consumer({ groupId: CONSUMER_GROUP_ID})
    await consumer.connect()
    await consumer.subscribe({ topic: QUIZ_TOPIC, fromBeginning: true })

    const producer = kafka.producer()
    await producer.connect()

    return { consumer, producer }
}

export const answerQuestion = async (producer: Producer, teamName: string, question: Question, answer: string) => {
    await producer.send({ topic: QUIZ_TOPIC, messages: [{ value: JSON.stringify({
        messageId: uuidv4(),
        type: MessageType.Answer,
        created: new Date().toISOString(),
        questionId: question.messageId,
        category: question.category,
        teamName,
        answer
    }) }] })
}